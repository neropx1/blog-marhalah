import { Link } from "@remix-run/react";
import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, useMemo } from "react";
import { fetchPostsFromGithub } from "~/utils/github-posts";
import Footer from "~/components/Footer";

export const loader: LoaderFunction = async () => {
  const posts = await fetchPostsFromGithub();
  return json({ posts });
};

interface Post {
  id: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  body: string;
  tags: string[];
  cover_image?: string;
}

interface LoaderData {
  posts: Post[];
}

const fallbackPosts = [
  {
    id: "default-1",
    title: "Membangun Blog Modern dengan Remix",
    description: "Panduan singkat untuk memulai blog profesional dengan CMS yang mudah dikelola.",
    excerpt: "Panduan singkat untuk memulai blog profesional dengan CMS yang mudah dikelola.",
    date: "30 Juli 2026",
    category: "Artikel",
    author: "Admin",
    body: "",
    tags: ["Remix"],
    cover_image: undefined,
  },
  {
    id: "default-2",
    title: "Decap CMS untuk Konten yang Fleksibel",
    description: "Kelola artikel tanpa harus menyentuh kode setiap kali ada update konten.",
    excerpt: "Kelola artikel tanpa harus menyentuh kode setiap kali ada update konten.",
    date: "28 Juli 2026",
    category: "Berita",
    author: "Developer",
    body: "",
    tags: ["CMS"],
    cover_image: undefined,
  },
];

export default function Index() {
  const { posts } = useLoaderData<LoaderData>();
  const displayPosts = posts && posts.length > 0 ? posts : fallbackPosts;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allCategories = useMemo(
    () => Array.from(new Set(displayPosts.map((p) => p.category))).sort(),
    [displayPosts]
  );

  const filteredPosts = useMemo(() => {
    return displayPosts.filter((post) => {
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [displayPosts, searchQuery, selectedCategory]);

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  return (
    <main className="min-h-screen">
      {/* Hero Section with Brand */}
      <section className="relative overflow-hidden py-16 md:py-24 lg:py-32">
        {/* Background gradients */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20" />
        </div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          {/* Brand Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4">
              <div className="w-64 h-64 flex items-center justify-center">
                <img src="lambang.webp" alt="" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl mb-4 text-title-1">
              Impervious Generation
            </h1>
            <p className="text-xl md:text-2xl mb-6 font-[Merriweather]" style={{ color: "var(--gold)" }}>
              Generasi Tonggak Kedua Gontor
            </p>
            <p className="text-lg max-w-2xl mx-auto font-[Merriweather] leading-relaxed" style={{ color: "var(--text-dark)" }}>
              Berbagi cerita, pengetahuan, dan inspirasi dari perjalanan kami. Ruang untuk mengeksplorasi ide-ide baru dan belajar bersama komunitas.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link
              to="/jelajahi"
              className="inline-flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-lg transition transform hover:scale-105"
              style={{ backgroundColor: "var(--gold)" }}
            >
              Jelajahi Artikel
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="#latest"
              className="inline-flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-lg transition"
              style={{ borderColor: "var(--gold)", borderWidth: "2px", color: "var(--gold)" }}
            >
              Lihat Terbaru
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content - Blog Layout */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Post */}
            {featuredPost && (
              <div id="latest" className="group bg-amber-900/25 border-2 rounded-xl overflow-hidden transition transform hover:shadow-2xl" style={{ borderColor: "var(--border-dark)" }}>
                <div className="aspect-video bg-gradient-to-br from-amber-500/20 to-amber-600/10 overflow-hidden relative flex items-center justify-center">
                  {featuredPost.cover_image ? (
                    <img
                      src={featuredPost.cover_image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                      <span className="text-amber-400 font-bold text-4xl relative z-10">📰</span>
                    </>
                  )}
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-block bg-amber-600/30 text-amber-400 px-4 py-1 text-sm font-semibold rounded-full border" style={{ borderColor: "var(--border-dark)", color: "var(--gold)" }}>
                      FEATURED
                    </span>
                    <span className="text-sm text-slate-500">{featuredPost.date}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight font-[Texturina] group-hover:transition" style={{ color: "var(--gold-bright)" }}>
                    {featuredPost.title}
                  </h2>
                  <p className="text-lg mb-6 leading-relaxed font-[Merriweather]" style={{ color: "var(--text-dark)" }}>
                    {featuredPost.description}
                  </p>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-400">oleh</span>
                      <span className="text-sm font-semibold" style={{ color: "var(--gold)" }}>{featuredPost.author}</span>
                    </div>
                    <Link
                      to={`/post/${featuredPost.id}`}
                      className="inline-flex items-center gap-2 font-semibold transition"
                      style={{ color: "var(--gold)" }}
                    >
                      Baca Lengkap
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Articles Grid */}
            {otherPosts.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold mb-6 font-zhoro" style={{ color: "var(--gold-bright)" }}>
                  Artikel Lainnya
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {otherPosts.map((post, idx) => (
                    <Link
                      key={post.id}
                      to={`/post/${post.id}`}
                      className="group rounded-lg bg-amber-900/25 hover-lift"
                      style={{ borderColor: "var(--border-dark)", borderWidth: "1px" }}
                    >
                      {/* Image */}
                      <div className="aspect-video bg-amber-900/25 overflow-hidden relative flex items-center justify-center group-hover:to-amber-600/15 transition">
                        {post.cover_image ? (
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          />
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                            <span className="text-amber-400/50 font-bold text-2xl relative z-10">📝</span>
                          </>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="inline-block bg-amber-500/20 px-3 py-1 text-xs font-semibold rounded border" style={{ borderColor: "var(--border-dark)", color: "var(--gold)" }}>
                            {post.category}
                          </span>
                          <span className="text-xs text-slate-500">{post.date}</span>
                        </div>

                        <h4 className="text-lg font-bold mb-2 leading-snug line-clamp-2 transition font-[Texturina]" style={{ color: "var(--gold-bright)" }}>
                          {post.title}
                        </h4>

                        <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-grow font-[Merriweather]" style={{ color: "var(--text-dark)" }}>
                          {post.description}
                        </p>

                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="font-semibold text-sm group-hover:gap-2 gap-1 transition-all mt-auto flex items-center" style={{ color: "var(--gold)" }}>
                          Selengkapnya
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Box */}
            <div className="bg-amber-900/25 rounded-lg p-6" style={{ borderColor: "var(--border-dark)", borderWidth: "1px" }}>
              <h3 className="text-lg font-bold mb-4 font-zhoro" style={{ color: "var(--gold-bright)" }}>Cari Artikel</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ketik kata kunci..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-amber-900/25 border text-white placeholder-slate-500 px-4 py-3 rounded-lg focus:outline-none transition font-[Merriweather]"
                  style={{ borderColor: "var(--border-dark)", color: "var(--text-dark)" }}
                />
                <svg className="absolute right-3 top-3 w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "var(--gold)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-amber-900/25 rounded-lg p-6" style={{ borderColor: "var(--border-dark)", borderWidth: "1px" }}>
              <h3 className="text-lg font-bold mb-4 font-zhoro" style={{ color: "var(--gold-bright)" }}>Kategori</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-4 py-2 rounded transition font-[Merriweather] ${selectedCategory === null
                    ? "bg-amber-600 text-white"
                    : "text-slate-300 hover:bg-slate-700"
                    }`}
                >
                  Semua
                </button>
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-2 rounded transition font-[Merriweather] flex items-center justify-between ${selectedCategory === cat
                      ? "bg-amber-600 text-white"
                      : "text-slate-300 hover:bg-slate-700"
                      }`}
                  >
                    <span>{cat}</span>
                    <span className="text-xs bg-slate-700 px-2 py-1 rounded">
                      {displayPosts.filter((p) => p.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 rounded-lg p-6" style={{ borderColor: "var(--border-dark)", borderWidth: "1px" }}>
              <h3 className="text-lg font-bold mb-3 font-zhoro" style={{ color: "var(--gold)" }}>Tentang Blog</h3>
              <p className="text-sm leading-relaxed font-[Merriweather] mb-4" style={{ color: "var(--text-dark)" }}>
                Blog ini adalah ruang berbagi untuk cerita, pengetahuan, dan pengalaman. Dibuat dengan penuh dedikasi untuk komunitas.
              </p>
              <Link
                to="/jelajahi"
                className="inline-block font-semibold text-sm transition"
                style={{ color: "var(--gold)" }}
              >
                Jelajahi semua →
              </Link>
            </div>

            {/* Upcoming Section */}
            <div className="bg-amber-900/20 rounded-lg p-6" style={{ borderColor: "var(--border-dark)", borderWidth: "1px" }}>
              <h3 className="text-lg font-bold mb-4 font-zhoro" style={{ color: "var(--gold-bright)" }}>Terbaru</h3>
              {displayPosts.slice(0, 3).map((post) => (
                <Link
                  key={post.id}
                  to={`/post/${post.id}`}
                  className="group block mb-4 pb-4 last:border-b-0 last:mb-0 last:pb-0 hover:transition"
                  style={{ borderBottomColor: "var(--border-dark)", borderBottomWidth: post !== displayPosts.slice(0, 3).at(-1) ? "1px" : "0" }}
                >
                  <p className="text-sm font-semibold line-clamp-2 font-[Merriweather]" style={{ color: "var(--text-dark)" }}>
                    {post.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{post.date}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-amber-600/10 to-amber-700/10 py-16 mt-16" style={{ borderTopColor: "var(--border-dark)", borderTopWidth: "1px" }}>
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-zhoro" style={{ color: "var(--gold-bright)" }}>
            Bergabunglah dengan Komunitas Kami
          </h2>
          <p className="text-lg mb-8 font-[Merriweather]" style={{ color: "var(--text-dark)" }}>
            Dapatkan update artikel terbaru dan inspirasi langsung di inbox Anda
          </p>
          <Link
            to="/jelajahi"
            className="inline-flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-lg transition transform hover:scale-105"
            style={{ backgroundColor: "var(--gold)" }}
          >
            Mulai Baca Sekarang
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
