import { createClient } from "@sanity/client";
import matter from "gray-matter";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDirectory = path.join(root, "content", "posts");
const projectId = process.env.SANITY_PROJECT_ID || "vb4eh60i";
const dataset = process.env.SANITY_DATASET || "production";
const apiVersion = process.env.SANITY_API_VERSION || "2025-02-19";
const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error("Missing SANITY_API_TOKEN. No content was written.");
  process.exit(1);
}
if (dataset !== "production") {
  console.error(`Refusing to migrate to non-production dataset "${dataset}".`);
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  perspective: "raw",
});

const report = { imported: [], skipped: [], failed: [], warnings: [] };
const uploadedAssets = new Map();

function toString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function toTags(value) {
  if (Array.isArray(value)) return value.map((tag) => String(tag).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value.split(",").map((tag) => tag.trim().replace(/^['"]|['"]$/g, "")).filter(Boolean);
  }
  return [];
}

function toDate(value, filename) {
  const dateValue = value || filename.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
  if (!dateValue) return null;
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function assetSource(value, postPath) {
  const source = toString(value);
  if (!source || /^https?:\/\//i.test(source) || source.startsWith("data:")) return null;
  const clean = decodeURIComponent(source.split(/[?#]/, 1)[0]).replace(/^[/\\]+/, "");
  const candidates = source.startsWith("/")
    ? [path.join(root, "public", clean)]
    : [path.resolve(path.dirname(postPath), clean), path.join(root, "public", clean)];
  return candidates.find((candidate) => {
    const resolved = path.resolve(candidate);
    return (
      (resolved.startsWith(path.join(root, "public") + path.sep) ||
        resolved.startsWith(path.join(root, "content") + path.sep))
    );
  }) || null;
}

async function uploadImage(value, postPath, altText) {
  const source = toString(value);
  if (!source) return null;
  const localPath = assetSource(source, postPath);
  if (!localPath) {
    if (/^https?:\/\//i.test(source)) return { imageUrl: source };
    return { imageUrl: source, warning: `Image path not found: ${source}` };
  }

  const existing = uploadedAssets.get(localPath);
  if (existing) return { image: existing, alt: altText || "" };
  const fileInfo = await stat(localPath);
  if (!fileInfo.isFile()) throw new Error(`Image is not a file: ${source}`);
  const asset = await client.assets.upload("image", await readFile(localPath), {
    filename: path.basename(localPath),
  });
  const image = { _type: "image", asset: { _type: "reference", _ref: asset._id }, alt: altText || "" };
  uploadedAssets.set(localPath, image);
  return { image, alt: altText || "" };
}

function normalizeGallery(value) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    if (typeof item === "string") return { image: item, caption: "" };
    if (!item || typeof item !== "object") return null;
    return {
      image: item.image || item.url || item.path || item.src,
      caption: toString(item.caption || item.description || item.title),
      alt: toString(item.alt || item.caption || item.description),
    };
  }).filter((item) => item?.image);
}

async function migrateFile(filename) {
  const postPath = path.join(sourceDirectory, filename);
  const raw = await readFile(postPath, "utf8");
  const parsed = matter(raw);
  const data = parsed.data;
  const legacyId = path.basename(filename, ".md");
  const title = toString(data.title);
  const date = toDate(data.date, legacyId);
  const body = parsed.content.trim();
  const description = toString(data.description) || body.replace(/[#*_`>\[\]]/g, "").slice(0, 250).trim();

  if (!title || title.length > 120 || !date || !body || !description || description.length > 300) {
    throw new Error("Required field missing or invalid (title, description, date, or body).");
  }

  const tags = toTags(data.tags);
  const slug = toString(data.slug) || legacyId;
  const documentId = `post-${legacyId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  const existingId = await client.fetch(
    '*[_type == "post" && (legacyId == $legacyId || slug.current == $slug)][0]._id',
    { legacyId, slug }
  );
  if (existingId) {
    report.skipped.push({ filename, documentId: existingId, reason: "matching document already exists" });
    return;
  }

  const singleCover = data.cover_image || data.thumbnail || data.image;
  const cover = await uploadImage(
    singleCover,
    postPath,
    toString(data.cover_image_alt || data.cover_image_caption || data.caption || title)
  );
  if (cover?.warning) report.warnings.push({ filename, message: cover.warning });

  const rawGallery = normalizeGallery(data.cover_images || data.gallery);
  const gallery = [];
  for (const item of rawGallery) {
    const uploaded = await uploadImage(item.image, postPath, item.alt || item.caption || title);
    if (uploaded?.warning) report.warnings.push({ filename, message: uploaded.warning });
    if (uploaded) {
      gallery.push({
        ...(uploaded.image ? { image: uploaded.image } : {}),
        ...(uploaded.imageUrl ? { imageUrl: uploaded.imageUrl } : {}),
        ...(item.alt ? { alt: item.alt } : {}),
        ...(item.caption ? { caption: item.caption } : {}),
      });
    }
  }

  if (cover && gallery.length) {
    const alreadyInGallery = gallery.some(
      (item) =>
        (cover.image && item.image?.asset?._ref === cover.image.asset._ref) ||
        (cover.imageUrl && item.imageUrl === cover.imageUrl)
    );
    if (!alreadyInGallery) {
      gallery.unshift({
        ...(cover.image ? { image: cover.image } : {}),
        ...(cover.imageUrl ? { imageUrl: cover.imageUrl } : {}),
        alt: toString(data.cover_image_alt || data.cover_image_caption || data.caption || title),
        ...(toString(data.cover_image_caption || data.caption)
          ? { caption: toString(data.cover_image_caption || data.caption) }
          : {}),
      });
    }
  }

  const categoryValue = data.category || data.categories;
  const category = Array.isArray(categoryValue)
    ? toString(categoryValue[0])
    : toString(categoryValue);
  const document = {
    _id: documentId,
    _type: "post",
    title,
    slug: { _type: "slug", current: slug },
    legacyId,
    description,
    category: category || "Artikel",
    author: toString(data.author) || "Admin",
    ...(toString(data.editor) ? { editor: toString(data.editor) } : {}),
    ...(toString(data.photographer) ? { photographer: toString(data.photographer) } : {}),
    ...(toString(data.author_email) ? { authorEmail: toString(data.author_email) } : {}),
    publishedAt: date,
    tags,
    ...(cover?.image ? { coverImage: cover.image } : {}),
    ...(cover?.imageUrl ? { coverImageUrl: cover.imageUrl } : {}),
    ...(singleCover
      ? { coverImageAlt: toString(data.cover_image_alt || data.cover_image_caption || data.caption || title) }
      : {}),
    ...(toString(data.cover_image_caption || data.caption)
      ? { coverImageCaption: toString(data.cover_image_caption || data.caption) }
      : {}),
    ...(gallery.length ? { coverImages: gallery } : {}),
    body,
    ...(toString(data.meta_title) ? { metaTitle: toString(data.meta_title) } : {}),
    ...(toString(data.meta_description) ? { metaDescription: toString(data.meta_description) } : {}),
  };

  const result = await client.createIfNotExists(document);
  report.imported.push({ filename, documentId: result._id, title });
}

try {
  const files = (await readdir(sourceDirectory))
    .filter((filename) => filename.toLowerCase().endsWith(".md"))
    .sort();

  if (files.length === 0) {
    console.log(JSON.stringify({ message: "No Markdown posts found.", ...report }, null, 2));
    process.exit(0);
  }

  for (const filename of files) {
    try {
      await migrateFile(filename);
    } catch (error) {
      report.failed.push({
        filename,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }
} catch (error) {
  console.error("Migration could not read content/posts:", error);
  process.exit(1);
}

console.log(JSON.stringify(report, null, 2));
if (report.failed.length > 0) process.exitCode = 1;
