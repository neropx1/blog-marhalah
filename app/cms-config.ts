export const cmsConfig = {
  load_config_file: false,
  backend: {
    name: "github" as const,
    repo: "neropx1/test-cms-decap",
    branch: "main",
    base_url: "https://impervious-blog.netlify.app"
  },

  media_folder: "cloudinary",

  public_folder: "/uploads",

  media_library: {
    name: "cloudinary" as const,
    config: {
      cloud_name: "ymxgxfvy",
      api_key: "461626797611519",
    },
  },

  collections: [
    {
      name: "posts",
      label: "Berita & Artikel",
      folder: "content/posts",
      create: true,
      slug: "{{year}}-{{month}}-{{day}}-{{slug}}",
      preview_path: "/post/{{slug}}",
      fields: [
        {
          label: "Judul",
          name: "title",
          widget: "string" as const,
          required: true,
        },
        {
          label: "Slug",
          name: "slug",
          widget: "string" as const,
          required: false,
        },
        {
          label: "Gambar Sampul",
          name: "cover_image",
          widget: "image" as const,
          required: true,
          media_library: {
            config: {
              multiple: false,
            },
          },
        },
        {
          label: "Deskripsi Singkat",
          name: "description",
          widget: "text" as const,
          required: true,
        },
        {
          label: "Kategori",
          name: "category",
          widget: "select" as const,
          options: ["Berita", "Artikel", "Santri", "Maklumat", "Pengumuman"],
          required: true,
        },
        {
          label: "Penulis",
          name: "author",
          widget: "string" as const,
          required: true,
        },
        {
          label: "Email Penulis",
          name: "author_email",
          widget: "string" as const,
          required: false,
        },
        {
          label: "Tanggal Publikasi",
          name: "date",
          widget: "datetime" as const,
          format: "YYYY-MM-DD HH:mm:ss",
          required: true,
        },
        {
          label: "Tag",
          name: "tags",
          widget: "list" as const,
          field: {
            label: "Tag",
            name: "tag",
            widget: "string" as const,
          },
          required: false,
        },
        {
          label: "Konten",
          name: "body",
          widget: "markdown" as const,
          required: true,
        },
        {
          label: "SEO - Meta Title",
          name: "meta_title",
          widget: "string" as const,
          required: false,
        },
        {
          label: "SEO - Meta Description",
          name: "meta_description",
          widget: "text" as const,
          required: false,
        },
      ],
    },
  ],
};
