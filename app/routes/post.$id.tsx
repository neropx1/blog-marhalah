import { json, type LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { fetchPostsFromGithub } from "~/utils/github-posts";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import Footer from "~/components/Footer";




export const loader: LoaderFunction = async ({ params }) => {
  const posts = await fetchPostsFromGithub();
  const post = posts.find((p: any) => p.id === params.id);

  if (!post) {
    throw new Response("Post not found", { status: 404 });
  }

  return json({ post });
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
  post: Post;
}


// Custom components for markdown rendering
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
    <ul className="list-disc list-inside space-y-2 mb-4 font-[Merriweather]">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-2 mb-4 font-[Merriweather]">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-slate-300">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-amber-500 pl-6 italic text-slate-300 my-4 font-[Merriweather]">
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
    <img src={props.src} alt={props.alt} className="w-full rounded-lg shadow-lg my-6 border border-slate-800" />
  ),
};



export default function PostDetail() {
  const { post } = useLoaderData<LoaderData>();
  const posts = useLoaderData<LoaderData>().post;

  // Get all posts untuk rekomendasi
  const allPosts = useLoaderData<LoaderData>();

  // Generate share URLs
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = encodeURIComponent(post.title);
  const shareText = encodeURIComponent(post.description);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    whatsapp: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
  };

  return (
    <main className="min-h-screen">
      <article className="mx-auto max-w-4xl px-6 py-8 lg:px-8">
        {/* Cover Image */}
        {post.cover_image && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-2xl border border-amber-500/30">
            <img src={post.cover_image} alt={post.title} className="w-full h-auto object-cover" />
          </div>
        )}

        {/* Header */}
        <header className="mb-10">
          <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            <span className="inline-block bg-amber-500/20 text-amber-400 px-4 py-2 text-sm font-semibold rounded-full border border-amber-500/30">
              {post.category}
            </span>
            <time className="text-sm text-slate-400 font-[Merriweather]">{post.date}</time>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight font-[Texturina]">{post.title}</h1>
          <p className="text-lg md:text-xl text-slate-300 mb-6 font-[Merriweather]">{post.description}</p>
          <div className="flex items-center gap-6 border-t border-slate-800 pt-6 flex-wrap gap-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">Ditulis oleh</p>
              <p className="font-semibold text-white font-[Merriweather]">{post.author}</p>
            </div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-amber-500/20 text-amber-400 px-3 py-1 text-sm rounded-full border border-amber-500/30 font-[Merriweather]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="mb-16">
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown components={MarkdownComponents} rehypePlugins={[rehypeRaw]}>
              {post.body}
            </ReactMarkdown>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 my-12" />

        {/* Footer */}
        <div className="grid gap-8 sm:grid-cols-2 mb-16">
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-lg p-8">
            <h4 className="font-semibold text-amber-400 mb-4">Tentang Penulis</h4>
            <p className="text-slate-300 font-[Merriweather]">{post.author}</p>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/30 rounded-lg p-8">
            <h4 className="font-semibold text-amber-400 mb-4">Bagikan Artikel</h4>
            <div className="flex gap-3">
              <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-amber-600/50 transition text-amber-400 hover:text-white" title="Bagikan ke Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" /></svg>
              </a>
              <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-amber-600/50 transition text-amber-400 hover:text-white" title="Bagikan ke Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a6 6 0 00-6 6v3H7v4h2v8h4v-8h3l1-4h-4V8a2 2 0 012-2h3z" /></svg>
              </a>
              <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-amber-600/50 transition text-amber-400 hover:text-white" title="Bagikan ke LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
              <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-amber-600/50 transition text-amber-400 hover:text-white" title="Bagikan ke WhatsApp">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.6 6.32c-1.63-1.62-3.8-2.52-6.11-2.52-4.76 0-8.63 3.87-8.63 8.63 0 1.52.39 3.01 1.14 4.33L2 22l4.6-1.2c1.27.73 2.71 1.12 4.17 1.12 4.76 0 8.63-3.87 8.63-8.63 0-2.31-.9-4.48-2.54-6.12M11.49 19.73c-1.28 0-2.54-.32-3.66-.94l-.26-.16-2.71.71.72-2.66-.17-.28c-.7-1.12-1.07-2.41-1.07-3.73 0-3.96 3.22-7.18 7.18-7.18 1.92 0 3.72.75 5.08 2.1 1.36 1.35 2.11 3.15 2.11 5.08 0 3.96-3.22 7.18-7.18 7.18m3.91-5.38c-.21-.11-1.27-.62-1.47-.69-.21-.08-.36-.11-.51.11-.16.21-.61.77-.75.92-.13.15-.27.17-.48.05-1.16-.58-1.92-.98-2.68-2.16-.2-.32.21-.3.58-.99.07-.14.04-.27-.02-.38-.06-.11-.51-1.23-.7-1.68-.18-.44-.37-.38-.51-.38-.13 0-.28 0-.42 0-.14 0-.37.05-.56.27-.2.21-.74.72-.74 1.76 0 1.04.76 2.04.86 2.18.11.14 1.55 2.36 3.74 3.31 1.02.45 1.81.72 2.43.93.52.18 1.01.15 1.39-.09.33-.22.68-.6.85-1.14.17-.54.17-1.01.12-1.11-.06-.11-.2-.16-.42-.27z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="mx-auto max-w-4xl px-6 py-12 lg:px-8 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <h2 className="text-2xl font-bold text-white font-zhoro">Artikel Rekomendasi</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <Link
            to="/"
            className="group bg-slate-900/50 border border-slate-800/50 rounded-lg overflow-hidden hover:border-amber-500/50 hover:bg-slate-900/70 transition"
          >
            <div className="aspect-video bg-gradient-to-br from-amber-500/10 to-amber-600/10 flex items-center justify-center overflow-hidden relative group-hover:from-amber-500/20 group-hover:to-amber-600/20 transition" />
            <div className="p-6">
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">Lihat Lebih</p>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition font-zhoro">Kembali ke Halaman Utama</h3>
              <p className="mt-2 text-sm text-slate-400 font-[Merriweather]">Lihat semua artikel dan rekomendasi lainnya</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
