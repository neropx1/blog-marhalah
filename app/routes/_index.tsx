import { Link } from "@remix-run/react";
import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, useMemo } from "react";
import { fetchPostsFromGithub } from "../utils/github-posts";
import Footer from "../components/Footer";
import LazyImage from "../components/LazyImage";
import { StripeGradientShader } from "../components/ui/stripe-like-gradient-shader";

export const loader: LoaderFunction = async () => {
  const posts = await fetchPostsFromGithub();
  return json(
    { posts },
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=86400",
        "Vary": "Accept-Encoding",
      },
    }
  );
};

export const meta: MetaFunction = () => [
  { title: "Impervious Generation — Official Platform" },
  { name: "description", content: "Berbagi cerita, pengetahuan, dan inspirasi dari perjalanan kami. Ruang untuk mengeksplorasi ide-ide baru dan belajar bersama komunitas." },
  { name: "keywords", content: "blog, artikel, inspirasi, pengetahuan, komunitas, Impervious Generation" },
  { name: "author", content: "Impervious Generation" },
  { property: "og:title", content: "Impervious Generation — Official Platform" },
  { property: "og:description", content: "Berbagi cerita, pengetahuan, dan inspirasi dari perjalanan kami. Ruang untuk mengeksplorasi ide-ide baru dan belajar bersama komunitas." },
  { property: "og:type", content: "website" },
  { property: "og:locale", content: "id_ID" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Impervious Generation — Official Platform" },
  { name: "twitter:description", content: "Berbagi cerita, pengetahuan, dan inspirasi dari perjalanan kami. Ruang untuk mengeksplorasi ide-ide baru dan belajar bersama komunitas." },
];

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
    <main className="min-h-screen relative">
      {/* Background gradient shader - placed at the very back */}
      <div className="fixed inset-0 -z-10">
        <StripeGradientShader />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Hero Section with Brand */}
        <section className="relative overflow-hidden py-20 md:py-28 lg:py-36">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Brand Header */}
            <div className="text-center mb-12 md:mb-16">
              <div className="inline-block mb-6">
                <div className="w-64 md:w-96 flex items-center justify-center">
                  <img src="master_text_logo_horizontal.webp" alt="Impervious Generation" />
                </div>
              </div>

              <p className="text-lg md:text-xl max-w-2xl mx-auto font-[Bricolage_Grotesque] leading-relaxed text-amber-100/90">
                Generasi tonggak 100 Tahun Kedua Gontor yang tangguh dalam mengupayakan perbaikan umat dan menegakkan kebenaran, teguh dalam mempertahankan prinsip Islam, identitas, dan nilai Gontori, kokoh dalam integritas, selaras antara seruan dan perbuatan, serta dinamis meningkatkan kualitas umat demi mewujudkan pusat peradaban dunia.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <Link
                to="/jelajahi"
                className="liquid-btn btn-lg"
              >
                Jelajahi Artikel
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#latest"
                className="liquid-btn btn-lg"
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
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Featured Post */}
              {featuredPost && (
                <div id="latest" className="group relative liquid-card card-float overflow-hidden transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-amber-900/30 to-amber-950/20 overflow-hidden relative flex items-center justify-center">
                    {featuredPost.cover_image ? (
                      <LazyImage
                        src={featuredPost.cover_image}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                        <span className="text-amber-400 font-bold text-5xl relative z-10">📰</span>
                      </>
                    )}
                    <div className="absolute top-4 left-4 z-10 flex gap-2">
                      <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
                        FEATURED
                      </span>
                      <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-amber-200/90 border border-slate-700/50 backdrop-blur-md">
                        {featuredPost.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4 text-xs text-amber-200/60 font-[Merriweather]">
                      <span>{featuredPost.date}</span>
                      <span className="text-amber-400">•</span>
                      <span className="text-amber-200/80">{featuredPost.author}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight font-[Texturina] text-amber-200 group-hover:text-amber-300 transition duration-300">
                      {featuredPost.title}
                    </h2>
                    <p className="text-lg mb-6 leading-relaxed font-[Merriweather] text-amber-100/80">
                      {featuredPost.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-amber-500/15">
                      <Link
                        to={`/post/${featuredPost.id}`}
                        className="liquid-btn btn-sm"
                      >
                        Baca Lengkap
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <h3 className="text-2xl font-bold mb-8 font-[Bricolage_Grotesque] text-amber-300 flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-amber-400 rounded-full inline-block" />
                    Artikel Lainnya
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {otherPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/post/${post.id}`}
                        className="group liquid-card transition-all duration-300 flex flex-col overflow-hidden"
                      >
                        {/* Image */}
                        <div className="aspect-video bg-amber-950/40 overflow-hidden relative flex items-center justify-center">
                          {post.cover_image ? (
                            <LazyImage
                              src={post.cover_image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            />
                          ) : (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                              <span className="text-amber-400/50 font-bold text-2xl relative z-10">📝</span>
                            </>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="inline-block bg-amber-500/15 text-amber-300 px-3 py-1 text-xs font-semibold rounded-full border border-amber-500/30 font-[Merriweather]">
                              {post.category}
                            </span>
                            <span className="text-xs text-amber-200/50 font-[Merriweather]">{post.date}</span>
                          </div>

                          <h4 className="text-lg font-bold mb-3 leading-snug line-clamp-2 transition font-[Texturina] text-amber-100 group-hover:text-amber-300">
                            {post.title}
                          </h4>

                          <p className="text-amber-100/70 text-sm mb-4 line-clamp-2 flex-grow font-[Merriweather] leading-relaxed">
                            {post.description}
                          </p>

                          <div className="font-semibold text-sm text-amber-400 group-hover:text-amber-300 flex items-center gap-2 mt-auto pt-3 border-t border-amber-500/10 font-[Merriweather]">
                            <span className="btn-ghost btn-sm px-0">Selengkapnya</span>
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="liquid-card p-6">
                <h3 className="text-lg font-bold mb-4 font-[Bricolage_Grotesque] text-amber-300">Cari Artikel</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ketik kata kunci..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full glass-input text-amber-100 placeholder-amber-200/40 px-4 py-3 rounded-lg font-[Merriweather]"
                  />
                  <svg className="absolute right-3.5 top-3.5 w-5 h-5 text-amber-400 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Categories */}
              <div className="liquid-card p-6">
                <h3 className="text-lg font-bold mb-4 font-[Bricolage_Grotesque] text-amber-300">Kategori</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition font-[Merriweather] text-sm font-medium flex items-center justify-between ${selectedCategory === null
                      ? "liquid-btn btn-block"
                      : "btn-ghost text-amber-200/80"
                      }`}
                  >
                    <span>Semua Kategori</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full ${selectedCategory === null ? "bg-amber-900/30 text-amber-200" : "bg-amber-900/60 text-amber-300"}`}>
                      {displayPosts.length}
                    </span>
                  </button>
                  {allCategories.map((cat) => {
                    const count = displayPosts.filter((p) => p.category === cat).length;
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition font-[Merriweather] text-sm font-medium flex items-center justify-between ${isSelected
                          ? "liquid-btn btn-block"
                          : "btn-ghost text-amber-200/80"
                          }`}
                      >
                        <span>{cat}</span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full ${isSelected ? "bg-amber-900/30 text-amber-200" : "bg-amber-900/60 text-amber-300"}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Info Box */}
              <div className="liquid-card p-6 border-amber-500/30">
                <h3 className="text-lg font-bold mb-3 font-[Bricolage_Grotesque] text-amber-300">Tentang Blog</h3>
                <p className="text-sm leading-relaxed font-[Bricolage_Grotesque] mb-4 text-amber-100/75">
                  Blog ini adalah ruang berbagi untuk cerita, pengetahuan, dan pengalaman. Dibuat dengan penuh dedikasi untuk komunitas.
                </p>
                <Link
                  to="/jelajahi"
                  className="liquid-btn btn-sm"
                >
                  Jelajahi semua <span>→</span>
                </Link>
              </div>

              {/* Upcoming Section */}
              <div className="liquid-card p-4">
                <h3 className="text-lg font-bold mb-4 font-[Bricolage_Grotesque] text-amber-300">Terbaru</h3>
                {displayPosts.slice(0, 3).map((post, i) => (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className={`group block py-4 ${i !== 0 ? "border-t border-amber-500/15" : ""}`}
                  >
                    <p className="text-sm font-semibold line-clamp-2 font-[Merriweather] text-amber-100/90 group-hover:text-amber-300 transition leading-snug">
                      {post.title}
                    </p>
                    <p className="text-xs text-amber-200/50 mt-2 font-[Merriweather]">{post.date}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </main>
  );
}
