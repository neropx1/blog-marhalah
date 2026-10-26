import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useLoaderData, Link, useSearchParams, Form } from "@remix-run/react";
import { getPosts } from "../utils/sanity.server";
import { useState, useMemo, FormEvent } from "react";
import Footer from "../components/Footer";
import LazyImage from "../components/LazyImage";

export const loader: LoaderFunction = async () => {
  return json(
    { posts: await getPosts() },
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=600",
        "Vary": "Accept-Encoding",
      },
    }
  );
};

export const meta: MetaFunction = () => [
  { title: "Jelajahi Artikel — Impervious Generation" },
  { name: "description", content: "Katalog arsip artikel, warta, berita, dan maklumat resmi Impervious Generation." },
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
  return `${minutes} mnt`;
}

export default function Browse() {
  const { posts } = useLoaderData<LoaderData>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchParams.get("q") || "");

  const searchQuery = searchParams.get("q") || "";
  const selectedCategory = searchParams.get("category") || "";

  // Filter posts berdasarkan search dan kategori
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        (post.tags && post.tags.some((tag) => tag.toLowerCase().includes(q)));

      const matchesCategory =
        selectedCategory === "" ||
        post.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  // Unique categories
  const availableCategories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category));
    return Array.from(cats).sort();
  }, [posts]);

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (localSearchQuery.trim()) {
      params.set("q", localSearchQuery.trim());
    } else {
      params.delete("q");
    }
    setSearchParams(params);
  };

  const handleCategory = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchParams("");
    setLocalSearchQuery("");
  };

  return (
    <main className="min-h-screen bg-[#0C0A08] text-[#FAF4E8] pb-16 md:pb-0">
      {/* Editorial Header */}
      <section className="border-b border-[#221C14] bg-[#0E0C09] py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-400 font-[Bricolage_Grotesque]">
              Arsip & Warta
            </span>
            <h1 className="text-3xl md:text-4xl font-bold font-[Texturina] text-[#FAF4E8] mt-1 mb-3">
              Jelajahi Artikel
            </h1>
            <p className="text-sm font-[Merriweather] text-[#BFB39B] leading-relaxed">
              Koleksi tulisan, gagasan pemikiran, kabar terkini, dan panduan perjalanan generasi.
            </p>
          </div>

          {/* Sleek Search Bar */}
          <div className="mt-6 max-w-xl">
            <Form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Cari judul, topik, atau kata kunci..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="w-full editorial-input px-4 py-2.5 text-xs md:text-sm font-[Bricolage_Grotesque] text-[#FAF4E8] placeholder-[#736652] pr-10"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8F816B] hover:text-amber-400 transition"
                aria-label="Cari"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </Form>
          </div>
        </div>
      </section>

      {/* Categories & Filter Bar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#221C14] pb-4 mb-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            <button
              onClick={() => handleCategory("")}
              className={`px-3 py-1 rounded text-xs font-[Bricolage_Grotesque] font-semibold uppercase tracking-wider transition ${
                selectedCategory === ""
                  ? "bg-[#D4AF37] text-[#0C0A08]"
                  : "bg-[#14110D] text-[#A89C86] hover:text-[#FAF4E8] border border-[#272118]"
              }`}
            >
              Semua ({posts.length})
            </button>
            {availableCategories.map((category) => {
              const count = posts.filter((p) => p.category === category).length;
              const isSelected = selectedCategory.toLowerCase() === category.toLowerCase();
              return (
                <button
                  key={category}
                  onClick={() => handleCategory(category)}
                  className={`px-3 py-1 rounded text-xs font-[Bricolage_Grotesque] font-semibold uppercase tracking-wider whitespace-nowrap transition ${
                    isSelected
                      ? "bg-[#D4AF37] text-[#0C0A08]"
                      : "bg-[#14110D] text-[#A89C86] hover:text-[#FAF4E8] border border-[#272118]"
                  }`}
                >
                  {category} ({count})
                </button>
              );
            })}
          </div>

          {(searchQuery || selectedCategory) && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-amber-400 hover:underline font-[Bricolage_Grotesque]"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* Results Counter */}
        <div className="text-xs text-[#8F816B] font-[Bricolage_Grotesque] mb-6">
          Menampilkan <span className="text-[#FAF4E8] font-semibold">{filteredPosts.length}</span> artikel
          {selectedCategory && (
            <>
              {" "}pada kategori <span className="text-amber-400">"{selectedCategory}"</span>
            </>
          )}
          {searchQuery && (
            <>
              {" "}dengan kata kunci <span className="text-amber-400">"{searchQuery}"</span>
            </>
          )}
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="border border-[#272118] bg-[#120F0C] rounded-lg overflow-hidden flex flex-col justify-between hover:border-amber-500/35 transition group"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="aspect-[16/10] bg-[#16120D] relative overflow-hidden flex items-center justify-center">
                    {post.cover_image ? (
                      <LazyImage
                        src={post.cover_image}
                        alt={post.cover_image_alt || post.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                      />
                    ) : (
                      <div className="text-amber-500/20 text-xl font-[Texturina]">Artikel</div>
                    )}
                    <span className="absolute top-2.5 left-2.5 editorial-tag text-[9px] py-0.5 px-2">
                      {post.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] text-[#8F816B] font-[Bricolage_Grotesque] mb-2">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{getReadTime(post.body || post.description)}</span>
                    </div>

                    <Link to={`/post/${post.id}`}>
                      <h3 className="text-base md:text-lg font-bold font-[Texturina] text-[#FAF4E8] group-hover:text-amber-300 transition leading-snug line-clamp-2 mb-2">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="text-xs text-[#A89C86] font-[Merriweather] leading-relaxed line-clamp-2 mb-4">
                      {post.description || post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer metadata */}
                <div className="px-5 pb-4 pt-3 border-t border-[#1C1711] flex items-center justify-between text-xs font-[Bricolage_Grotesque]">
                  <span className="text-[#8F816B] truncate max-w-[140px]">Oleh {post.author}</span>
                  <Link
                    to={`/post/${post.id}`}
                    className="text-amber-400 group-hover:text-amber-300 font-medium flex items-center gap-1 flex-shrink-0"
                  >
                    Baca <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-[#272118] bg-[#120F0C] rounded-lg p-8">
            <h3 className="text-base font-bold text-[#FAF4E8] mb-2 font-[Bricolage_Grotesque]">
              Tidak ada artikel yang cocok
            </h3>
            <p className="text-xs text-[#8F816B] font-[Merriweather] mb-4">
              Coba gunakan kata kunci lain atau pilih kategori berbeda.
            </p>
            <button
              onClick={handleClearFilters}
              className="btn-secondary btn-sm text-xs font-[Bricolage_Grotesque]"
            >
              Reset Filter
            </button>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
