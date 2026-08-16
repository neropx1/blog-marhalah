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
    <footer className="glass mt-20 border-t border-amber-500/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img className="md:w-64 w-48" src="logo-horizontal-negative.webp" alt="Logo" loading="lazy" />
            </div>
            <p className="text-sm leading-relaxed text-amber-100/70 mb-6 font-[Bricolage_Grotesque]">
              Generasi tonggak 100 Tahun Kedua Gontor yang tangguh dalam mengupayakan perbaikan umat dan menegakkan kebenaran, teguh dalam mempertahankan prinsip Islam, identitas, dan nilai Gontori, kokoh dalam integritas, selaras antara seruan dan perbuatan, serta dinamis meningkatkan kualitas umat demi mewujudkan pusat peradaban dunia.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button p-2.5 rounded-lg text-amber-100/80 hover:text-amber-400 transition duration-200"
                title="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button p-2.5 rounded-lg text-amber-100/80 hover:text-amber-400 transition duration-200"
                title="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-button p-2.5 rounded-lg text-amber-100/80 hover:text-amber-400 transition duration-200"
                title="X (Twitter)"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold mb-6 uppercase tracking-wider text-amber-400 font-[Merriweather]">
              Navigasi
            </h4>
            <ul className="space-y-3">
              {Object.entries(displayLinks).map(([label, href]) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-sm text-amber-100/80 hover:text-amber-400 transition font-[Merriweather]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold mb-6 uppercase tracking-wider text-amber-400 font-[Merriweather]">
              Kategori
            </h4>
            <ul className="space-y-3">
              {displayCategories.map((category) => (
                <li key={category}>
                  <Link
                    to={`/jelajahi?category=${category}`}
                    className="text-sm text-amber-100/80 hover:text-amber-400 transition font-[Merriweather]"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Info */}
          <div>
            <h4 className="text-sm font-semibold mb-6 uppercase tracking-wider text-amber-400 font-[Merriweather]">
              Kontak & Informasi
            </h4>
            <ul className="space-y-4 text-sm text-amber-100/70">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="leading-relaxed">Pondok Modern Darussalam Gontor, Ponorogo, Jawa Timur, Indonesia</span>
              </li>
           
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:siswaakhir2027@gontor.ac.id" className="hover:text-amber-400 transition font-[Merriweather]">siswaakhir2027@gontor.ac.id</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-amber-500/20 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-amber-100/60 font-[Bricolage_Grotesque] tracking-wide">
            © {currentYear} Impervious Generation & Impervious Media. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/privacy" className="text-amber-100/60 hover:text-amber-400 transition font-[Merriweather]">Privacy Policy</Link>
            <Link to="/terms" className="text-amber-100/60 hover:text-amber-400 transition font-[Merriweather]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
