import { json, type LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link, useSearchParams } from "@remix-run/react";
import { fetchPostsFromGithub } from "~/utils/github-posts";
import { useState, useMemo } from "react";
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

const CATEGORIES = ["Berita", "Artikel", "Santri", "Maklumat", "Pengumuman"];

export default function Browse() {
  const { posts } = useLoaderData<LoaderData>();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("q") || "";
  const selectedCategory = searchParams.get("category") || "";

  // Filter posts berdasarkan search dan kategori
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "" ||
        post.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  // Get unique categories dari posts
  const availableCategories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category));
    return Array.from(cats).sort();
  }, [posts]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (newQuery) {
      params.set("q", newQuery);
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
  };

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-b from-amber-900/5 to-amber-950/10 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-zhoro">
              Jelajahi Artikel
            </h1>
            <p className="text-lg text-slate-300 font-[Merriweather]">
              Temukan cerita dan informasi menarik dari kami
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari artikel, berita, atau tag..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full bg-amber-900/25 border border-amber-500/30 text-white placeholder-white-900 px-6 py-4 rounded-lg focus:outline-none focus:border-amber-400 transition font-[Merriweather]"
              />
              <svg className="absolute right-4 top-4 w-6 h-6 text-amber-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Filter Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white font-zhoro">Kategori</h2>
            {(searchQuery || selectedCategory) && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-amber-400 hover:text-amber-300 font-medium transition"
              >
                Reset Filter
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {/* All button */}
            <button
              onClick={() => handleCategory("")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${selectedCategory === ""
                ? "bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(212,175,55,0.3)] font-bold"
                : "bg-amber-950/40 text-amber-200/80 border border-amber-500/20 hover:bg-amber-900/40 hover:text-amber-200"
                }`}
            >
              Semua Kategori
            </button>

            {/* Category buttons */}
            {availableCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${selectedCategory === category
                  ? "bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(212,175,55,0.3)] font-bold"
                  : "bg-amber-950/40 text-amber-200/80 border border-amber-500/20 hover:bg-amber-900/40 hover:text-amber-200"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-8">
          <p className="text-amber-200/60 text-sm font-[Merriweather]">
            Menampilkan <span className="text-amber-300 font-semibold">{filteredPosts.length}</span> dari{" "}
            <span className="text-amber-300 font-semibold">{posts.length}</span> artikel
            {searchQuery && ` untuk "${searchQuery}"`}
            {selectedCategory && ` di kategori "${selectedCategory}"`}
          </p>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="group bg-amber-950/20 border border-amber-500/20 rounded-xl overflow-hidden hover:border-amber-400/50 hover:bg-amber-900/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(212,175,55,0.12)] flex flex-col"
              >
                {/* Image Placeholder */}
                <div className="aspect-video bg-amber-950/40 flex items-center justify-center overflow-hidden relative">
                  {post.cover_image ? (
                    <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                      <span className="text-amber-400 font-bold text-lg relative z-10">Artikel</span>
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-amber-500/15 text-amber-300 px-3 py-0.5 text-xs font-semibold rounded-full border border-amber-500/30">
                      {post.category}
                    </span>
                    <span className="text-xs text-amber-200/50">{post.date}</span>
                  </div>

                  <h3 className="text-xl font-bold text-amber-100 mb-3 group-hover:text-amber-300 transition line-clamp-2 font-zhoro leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-amber-100/70 text-sm mb-4 line-clamp-2 font-[Merriweather] flex-grow">
                    {post.description}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-amber-900/40 text-amber-300/80 px-2.5 py-0.5 rounded-full border border-amber-500/20"
                        >
                          #{tag}
                        </span>
                      ))}
                      {post.tags.length > 2 && (
                        <span className="text-xs text-amber-200/40">+{post.tags.length - 2}</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center text-amber-400 font-semibold text-sm group-hover:text-amber-300 flex items-center gap-1 mt-auto pt-2 border-t border-amber-500/10">
                    Baca Artikel <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg
              className="w-16 h-16 text-slate-700 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-bold text-white mb-2 font-zhoro">
              Tidak ada artikel yang cocok
            </h3>
            <p className="text-slate-400 font-[Merriweather] mb-6">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Reset Filter
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
