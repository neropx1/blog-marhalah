import { Link } from "@remix-run/react";
import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState, useMemo } from "react";
import { getPosts } from "../utils/sanity.server";
import Footer from "../components/Footer";
import LazyImage from "../components/LazyImage";

export const loader: LoaderFunction = async () => {
  return json(
    { posts: await getPosts() },
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=86400",
        "Vary": "Accept-Encoding",
      },
    }
  );
};

export const meta: MetaFunction = () => [
  { title: "Impervious Generation — Jurnal & Warta Resmi" },
  {
    name: "description",
    content: "Pusat artikel, warta, pemikiran, dan inspirasi resmi Impervious Generation.",
  },
  { name: "keywords", content: "blog, artikel, warta, gontor, impervious generation" },
  { name: "author", content: "Impervious Generation" },
  { property: "og:title", content: "Impervious Generation — Jurnal & Warta Resmi" },
  {
    property: "og:description",
    content: "Pusat artikel, warta, pemikiran, dan inspirasi resmi Impervious Generation.",
  },
  { property: "og:type", content: "website" },
  { property: "og:locale", content: "id_ID" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Impervious Generation — Jurnal & Warta Resmi" },
  {
    name: "twitter:description",
    content: "Pusat artikel, warta, pemikiran, dan inspirasi resmi Impervious Generation.",
  },
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
  cover_image_alt?: string;
}

interface LoaderData {
  posts: Post[];
}

function getReadTime(text: string): string {
  const words = text ? text.trim().split(/\s+/).length : 100;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} mnt baca`;
}

export default function Index() {
  const { posts } = useLoaderData<LoaderData>();
  const displayPosts = posts;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allCategories = useMemo(
    () => Array.from(new Set(displayPosts.map((p) => p.category))).sort(),
    [displayPosts]
  );

  const filteredPosts = useMemo(() => {
    return displayPosts.filter((post) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        (post.tags && post.tags.some((t) => t.toLowerCase().includes(q)));
      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [displayPosts, searchQuery, selectedCategory]);

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  return (
    <main className="min-h-screen bg-[#0C0A08] text-[#FAF4E8]">
      {/* Brand Hero Header Section (Restored & Sleek Minimalist) */}
      <section className="relative overflow-hidden py-14 md:py-20 lg:py-24 border-b border-[#221C14] bg-gradient-to-b from-[#110D09] to-[#0C0A08]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Official Brand Logo */}
          <div className="inline-block mb-6">
            <div className="w-64 md:w-96 mx-auto flex items-center justify-center">
              <img
                src="/master_text_logo_horizontal.webp"
                alt="Impervious Generation"
                className="w-full h-auto object-contain"
                loading="eager"
              />
            </div>
          </div>

          {/* Official Motto / Description */}
          <p className="text-sm md:text-base max-w-2xl mx-auto font-[Bricolage_Grotesque] leading-relaxed text-[#BFB39B] mb-8">
            Generasi tonggak 100 Tahun Kedua Gontor yang tangguh dalam mengupayakan perbaikan umat dan menegakkan kebenaran, teguh dalam mempertahankan prinsip Islam, identitas, dan nilai Gontori, kokoh dalam integritas, selaras antara seruan dan perbuatan, serta dinamis meningkatkan kualitas umat demi mewujudkan pusat peradaban dunia.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/jelajahi"
              className="btn-primary btn-md font-[Bricolage_Grotesque]"
            >
              Jelajahi Artikel
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="#latest"
              className="btn-secondary btn-md font-[Bricolage_Grotesque]"
            >
              Lihat Terbaru
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div id="latest" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14 scroll-mt-20">
        {/* Category Pills Bar (Horizontal, Lean) */}
        <div className="flex items-center justify-between gap-4 border-b border-[#221C14] pb-4 mb-8 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded text-xs font-[Bricolage_Grotesque] font-semibold uppercase tracking-wider transition ${
                selectedCategory === null
                  ? "bg-[#D4AF37] text-[#0C0A08]"
                  : "bg-[#14110D] text-[#A89C86] hover:text-[#FAF4E8] border border-[#272118]"
              }`}
            >
              Semua ({displayPosts.length})
            </button>
            {allCategories.map((cat) => {
              const count = displayPosts.filter((p) => p.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded text-xs font-[Bricolage_Grotesque] font-semibold uppercase tracking-wider whitespace-nowrap transition ${
                    isSelected
                      ? "bg-[#D4AF37] text-[#0C0A08]"
                      : "bg-[#14110D] text-[#A89C86] hover:text-[#FAF4E8] border border-[#272118]"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-amber-400 hover:underline font-[Bricolage_Grotesque] whitespace-nowrap"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Featured Story (Lead Article - Editorial Style) */}
        {featuredPost && (
          <article className="border border-[#272118] bg-[#120F0C] rounded-lg overflow-hidden mb-12 hover:border-amber-500/30 transition group">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Cover Image */}
              <div className="lg:col-span-7 bg-[#16120D] relative overflow-hidden aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto min-h-[260px] lg:min-h-[400px]">
                {featuredPost.cover_image ? (
                  <LazyImage
                    src={featuredPost.cover_image}
                    alt={featuredPost.cover_image_alt || featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#15120E] text-amber-500/30">
                    <span className="text-6xl font-[Texturina]">IG</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-[#D4AF37] text-[#0C0A08] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider font-[Bricolage_Grotesque]">
                    Berita Utama
                  </span>
                  <span className="bg-black/80 text-amber-200 text-[10px] font-medium px-2 py-0.5 rounded border border-white/10 uppercase tracking-wider font-[Bricolage_Grotesque]">
                    {featuredPost.category}
                  </span>
                </div>
              </div>

              {/* Story Content */}
              <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#8F816B] font-[Bricolage_Grotesque] mb-3">
                    <span>{featuredPost.date}</span>
                    <span>•</span>
                    <span>{getReadTime(featuredPost.body || featuredPost.description)}</span>
                  </div>

                  <Link to={`/post/${featuredPost.id}`}>
                    <h2 className="text-2xl md:text-3xl font-bold font-[Texturina] text-[#FAF4E8] group-hover:text-amber-300 transition leading-tight mb-4">
                      {featuredPost.title}
                    </h2>
                  </Link>

                  <p className="text-sm md:text-base font-[Merriweather] text-[#BFB39B] leading-relaxed line-clamp-4 mb-6">
                    {featuredPost.description || featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#221C14] flex items-center justify-between">
                  <div className="text-xs text-[#8F816B] font-[Bricolage_Grotesque]">
                    Penulis: <span className="text-[#FAF4E8] font-medium">{featuredPost.author}</span>
                  </div>
                  <Link
                    to={`/post/${featuredPost.id}`}
                    className="text-xs font-semibold text-amber-400 group-hover:text-amber-300 flex items-center gap-1 font-[Bricolage_Grotesque]"
                  >
                    Baca Lengkap <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </article>
        )}

        {/* 2-Column Editorial Grid: Feed (2/3) + Lean Sidebar (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Main Feed Column */}
          <section className="lg:col-span-8">
            <div className="flex items-center justify-between border-b border-[#221C14] pb-3 mb-6">
              <h3 className="text-sm uppercase tracking-widest font-bold text-amber-400 font-[Bricolage_Grotesque]">
                Artikel Lainnya
              </h3>
              <span className="text-xs text-[#8F816B] font-[Bricolage_Grotesque]">
                {filteredPosts.length} Tulisan
              </span>
            </div>

            {otherPosts.length === 0 && (
              <div className="p-8 text-center border border-[#272118] bg-[#120F0C] rounded-lg">
                <p className="text-sm text-[#A89C86] font-[Bricolage_Grotesque]">
                  Tidak ada artikel lain yang sesuai dengan filter pencarian.
                </p>
              </div>
            )}

            {/* List of Lean Articles */}
            <div className="space-y-6">
              {otherPosts.map((post) => (
                <article
                  key={post.id}
                  className="border border-[#272118] bg-[#120F0C] rounded-lg p-5 md:p-6 hover:border-amber-500/35 transition group"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                    {/* Thumbnail if exists */}
                    <div className="sm:col-span-4 aspect-[16/10] bg-[#18140F] rounded overflow-hidden relative">
                      {post.cover_image ? (
                        <LazyImage
                          src={post.cover_image}
                          alt={post.cover_image_alt || post.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-amber-500/20 text-xl font-[Texturina]">
                          Artikel
                        </div>
                      )}
                      <span className="absolute top-2 left-2 editorial-tag text-[9px] py-0.5 px-1.5">
                        {post.category}
                      </span>
                    </div>

                    {/* Article Details */}
                    <div className="sm:col-span-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-[#8F816B] font-[Bricolage_Grotesque] mb-2">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{getReadTime(post.body || post.description)}</span>
                        </div>

                        <Link to={`/post/${post.id}`}>
                          <h4 className="text-lg md:text-xl font-bold font-[Texturina] text-[#FAF4E8] group-hover:text-amber-300 transition leading-snug mb-2">
                            {post.title}
                          </h4>
                        </Link>

                        <p className="text-xs md:text-sm text-[#A89C86] font-[Merriweather] leading-relaxed line-clamp-2 mb-4">
                          {post.description || post.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#1F1912] text-xs font-[Bricolage_Grotesque]">
                        <span className="text-[#8F816B]">Oleh {post.author}</span>
                        <Link
                          to={`/post/${post.id}`}
                          className="text-amber-400 group-hover:text-amber-300 font-medium flex items-center gap-1"
                        >
                          Baca artikel <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Lean Editorial Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Search Box */}
            <div className="border border-[#272118] bg-[#120F0C] rounded-lg p-5">
              <label
                htmlFor="search-input"
                className="block text-xs uppercase font-bold tracking-wider text-amber-400 font-[Bricolage_Grotesque] mb-3"
              >
                Cari Artikel
              </label>
              <div className="relative">
                <input
                  id="search-input"
                  type="text"
                  placeholder="Ketik topik atau judul..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full editorial-input px-3.5 py-2 text-xs font-[Bricolage_Grotesque] text-[#FAF4E8] placeholder-[#736652]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2.5 text-xs text-[#736652] hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Popular / Ranked Articles (Numbered 01, 02, 03 style like The Verge / Medium) */}
            <div className="border border-[#272118] bg-[#120F0C] rounded-lg p-5">
              <h4 className="text-xs uppercase font-bold tracking-wider text-amber-400 font-[Bricolage_Grotesque] mb-4 pb-2 border-b border-[#221C14]">
                Terbaru & Pilihan
              </h4>
              <div className="space-y-4">
                {displayPosts.slice(0, 4).map((post, idx) => (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="group flex items-start gap-3.5 pb-3 border-b border-[#1C1711] last:border-b-0 last:pb-0"
                  >
                    <span className="text-lg font-bold font-mono text-[#544837] group-hover:text-amber-400 transition">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <span className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold font-[Bricolage_Grotesque]">
                        {post.category}
                      </span>
                      <h5 className="text-xs md:text-sm font-semibold font-[Texturina] text-[#FAF4E8] group-hover:text-amber-300 transition leading-snug mt-0.5 line-clamp-2">
                        {post.title}
                      </h5>
                      <span className="text-[10px] text-[#7A6D5A] font-[Bricolage_Grotesque] mt-1 block">
                        {post.date}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* About the Publication Snippet */}
            <div className="border border-[#272118] bg-[#120F0C] rounded-lg p-5">
              <h4 className="text-xs uppercase font-bold tracking-wider text-amber-400 font-[Bricolage_Grotesque] mb-3">
                Tentang Blog
              </h4>
              <p className="text-xs text-[#A89C86] font-[Merriweather] leading-relaxed mb-4">
                Blog ini adalah ruang berbagi untuk cerita, pengetahuan, dan pengalaman. Dibuat dengan penuh dedikasi untuk komunitas.
              </p>
              <Link
                to="/jelajahi"
                className="btn-secondary btn-sm w-full text-xs font-[Bricolage_Grotesque]"
              >
                Jelajahi semua →
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}
