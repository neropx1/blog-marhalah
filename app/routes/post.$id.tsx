import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getPostByPath, getRelatedPosts, type Post } from "../utils/sanity.server";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Footer from "../components/Footer";
import LazyImage from "../components/LazyImage";
import CoverImageSlider from "../components/CoverImageSlider";
import { useState, useEffect, useMemo, useRef } from "react";
import type { Components as MarkdownComponentsType } from "react-markdown";

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

// Helper menghitung estimasi waktu baca
function getReadTime(text: string): string {
  const words = text ? text.trim().split(/\s+/).length : 100;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} menit baca`;
}

interface LoaderData {
  post: Post;
  relatedPosts: Post[];
}

export const loader: LoaderFunction = async ({ params }) => {
  const post = params.id ? await getPostByPath(params.id) : null;
  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }

  const relatedPosts = await getRelatedPosts(post.id, post.category);

  return json({ post, relatedPosts });
};

export const meta: MetaFunction<typeof loader> = ({ data }): Record<string, string>[] => {
  if (!data) {
    return [{ title: "Post — Impervious Generation" }];
  }

  const { post } = data;
  const metaTitle = post.meta_title || post.title;
  const metaDescription = post.meta_description || post.description || post.excerpt;
  return [
    { title: post.meta_title || `${post.title} — Impervious Generation` },
    { name: "description", content: metaDescription },
    { name: "keywords", content: post.tags?.join(", ") || post.category },
    { name: "author", content: post.author },
    { property: "og:title", content: metaTitle },
    { property: "og:description", content: metaDescription },
    { property: "og:type", content: "article" },
    { property: "og:image", content: post.cover_image || "" },
    { property: "article:author", content: post.author },
    { property: "article:published_time", content: post.date },
    { property: "article:section", content: post.category },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: metaTitle },
    { name: "twitter:description", content: metaDescription },
    { name: "twitter:image", content: post.cover_image || "" },
  ];
};

// Custom components for markdown rendering (editorial layout)
const MarkdownComponents: MarkdownComponentsType = {
  h1: ({ children }) => (
    <h1 className="text-2xl md:text-3xl font-bold text-[#FAF4E8] mt-8 mb-4 font-[Texturina] leading-tight">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl md:text-2xl font-bold text-[#FAF4E8] mt-8 mb-3 font-[Texturina] leading-tight">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg md:text-xl font-bold text-[#FAF4E8] mt-6 mb-2 font-[Texturina] leading-tight">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-base md:text-[18px] text-[#D8CEBA] leading-[1.8] mb-6 font-[Merriweather]">
      {children}
    </p>
  ),
  a: (props) => (
    <a
      href={props.href || "#"}
      className="text-amber-400 hover:text-amber-300 underline underline-offset-4 decoration-amber-400/50 hover:decoration-amber-300 transition"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {props.children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-[#FAF4E8]">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-[#E3DAC8]">{children}</em>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-6 space-y-2 mb-6 text-[#D8CEBA] font-[Merriweather] text-base md:text-[17px]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-6 space-y-2 mb-6 text-[#D8CEBA] font-[Merriweather] text-base md:text-[17px]">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-amber-400 pl-5 my-6 italic text-[#FAF4E8] font-[Merriweather] bg-[#14110D] py-3 pr-4 rounded-r">
      {children}
    </blockquote>
  ),
  code: (props) => (
    <code className="bg-[#18140F] text-amber-300 px-1.5 py-0.5 rounded font-mono text-xs border border-[#2B2319]">
      {props.children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="bg-[#120F0C] p-4 rounded-lg overflow-x-auto my-6 border border-[#272118] text-xs font-mono">
      <code className="text-[#E2DAC8]">{children}</code>
    </pre>
  ),
  img: (props) => (
    <figure className="my-8">
      <div className="rounded-lg overflow-hidden border border-[#272118] bg-[#120F0C]">
        <LazyImage
          src={props.src || ""}
          alt={props.alt || ""}
          className="w-full h-auto object-cover max-h-[600px]"
        />
      </div>
      {props.alt && props.alt.trim() !== "" && (
        <figcaption className="text-center text-xs md:text-sm text-[#A89C86] mt-2.5 font-[Bricolage_Grotesque] italic">
          {props.alt}
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  // Scroll reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        ? [{
            url: post.cover_image,
            alt: post.cover_image_alt,
            caption: post.cover_image_caption,
          }]
        : [];

  const shareTitle = encodeURIComponent(post.title);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleCopyLink = async () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        // Fallback
      }
    }
  };

  const readTimeStr = useMemo(() => getReadTime(post.body || post.description), [post.body, post.description]);

  return (
    <main className="min-h-screen bg-[#0C0A08] text-[#FAF4E8]" key={post.id}>
      {/* Scroll Reading Progress Bar pinned at the very top */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-amber-500 to-amber-300 z-[60] transition-all duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb / Kicker */}
        <div className="flex items-center gap-2 text-xs font-[Bricolage_Grotesque] text-[#8F816B] mb-4">
          <Link to="/" className="hover:text-amber-400 transition">
            Beranda
          </Link>
          <span>/</span>
          <Link to={`/jelajahi?category=${encodeURIComponent(post.category)}`} className="text-amber-400 hover:underline">
            {post.category}
          </Link>
        </div>

        {/* Article Headline Header */}
        <header ref={articleTopRef} className="mb-8 scroll-mt-20">
          <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#FAF4E8] font-[Texturina] leading-tight mb-4">
            {post.title}
          </h1>

          {post.description && (
            <p className="text-base md:text-lg text-[#BFB39B] font-[Merriweather] leading-relaxed mb-6">
              {post.description}
            </p>
          )}

          {/* Byline Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#221C14] text-xs font-[Bricolage_Grotesque]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1C1711] border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                {post.author ? post.author.charAt(0).toUpperCase() : "A"}
              </div>
              <div>
                <p className="font-semibold text-[#FAF4E8]">{post.author}</p>
                <div className="flex items-center gap-2 text-[#8F816B]">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{readTimeStr}</span>
                </div>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="flex items-center gap-1.5">
              {currentUrl && (
                <>
                  <a
                    href={`https://wa.me/?text=${shareTitle}%20${encodeURIComponent(currentUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded bg-[#14110D] text-[#A89C86] hover:text-amber-300 border border-[#272118] transition"
                    title="Bagikan ke WhatsApp"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.6 6.32c-1.63-1.62-3.8-2.52-6.11-2.52-4.76 0-8.63 3.87-8.63 8.63 0 1.52.39 3.01 1.14 4.33L2 22l4.6-1.2c1.27.73 2.71 1.12 4.17 1.12 4.76 0 8.63-3.87 8.63-8.63 0-2.31-.9-4.48-2.54-6.12M11.49 19.73c-1.28 0-2.54-.32-3.66-.94l-.26-.16-2.71.71.72-2.66-.17-.28c-.7-1.12-1.07-2.41-1.07-3.73 0-3.96 3.22-7.18 7.18-7.18 1.92 0 3.72.75 5.08 2.1 1.36 1.35 2.11 3.15 2.11 5.08 0 3.96-3.22 7.18-7.18 7.18m3.91-5.38c-.21-.11-1.27-.62-1.47-.69-.21-.08-.36-.11-.51.11-.16.21-.61.77-.75.92-.13.15-.27.17-.48.05-1.16-.58-1.92-.98-2.68-2.16-.2-.32.21-.3.58-.99.07-.14.04-.27-.02-.38-.06-.11-.51-1.23-.7-1.68-.18-.44-.37-.38-.51-.38-.13 0-.28 0-.42 0-.14 0-.37.05-.56.27-.2.21-.74.72-.74 1.76 0 1.04.76 2.04.86 2.18.11.14 1.55 2.36 3.74 3.31 1.02.45 1.81.72 2.43.93.52.18 1.01.15 1.39-.09.33-.22.68-.6.85-1.14.17-.54.17-1.01.12-1.11-.06-.11-.2-.16-.42-.27z" />
                    </svg>
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${shareTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded bg-[#14110D] text-[#A89C86] hover:text-amber-300 border border-[#272118] transition"
                    title="Bagikan ke X / Twitter"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  <button
                    onClick={handleCopyLink}
                    className="p-2 rounded bg-[#14110D] text-[#A89C86] hover:text-amber-300 border border-[#272118] transition flex items-center gap-1 text-[11px]"
                    title="Salin Tautan Artikel"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>{copied ? "Tersalin!" : "Salin"}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Cover Image Slider or Static Cover */}
        {coverImages.length > 0 && (
          <CoverImageSlider images={coverImages} title={post.title} />
        )}

        {/* Article Body Content */}
        <section className="mb-10">
          <div className="prose-editorial">
            <ReactMarkdown components={MarkdownComponents} rehypePlugins={[rehypeRaw]}>
              {contentPages[currentPage - 1] || ""}
            </ReactMarkdown>
          </div>
        </section>

        {/* Article Pagination (if split into multiple pages) */}
        {contentPages.length > 1 && (
          <div className="border border-[#272118] bg-[#120F0C] rounded-lg p-4 my-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-[Bricolage_Grotesque]">
            <div className="text-[#8F816B]">
              Halaman <span className="font-bold text-amber-400">{currentPage}</span> dari{" "}
              <span className="font-bold text-amber-400">{contentPages.length}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-secondary btn-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Sebelumnya
              </button>

              {contentPages.map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = currentPage === pageNum;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-7 h-7 rounded text-xs font-semibold transition ${
                      isActive
                        ? "bg-[#D4AF37] text-[#0C0A08]"
                        : "bg-[#16120D] text-[#A89C86] hover:text-white border border-[#272118]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === contentPages.length}
                className="btn-secondary btn-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Selanjutnya →
              </button>
            </div>
          </div>
        )}

        {/* Tags & Credits */}
        <div className="border-t border-[#221C14] pt-6 mb-12">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-[#8F816B] font-[Bricolage_Grotesque]">Topik:</span>
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-[#14110D] text-[#C8BA9E] px-2.5 py-1 text-xs rounded border border-[#272118] font-[Bricolage_Grotesque]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Credits box */}
          {(post.photographer || post.editor) && (
            <div className="border border-[#272118] bg-[#120F0C] rounded p-4 text-xs font-[Bricolage_Grotesque] text-[#8F816B] space-y-1">
              {post.photographer && (
                <p>
                  Fotografer: <span className="text-[#FAF4E8] font-medium">{post.photographer}</span>
                </p>
              )}
              {post.editor && (
                <p>
                  Penyunting / Editor: <span className="text-[#FAF4E8] font-medium">{post.editor}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Author Box */}
        <div className="border border-[#272118] bg-[#120F0C] rounded-lg p-6 mb-12 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#1A150F] border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-lg flex-shrink-0">
            {post.author ? post.author.charAt(0).toUpperCase() : "A"}
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 font-[Bricolage_Grotesque]">
              Penulis
            </span>
            <h4 className="text-base font-bold font-[Texturina] text-[#FAF4E8] mt-0.5">
              {post.author}
            </h4>
            <p className="text-xs text-[#8F816B] font-[Merriweather] mt-1 leading-relaxed">
              Kontributor dan anggota Impervious Generation yang berkomitmen menyuarakan narasi kemajuan dan integritas.
            </p>
          </div>
        </div>

        {/* Related Posts Recommendation Section */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="border-t border-[#221C14] pt-8">
            <h3 className="text-xs uppercase font-bold tracking-wider text-amber-400 font-[Bricolage_Grotesque] mb-6">
              Artikel Rekomendasi
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              {relatedPosts.map((relPost) => (
                <Link
                  key={relPost.id}
                  to={`/post/${relPost.id}`}
                  className="border border-[#272118] bg-[#120F0C] rounded-lg p-4 hover:border-amber-500/35 transition group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold font-[Bricolage_Grotesque]">
                      {relPost.category}
                    </span>
                    <h4 className="text-sm md:text-base font-bold font-[Texturina] text-[#FAF4E8] group-hover:text-amber-300 transition leading-snug mt-1 mb-2 line-clamp-2">
                      {relPost.title}
                    </h4>
                    <p className="text-xs text-[#8F816B] font-[Merriweather] line-clamp-2">
                      {relPost.description || relPost.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#1C1711] flex items-center justify-between text-[11px] font-[Bricolage_Grotesque] text-[#7A6D5A]">
                    <span>{relPost.date}</span>
                    <span className="text-amber-400 group-hover:text-amber-300">Baca →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      <Footer />
    </main>
  );
}
