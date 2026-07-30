export interface CoverImageItem {
  url: string;
  caption?: string;
}

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
// Helper Parser YAML Frontmatter
// ======================
function parseYamlFrontmatter(frontmatterStr: string): Record<string, any> {
  const result: Record<string, any> = {};
  const lines = frontmatterStr.split(/\r?\n/);

  let currentKey: string | null = null;
  let currentList: any[] | null = null;
  let currentObject: Record<string, any> | null = null;

  for (let line of lines) {
    if (!line.trim() || line.trim().startsWith("#")) continue;

    // Check for list item with key-value or string: e.g. "  - image: xyz" or "  - xyz"
    const listItemMatch = line.match(/^(\s+)-\s+(.*)$/);
    if (listItemMatch) {
      const content = listItemMatch[2].trim();

      if (!currentList && currentKey) {
        currentList = [];
        result[currentKey] = currentList;
      }

      const kvMatch = content.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
      if (kvMatch) {
        currentObject = {};
        const key = kvMatch[1].trim();
        let val = kvMatch[2].trim().replace(/^['"]|['"]$/g, "");
        currentObject[key] = val;
        if (currentList) currentList.push(currentObject);
      } else {
        currentObject = null;
        let val = content.replace(/^['"]|['"]$/g, "");
        if (currentList) currentList.push(val);
      }
      continue;
    }

    // Check for nested object property under list item: e.g. "    caption: Deskripsi foto"
    const nestedKvMatch = line.match(/^(\s+)([a-zA-Z0-9_]+):\s*(.*)$/);
    if (nestedKvMatch && currentObject && currentList) {
      const indent = nestedKvMatch[1].length;
      if (indent >= 4) {
        const key = nestedKvMatch[2].trim();
        let val = nestedKvMatch[3].trim().replace(/^['"]|['"]$/g, "");
        currentObject[key] = val;
        continue;
      }
    }

    // Top-level key: e.g. "title: Hello World" or "cover_images:"
    const topKvMatch = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (topKvMatch) {
      currentKey = topKvMatch[1].trim();
      currentList = null;
      currentObject = null;

      let val = topKvMatch[2].trim();
      if (val) {
        if (
          (val.startsWith('"') && val.endsWith('"')) ||
          (val.startsWith("'") && val.endsWith("'"))
        ) {
          val = val.slice(1, -1);
        }
        result[currentKey] = val;
      }
      continue;
    }
  }

  return result;
}

// ======================
// Ambil latest commit SHA (dengan ETag + cache)
// ======================
async function getLatestCommitSha(
  owner: string,
  repo: string,
  branch = "main"
): Promise<string> {
  const now = Date.now();

  if (commitCache && now - commitCache.time < CACHE_TTL) {
    return commitCache.data;
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/commits/${branch}`;

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    // Include GitHub PAT if provided to increase rate limits
    ...(process.env.GITHUB_PAT ? { Authorization: `token ${process.env.GITHUB_PAT}` } : {}),
  };

  if (commitCache?.etag) {
    headers["If-None-Match"] = commitCache.etag;
  }

  const res = await fetch(url, { headers });

  if (res.status === 304 && commitCache) {
    commitCache.time = now;
    return commitCache.data;
  }

  if (!res.ok) {
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

  if (postsCache && now - postsCache.time < CACHE_TTL) {
    return postsCache.data;
  }

  try {
    const branch = await getLatestCommitSha(owner, repo, "main");

    const apiUrl = `https://data.jsdelivr.com/v1/package/gh/${owner}/${repo}@${branch}/flat`;

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

    const posts = await Promise.all(
      mdFiles.map(async (file: any) => {
        try {
          const contentResponse = await fetch(file.download_url);

          if (!contentResponse.ok) return null;

          const markdown = await contentResponse.text();

          const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
          const match = markdown.match(frontmatterRegex);

          if (!match) return null;

          const [, frontmatterStr, body] = match;
          const frontmatter = parseYamlFrontmatter(frontmatterStr);

          const cleanedTags = frontmatter.tags
            ? parseTags(frontmatter.tags)
            : [];

          const coverImageItems: CoverImageItem[] = [];

          // 1. Process cover_images or gallery list
          const rawList = Array.isArray(frontmatter.cover_images)
            ? frontmatter.cover_images
            : Array.isArray(frontmatter.gallery)
              ? frontmatter.gallery
              : [];

          for (let item of rawList) {
            if (typeof item === "string" && item.trim()) {
              const resolvedUrl = resolveCoverImage(item, owner, repo, branch);
              if (resolvedUrl) coverImageItems.push({ url: resolvedUrl });
            } else if (item && typeof item === "object") {
              const rawUrl = item.image || item.url || item.path || item.src;
              const caption = item.caption || item.description || item.title || item.alt;
              if (rawUrl && typeof rawUrl === "string") {
                const resolvedUrl = resolveCoverImage(rawUrl, owner, repo, branch);
                if (resolvedUrl) {
                  coverImageItems.push({
                    url: resolvedUrl,
                    caption: typeof caption === "string" && caption.trim() ? caption.trim() : undefined,
                  });
                }
              }
            }
          }

          // 2. Process single cover_image if not in list
          const singleCover = frontmatter.thumbnail || frontmatter.cover_image;
          const singleCaption = frontmatter.cover_image_caption || frontmatter.caption;

          if (singleCover && typeof singleCover === "string") {
            const resolvedUrl = resolveCoverImage(singleCover, owner, repo, branch);
            if (resolvedUrl && !coverImageItems.some((i) => i.url === resolvedUrl)) {
              coverImageItems.unshift({
                url: resolvedUrl,
                caption: typeof singleCaption === "string" && singleCaption.trim() ? singleCaption.trim() : undefined,
              });
            }
          }

          return {
            id: (file.name as string).replace(/\.md$/, ""),
            title: frontmatter.title || "Untitled",
            description: frontmatter.description || "",
            excerpt:
              frontmatter.description ||
              body.slice(0, 150).trim() + "...",
            category: (() => {
              const rawCat = frontmatter.category || frontmatter.categories;
              if (Array.isArray(rawCat) && rawCat.length > 0) return String(rawCat[0]).trim();
              if (typeof rawCat === "string" && rawCat.trim()) return rawCat.trim();
              if (Array.isArray(cleanedTags) && cleanedTags.length > 0) return cleanedTags[0];
              return "Artikel";
            })(),
            date:
              frontmatter.date ||
              new Date().toLocaleDateString("id-ID"),
            author: frontmatter.author || "Admin",
            body,
            tags: cleanedTags,
            cover_image: coverImageItems[0]?.url,
            cover_images: coverImageItems,
          };
        } catch (error) {
          console.error(`Failed to fetch content for ${file.name}:`, error);
          return null;
        }
      })
    );

    const result = posts.filter((post) => post !== null);

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
// ======================
function resolveCoverImage(
  rawPath: string | undefined,
  owner: string,
  repo: string,
  branch: string
): string | undefined {
  if (!rawPath) return undefined;

  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
    return rawPath;
  }

  const cleanPath = rawPath.startsWith("/") ? rawPath.slice(1) : rawPath;
  return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${cleanPath}`;
}