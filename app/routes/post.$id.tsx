import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { fetchPostsFromGithub, type CoverImageItem } from "../utils/github-posts";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import Footer from "../components/Footer";
import LazyImage from "../components/LazyImage";
import CoverImageSlider from "../components/CoverImageSlider";
import { useState, useMemo, useRef } from "react";

// Helper membagi artikel panjang ke dalam beberapa halaman
function paginateMarkdown(content: string, paragraphsPerPage = 6): string[] {
  if (!content) return [""];

  if (/<!--\s*pagebreak\s*-->/i.test(content)) {
    const manualPages = content.split(/<!--\s*pagebreak\s*-->/i).filter((p) => p.trim().length > 0);
    if (manualPages.length > 0) return manualPages;
  }

  const blocks = content.split(/\r?\n\s*\r?\n/);
  
  if (blocks.length <= paragraphsPerPage) {
    return [content];
  }

  const pages: string[] = [];
  for (let i = 0; i < blocks.length; i += paragraphsPerPage) {
    pages.push(blocks.slice(i, i + paragraphsPerPage).join("\n\n"));
  }
  return pages;
}

interface Post {
  id: string;
  title: string;
  description: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  photographer?: string;
  editor?: string;
  body: string;
  tags: string[];
  cover_image?: string;
  cover_images?: (string | CoverImageItem)[];
}

interface LoaderData {
  post: Post;
  relatedPosts: Post[];
}

export const loader: LoaderFunction = async ({ params }) => {
  const posts = await fetchPostsFromGithub();
  const post = posts.find((p: any) => p.id === params.id);

  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }

  const otherPosts = posts.filter((p: any) => p.id !== params.id);
  const sameCategory = otherPosts.filter((p: any) => p.category === post.category);
  const diffCategory = otherPosts.filter((p: any) => p.category !== post.category);

  const relatedPosts = [...sameCategory, ...diffCategory].slice(0, 4);

  return json({ post, relatedPosts });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [{ title: "Post — Impervious Generation" }];
  }
  
  const { post } = data;
  return [
    { title: `${post.title} — Impervious Generation` },
    { name: "description", content: post.description || post.excerpt },
    { name: "keywords", content: post.tags?.join(", ") || post.category },
    { name: "author", content: post.author },
    { property: "og:title", content: post.title },
    { property: "og:description", content: post.description || post.excerpt },
    { property: "og:type", content: "article" },
    { property: "og:image", content: post.cover_image || "" },
    { property: "article:author", content: post.author },
    { property: "article:published_time", content: post.date },
    { property: "article:section", content: post.category },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: post.title },
    { name: "twitter:description", content: post.description || post.excerpt },
    { name: "twitter:image", content: post.cover_image || "" },
  ];
};

// Custom components for markdown rendering (termasuk deskripsi foto / figcaption)
const MarkdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-4xl md:text-4xl font-bold text-white mb-6 font-[Texturina]">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl md:text-3xl font-bold text-white mt-8 mb-4 leading-tight font-[Texturina]">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl md:text-2xl font-bold text-white mt-6 mb-3 leading-tight font-[Texturina]">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-4 font-[Merriweather]">
      {children}
    </p>
  ),
  a: (props) => (
    <a href={props.href || "#"} className="text-amber-400 hover:text-amber-300 underline hover:no-underline transition">
      {props.children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-amber-400">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-amber-100">{children}</em>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-2 mb-4 font-[Bricolage_Grotesque]">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-2 mb-4 font-[Bricolage_Grotesque]">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-slate-300">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-amber-500 pl-6 italic text-slate-300 my-4 font-[Bricolage_Grotesque]">
      {children}
    </blockquote>
  ),
  code: (props) => (
    <code className="bg-slate-800 px-2 py-1 rounded text-sky-300 font-mono text-sm">
      {props.children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="bg-slate-800 p-4 rounded-lg overflow-x-auto mb-4">
      <code className="text-sky-100 font-mono text-sm">{children}</code>
    </pre>
  ),
  img: (props) => (
    <figure className="my-8">
      <LazyImage 
        src={props.src || ""} 
        alt={props.alt || ""} 
        className="w-full rounded-xl shadow-xl border border-slate-800" 
      />
      {props.alt && props.alt.trim() !== "" && (
        <figcaption className="text-center text-xs md:text-sm text-slate-400 mt-3 font-[Bricolage_Grotesque] italic flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{props.alt}</span>
        </figcaption>
      )}
    </figure>
  ),
};

export default function PostDetail() {
  const { post, relatedPosts } = useLoaderData<LoaderData>();

  const contentPages = useMemo(() => paginateMarkdown(post.body, 6), [post.body]);
  const [currentPage, setCurrentPage] = useState(1);
  const articleTopRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > contentPages.length) return;
    setCurrentPage(page);
    if (articleTopRef.current) {
      articleTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const coverImages =
    post.cover_images && post.cover_images.length > 0
      ? post.cover_images
      : post.cover_image
      ? [post.cover_image]
      : [];

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = encodeURIComponent(post.title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    whatsapp: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
  };

  return (
    <main className="min-h-screen gradient-wave">
      <article className="mx-auto max-w-4xl px-6 py-8 lg:px-8 relative z-10">
        <CoverImageSlider images={coverImages} title={post.title} />

        {/* Header */}
        <header ref={articleTopRef} className="liquid-card p-8 mb-10 scroll-mt-10">
          <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            <span className="inline-block bg-amber-500/20 text-amber-400 px-4 py-2 text-sm font-semibold rounded-full border border-amber-500/30">
              {post.category}
            </span>
            <time className="text-sm text-amber-200/60 font-[Bricolage_Grotesque]">{post.date}</time>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-200 mb-6 leading-tight font-[Bricolage_Grotesque]">{post.title}</h1>
          <p className="text-base md:text-lg text-amber-100/80 mb-6 font-[Bricolage_Grotesque]">{post.description}</p>
          <div className="flex items-center gap-6 border-t border-amber-500/20 pt-6 flex-wrap">
            <div>
              <p className="text-xs text-amber-200/50 mb-1 uppercase tracking-widest">Ditulis oleh</p>
              <p className="text-lg font-semibold text-amber-300 font-[Bricolage_Grotesque]">{post.author}</p>
              {post.photographer && (
                <div className="mt-2">
                  <p className="text-sm text-amber-200/50 mb-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" /></svg>
                    Fotografer
                  </p>
                  <p className="font-semibold text-amber-300 font-[Bricolage_Grotesque]">{post.photographer}</p>
                </div>
              )}
              {post.editor && (
                <div className="mt-2">
                  <p className="text-sm text-amber-200/50 mb-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" /></svg>
                    Editor
                  </p>
                  <p className="font-semibold text-amber-300 font-[Bricolage_Grotesque]">{post.editor}</p>
                </div>
              )}
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-amber-500/15 text-amber-300 px-3 py-1 text-sm rounded-full border border-amber-500/30 font-[Bricolage_Grotesque]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="border border-amber-500/30 border-dashed p-4 rounded-2xl mb-10">
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown components={MarkdownComponents} rehypePlugins={[rehypeRaw]}>
              {contentPages[currentPage - 1] || ""}
            </ReactMarkdown>
          </div>
        </div>

        {/* Article Content Pagination (tampil jika artikel memiliki > 1 halaman) */}
        {contentPages.length > 1 && (
          <div className="liquid-card p-6 my-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-[Bricolage_Grotesque] text-amber-200/80">
              Halaman <span className="font-bold text-amber-400">{currentPage}</span> dari{" "}
              <span className="font-bold text-amber-400">{contentPages.length}</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="liquid-btn btn-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ←
              </button>

              <div className="flex items-center gap-1.5">
                {contentPages.map((_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 rounded-lg text-sm font-bold transition flex items-center justify-center ${
                        isActive
                          ? "liquid-btn"
                          : "glass-input text-amber-300 hover:bg-amber-900/50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === contentPages.length}
                className="liquid-btn btn-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
               →
              </button>
            </div>
          </div>
        )}

        {/* Author & Share */}
        <div className="grid gap-8 sm:grid-cols-2 mb-16">
          <div className="liquid-card p-8">
            <h4 className="font-semibold text-amber-400 font-[Bricolage_Grotesque]">Penulis</h4>
            <p className="text-amber-100/80 font-[Bricolage_Grotesque] mb-4">{post.author}</p>
            <h4 className="font-semibold text-amber-400 font-[Bricolage_Grotesque]">Editor</h4>
            <p className="text-amber-100/80 font-[Bricolage_Grotesque] mb-4">{post.photographer}</p>
            <p className="text-amber-100/80 font-[Bricolage_Grotesque] mb-4">{post.editor}</p>
          </div>
          <div className="liquid-card p-8">
            <h4 className="font-semibold text-amber-400 mb-4 font-[Bricolage_Grotesque]">Bagikan Artikel</h4>
            <div className="flex gap-3">
              <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="liquid-btn w-10 h-10 flex items-center justify-center rounded-lg text-amber-400 hover:text-white transition" title="Bagikan ke Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" /></svg>
              </a>
              <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="liquid-btn w-10 h-10 flex items-center justify-center rounded-lg text-amber-400 hover:text-white transition" title="Bagikan ke Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a2 2 0 012-2h3z" /></svg>
              </a>
              <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="liquid-btn w-10 h-10 flex items-center justify-center rounded-lg text-amber-400 hover:text-white transition" title="Bagikan ke LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
              <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="liquid-btn w-10 h-10 flex items-center justify-center rounded-lg text-amber-400 hover:text-white transition" title="Bagikan ke WhatsApp">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.6 6.32c-1.63-1.62-3.8-2.52-6.11-2.52-4.76 0-8.63 3.87-8.63 8.63 0 1.52.39 3.01 1.14 4.33L2 22l4.6-1.2c1.27.73 2.71 1.12 4.17 1.12 4.76 0 8.63-3.87 8.63-8.63 0-2.31-.9-4.48-2.54-6.12M11.49 19.73c-1.28 0-2.54-.32-3.66-.94l-.26-.16-2.71.71.72-2.66-.17-.28c-.7-1.12-1.07-2.41-1.07-3.73 0-3.96 3.22-7.18 7.18-7.18 1.92 0 3.72.75 5.08 2.1 1.36 1.35 2.11 3.15 2.11 5.08 0 3.96-3.22 7.18-7.18 7.18m3.91-5.38c-.21-.11-1.27-.62-1.47-.69-.21-.08-.36-.11-.51.11-.16.21-.61.77-.75.92-.13.15-.27.17-.48.05-1.16-.58-1.92-.98-2.68-2.16-.2-.32.21-.3.58-.99.07-.14.04-.27-.02-.38-.06-.11-.51-1.23-.7-1.68-.18-.44-.37-.38-.51-.38-.13 0-.28 0-.42 0-.14 0-.37.05-.56.27-.2.21-.74.72-.74 1.76 0 1.04.76 2.04.86 2.18.11.14 1.55 2.36 3.74 3.31 1.02.45 1.81.72 2.43.93.52.18 1.01.15 1.39-.09.33-.22.68-.6.85-1.14.17-.54.17-1.01.12-1.11-.06-.11-.2-.16-.42-.27z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts Recommendation Section */}
      <section className="mx-auto max-w-4xl px-6 py-12 lg:px-8 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <h2 className="text-2xl font-bold text-white font-[Bricolage_Grotesque]">Artikel Rekomendasi</h2>
        </div>

        {relatedPosts && relatedPosts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {relatedPosts.map((relPost) => (
              <Link
                key={relPost.id}
                to={`/post/${relPost.id}`}
                className="group liquid-card rounded-xl overflow-hidden transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-video bg-gradient-to-br from-amber-500/10 to-amber-600/10 flex items-center justify-center overflow-hidden relative">
                    {relPost.cover_image ? (
                      <LazyImage
                        src={relPost.cover_image}
                        alt={relPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 flex items-center justify-center">
                        <span className="text-3xl">📰</span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-amber-500/20 text-amber-400 text-xs px-3 py-1 rounded-full border border-amber-500/30 backdrop-blur-md font-[Bricolage_Grotesque]">
                      {relPost.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <p className="text-xs text-slate-400 font-[Bricolage_Grotesque] mb-2">{relPost.date}</p>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition font-[Texturina] line-clamp-2 leading-snug">
                      {relPost.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-300 font-[Bricolage_Grotesque] line-clamp-2">
                      {relPost.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0 flex items-center gap-2 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition">
                  <span>Baca Selengkapnya</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            <Link
              to="/"
              className="group glass-card rounded-lg overflow-hidden transition p-6 liquid-shine"
            >
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">Lihat Lebih</p>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition font-[Bricolage_Grotesque]">Kembali ke Halaman Utama</h3>
              <p className="mt-2 text-sm text-amber-100/70 font-[Bricolage_Grotesque]">Lihat semua artikel dan rekomendasi lainnya</p>
            </Link>
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
