import { createClient } from "@sanity/client";

export interface CoverImageItem {
  url: string;
  caption?: string;
  alt?: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  editor?: string;
  photographer?: string;
  authorEmail?: string;
  body: string;
  tags: string[];
  cover_image?: string;
  cover_image_alt?: string;
  cover_image_caption?: string;
  cover_images: CoverImageItem[];
  meta_title?: string;
  meta_description?: string;
}

const projectId =
  process.env.SANITY_PROJECT_ID ||
  process.env.VITE_SANITY_PROJECT_ID ||
  "vb4eh60i";
const dataset =
  process.env.SANITY_DATASET ||
  process.env.VITE_SANITY_DATASET ||
  "production";
const apiVersion =
  process.env.SANITY_API_VERSION ||
  process.env.VITE_SANITY_API_VERSION ||
  "2025-02-19";

const sanity = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

const postFields = `
  "id": coalesce(legacyId, slug.current),
  title,
  description,
  "excerpt": coalesce(description, ""),
  category,
  "date": publishedAt,
  author,
  editor,
  photographer,
  authorEmail,
  body,
  tags,
  "cover_image": coalesce(coverImage.asset->url, coverImageUrl),
  "cover_image_alt": coalesce(coverImage.alt, coverImageAlt),
  "cover_image_caption": coverImageCaption,
  "cover_images": coverImages[]{
    "url": coalesce(image.asset->url, imageUrl),
    caption,
    "alt": coalesce(image.alt, alt)
  },
  "meta_title": metaTitle,
  "meta_description": metaDescription
`;

const visiblePosts = `
  _type == "post" &&
  defined(publishedAt) &&
  publishedAt <= now()
`;

function toPost(post: Omit<Post, "date"> & { date: string }): Post {
  return {
    ...post,
    date: new Date(post.date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    tags: post.tags ?? [],
    cover_images: (post.cover_images ?? []).filter(
      (image): image is CoverImageItem => Boolean(image?.url)
    ),
  };
}

export async function getPosts(): Promise<Post[]> {
  const posts = await sanity.fetch<Array<Omit<Post, "date"> & { date: string }>>(
    `*[${visiblePosts}] | order(publishedAt desc) { ${postFields} }`
  );
  return posts.map(toPost);
}

export async function getPostByPath(id: string): Promise<Post | null> {
  const post = await sanity.fetch<
    (Omit<Post, "date"> & { date: string }) | null
  >(
    `*[${visiblePosts} && (legacyId == $id || slug.current == $id)][0] { ${postFields} }`,
    { id }
  );
  return post ? toPost(post) : null;
}

export async function getRelatedPosts(id: string, category: string): Promise<Post[]> {
  const posts = await sanity.fetch<Array<Omit<Post, "date"> & { date: string }>>(
    `*[${visiblePosts} && coalesce(legacyId, slug.current) != $id]
      | order(category != $category, publishedAt desc)[0...4] { ${postFields} }`,
    { id, category }
  );
  return posts.map(toPost);
}
