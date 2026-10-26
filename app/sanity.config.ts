import { defineConfig, defineField, defineType } from "sanity";
import { structureTool } from "sanity/structure";

const projectId =
  import.meta.env.VITE_SANITY_PROJECT_ID ||
  import.meta.env.SANITY_PROJECT_ID ||
  "vb4eh60i";
const dataset =
  import.meta.env.VITE_SANITY_DATASET ||
  import.meta.env.SANITY_DATASET ||
  "production";
const apiVersion =
  import.meta.env.VITE_SANITY_API_VERSION ||
  import.meta.env.SANITY_API_VERSION ||
  "2025-02-19";

const post = defineType({
  name: "post",
  title: "Artikel",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Judul",
      type: "string",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 160 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "legacyId",
      title: "ID URL lama",
      description: "Mempertahankan URL /post/... yang sudah ada.",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "description",
      title: "Deskripsi singkat",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: {
        list: ["Berita", "Artikel", "Santri", "Maklumat", "Pengumuman"],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Penulis",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "editor", title: "Editor", type: "string" }),
    defineField({ name: "photographer", title: "Fotografer", type: "string" }),
    defineField({ name: "authorEmail", title: "Email penulis", type: "string" }),
    defineField({
      name: "publishedAt",
      title: "Tanggal publikasi",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tag",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "coverImage",
      title: "Gambar sampul utama",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Teks alternatif",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "coverImageUrl",
      title: "URL / jalur gambar sampul lama",
      description: "Digunakan untuk gambar lama yang belum diunggah ke Sanity.",
      type: "string",
    }),
    defineField({
      name: "coverImageAlt",
      title: "Teks alternatif gambar sampul",
      type: "string",
    }),
    defineField({
      name: "coverImageCaption",
      title: "Keterangan gambar sampul",
      type: "string",
    }),
    defineField({
      name: "coverImages",
      title: "Galeri / gambar sampul tambahan",
      type: "array",
      of: [
        defineType({
          name: "coverImageItem",
          title: "Gambar galeri",
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Gambar",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Teks alternatif",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
              ],
            }),
            defineField({
              name: "imageUrl",
              title: "URL / jalur gambar lama",
              type: "string",
            }),
            defineField({
              name: "alt",
              title: "Teks alternatif",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "Keterangan foto",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "caption", media: "image" },
            prepare({ title, media }) {
              return { title: title || "Gambar galeri", media };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Konten (Markdown)",
      description: "Format Markdown dipertahankan agar artikel lama tetap utuh.",
      type: "text",
      rows: 20,
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "metaTitle", title: "SEO - Meta title", type: "string" }),
    defineField({
      name: "metaDescription",
      title: "SEO - Meta description",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "coverImage" },
  },
});

export const sanityConfig = defineConfig({
  name: "blog-marhalah",
  title: "Blog Marhalah",
  projectId,
  dataset,
  apiVersion,
  basePath: "/admin",
  plugins: [structureTool()],
  schema: { types: [post] },
});

export default sanityConfig;
