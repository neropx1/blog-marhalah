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
              <img className="w-8 h-8 rounded " src="/lambang.webp"/>
              <div className="text-lg md:text-2xl font-bold font-[Zhoro] text-gold-900 ">Impervio<span className="font-[Zhoro]" style={{ color: "var(--gold-soft)"}}>.us</span></div>
            </div>
            <p className="text-sm" style={{ color: "var(--text-dark-secondary)" }}>
              Sebuah blog modern yang menghadirkan insights, cerita, dan perspektif tentang teknologi, design, dan kehidupan digital.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: "var(--gold)" }}>
              Kategori
            </h4>
            <ul className="space-y-2">
              {displayCategories.map((category) => (
                <li key={category}>
                  <Link
                    to={`/browse?category=${encodeURIComponent(category)}`}
                    className="nav-link text-sm hover:text-gold transition"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
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
        </div>

        {/* Divider */}
        <div style={{ borderTop: `1px solid var(--border-dark)` }} className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs" style={{ color: "var(--text-dark-secondary)" }}>
            © {currentYear} Impervious Generation. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="nav-link text-xs" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
