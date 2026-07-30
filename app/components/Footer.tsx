import { Link } from "@remix-run/react";

interface FooterProps {
  categories?: string[];
  links?: Record<string, string>;
}

export default function Footer({ categories = [], links = {} }: FooterProps) {
  const defaultCategories = ["Teknologi", "Design", "Bisnis", "Lifestyle"];
  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  const defaultLinks = {
    "Beranda": "/",
    "Jelajahi": "/browse",
    "CMS": "/admin",
    "Panel": "/admin-panel"
  };
  const displayLinks = Object.keys(links).length > 0 ? links : defaultLinks;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t mt-20 transition-colors" style={{
      borderColor: "var(--border-dark)",
      backgroundColor: "var(--bg-dark)"
    }}>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img className="w-8 h-8 rounded " src="/lambang.webp" />
              <div className="text-lg md:text-2xl font-bold font-[Zhoro] text-gold-900 ">Impervio<span className="font-[Zhoro]" style={{ color: "var(--gold-soft)" }}>.us</span></div>
            </div>
            <p className="text-sm" style={{ color: "var(--text-dark-secondary)" }}>
              Sebuah blog modern yang menghadirkan insights, cerita, dan perspektif tentang teknologi, design, dan kehidupan digital.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: "var(--gold)" }}>
              Navigasi
            </h4>
            <ul className="space-y-2">
              {Object.entries(displayLinks).map(([label, href]) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="nav-link text-sm hover:text-gold transition"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Info */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: "var(--gold)" }}>
              Kontak & Informasi
            </h4>
            <ul className="space-y-3 text-sm" style={{ color: "var(--text-dark-secondary)" }}>
              <li className="flex items-start gap-2.5">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "var(--gold)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Pondok Modern Darussalam Gontor, Ponorogo, Jawa Timur, Indonesia</span>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-5 h-5 flex-shrink-0" style={{ color: "var(--gold)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+6281234567890" className="hover:text-gold transition">+62 812-3456-7890</a>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-5 h-5 flex-shrink-0" style={{ color: "var(--gold)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@impervious.us" className="hover:text-gold transition">info@impervious.us</a>
              </li>
            </ul>
          </div>
        </div>



        {/* Divider */}
        <div style={{ borderTop: `1px solid var(--border-dark)` }} className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs" style={{ color: "var(--text-dark-secondary)" }}>
            © {currentYear} Impervious Generation. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-amber-500/20 text-slate-400 hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/10 transition duration-200"
              title="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-amber-500/20 text-slate-400 hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/10 transition duration-200"
              title="YouTube"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>

            {/* TikTok */}
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-amber-500/20 text-slate-400 hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/10 transition duration-200"
              title="TikTok"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.56-1.32 1.56-1.28 2.56.02.91.48 1.8 1.25 2.29.87.57 2 .61 2.91.17.86-.41 1.44-1.26 1.51-2.2.06-2.52.02-5.04.03-7.56V.02z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-amber-500/20 text-slate-400 hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/10 transition duration-200"
              title="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>

            {/* X / Twitter */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full border border-amber-500/20 text-slate-400 hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/10 transition duration-200"
              title="X (Twitter)"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
