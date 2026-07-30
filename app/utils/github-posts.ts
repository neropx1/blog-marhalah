// ======================
// Cache sederhana (in-memory)
// ======================
type CacheEntry<T> = {
  data: T;
  etag?: string | null;
  time: number;
};

const CACHE_TTL = 2 * 60 * 1000; // 2 menit

let commitCache: CacheEntry<string> | null = null;
let postsCache: CacheEntry<any[]> | null = null;

// ======================
// Ambil latest commit SHA (dengan ETag + cache)
// ======================
async function getLatestCommitSha(
  owner: string,
  repo: string,
  branch = "main"
): Promise<string> {
  const now = Date.now();

  // Pakai cache kalau masih valid
  if (commitCache && now - commitCache.time < CACHE_TTL) {
    return commitCache.data;
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/commits/${branch}`;

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    // Optional: tambah token biar limit lebih tinggi
    // Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  };

  // Kirim ETag kalau ada (conditional request)
  if (commitCache?.etag) {
    headers["If-None-Match"] = commitCache.etag;
  }

  const res = await fetch(url, { headers });

  // 304 = data belum berubah → pakai cache lama, tidak kena rate limit
  if (res.status === 304 && commitCache) {
    commitCache.time = now; // perpanjang umur cache
    return commitCache.data;
  }

  if (!res.ok) {
    // Fallback ke cache lama kalau ada
    if (commitCache) return commitCache.data;
    throw new Error(`Gagal ambil commit SHA: ${res.status}`);
  }

  const data = await res.json();
  const sha = data.sha as string;
  const etag = res.headers.get("ETag");

  commitCache = {
    data: sha,
    etag,
    time: now,
  };

  return sha;
}

// ======================
// Fetch posts (jsDelivr + cache)
// ======================
export async function fetchPostsFromGithub() {
  const owner = "neropx1";
  const repo = "test-cms-decap";
  const path = "content/posts";
  const now = Date.now();

  // Cache posts
  if (postsCache && now - postsCache.time < CACHE_TTL) {
    return postsCache.data;
  }

  try {
    // Ambil commit terbaru (dengan ETag + cache)
    const branch = await getLatestCommitSha(owner, repo, "main");

    const apiUrl = `https://data.jsdelivr.com/v1/package/gh/${owner}/${repo}@${branch}/flat`;
    console.log(apiUrl);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error(
        "Failed to fetch from jsDelivr:",
        response.statusText,
        apiUrl
      );
      return postsCache?.data ?? [];
    }

    const data = await response.json();

    if (!data.files || !Array.isArray(data.files)) {
      return postsCache?.data ?? [];
    }

    // Filter hanya markdown di content/posts
    const mdFiles = data.files
      .filter(
        (file: any) =>
          file.name.startsWith(`/${path}/`) && file.name.endsWith(".md")
      )
      .map((file: any) => {
        const filename = file.name.split("/").pop();

        return {
          name: filename,
          path: file.name.replace("/", ""),
          download_url: `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}${file.name}`,
        };
      });

    // Fetch isi markdown
    const posts = await Promise.all(
      mdFiles.map(async (file: any) => {
        try {
          const contentResponse = await fetch(file.download_url);

          if (!contentResponse.ok) return null;

          const markdown = await contentResponse.text();

          // Parse frontmatter — robust parser for Decap CMS YAML
          const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
          const match = markdown.match(frontmatterRegex);

          if (!match) return null;

          const [, frontmatterStr, body] = match;
          const frontmatter: Record<string, any> = {};
          let currentKey: string | null = null;
          const listBuffer: string[] = [];

          const flushList = () => {
            if (currentKey && listBuffer.length > 0) {
              frontmatter[currentKey] = [...listBuffer];
              listBuffer.length = 0;
            }
          };

          frontmatterStr.split(/\r?\n/).forEach((line: string) => {
            // YAML list item (e.g. "  - tag")
            if (/^\s+-\s+/.test(line)) {
              const val = line.replace(/^\s+-\s+/, "").trim().replace(/^['"]|['"]$/g, "");
              listBuffer.push(val);
              return;
            }

            // New key: flush previous list if any
            flushList();
            currentKey = null;

            const colonIdx = line.indexOf(": ");
            if (colonIdx === -1) {
              // Key with no inline value (list follows)
              const keyOnly = line.trim().replace(/:$/, "");
              if (keyOnly) currentKey = keyOnly;
              return;
            }

            const key = line.slice(0, colonIdx).trim();
            let value = line.slice(colonIdx + 2).trim();

            // Strip surrounding quotes
            if (
              (value.startsWith('"') && value.endsWith('"')) ||
              (value.startsWith("'") && value.endsWith("'"))
            ) {
              value = value.slice(1, -1);
            }

            frontmatter[key] = value;
            currentKey = key;
          });

          // Flush any remaining list
          flushList();

          const cleanedTags = frontmatter.tags
            ? parseTags(frontmatter.tags)
            : [];

          return {
            id: (file.name as string).replace(/\.md$/, ""),
            title: frontmatter.title || "Untitled",
            description: frontmatter.description || "",
            excerpt:
              frontmatter.description ||
              body.slice(0, 150).trim() + "...",
            category: Array.isArray(cleanedTags) && cleanedTags.length
              ? cleanedTags[0]
              : (typeof cleanedTags === "string" ? cleanedTags : "Artikel"),
            date:
              frontmatter.date ||
              new Date().toLocaleDateString("id-ID"),
            author: frontmatter.author || "Admin",
            body,
            tags: cleanedTags,
            cover_image: resolveCoverImage(frontmatter.thumbnail || frontmatter.cover_image, owner, repo, branch),
          };
        } catch (error) {
          console.error(`Failed to fetch content for ${file.name}:`, error);
          return null;
        }
      })
    );

    const result = posts.filter((post) => post !== null);

    // Simpan ke cache
    postsCache = {
      data: result,
      time: now,
    };

    return result;
  } catch (error) {
    console.error("Error fetching posts from jsDelivr:", error);
    return postsCache?.data ?? [];
  }
}

// ======================
// Parse tags
// ======================
function parseTags(tagsInput: any): string[] {
  if (!tagsInput) return [];

  if (Array.isArray(tagsInput)) {
    return tagsInput.map((t) => String(t).trim());
  }

  const tagsStr = String(tagsInput);
  const match = tagsStr.match(/\[(.*?)\]/);

  if (match) {
    return match[1]
      .split(",")
      .map((tag) => tag.trim().replace(/['"\s]/g, ""));
  }

  return [tagsStr];
}

// ======================
// Resolve cover_image from Decap CMS frontmatter
// Decap CMS stores images as relative paths like: /images/uploads/photo.jpg
// We convert them to jsDelivr CDN URLs
// ======================
function resolveCoverImage(
  rawPath: string | undefined,
  owner: string,
  repo: string,
  branch: string
): string | undefined {
  if (!rawPath) return undefined;

  // Already an absolute URL → return as-is
  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
    return rawPath;
  }

  // Relative path → convert to jsDelivr CDN URL
  // Strip leading slash if present
  const cleanPath = rawPath.startsWith("/") ? rawPath.slice(1) : rawPath;
  return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${cleanPath}`;
}