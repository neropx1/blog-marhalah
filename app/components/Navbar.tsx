import { Link, useLocation } from "@remix-run/react";
import { IconHome, IconSearch, IconInfoCircle, IconArticle } from "@tabler/icons-react";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Desktop Editorial Navbar */}
      <header className="sticky top-0 z-50 bg-[#0C0A08]/95 backdrop-blur-sm border-b border-[#241E16] md:block hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition">
                <img
                  className="h-8 w-auto"
                  src="/logo-horizontal-negative.webp"
                  alt="Impervious Generation"
                  loading="eager"
                />
              </Link>
              <div className="hidden lg:block h-4 w-[1px] bg-[#2E251A]" />
              <span className="hidden lg:inline text-xs tracking-wider uppercase text-[#8C7E68] font-[Bricolage_Grotesque]">
                Jurnal & Warta Angkatan
              </span>
            </div>

            {/* Nav Links */}
            <nav className="flex items-center gap-8">
              <Link
                to="/"
                className={`text-sm tracking-wide transition relative py-1 font-[Bricolage_Grotesque] ${
                  isActive("/")
                    ? "text-amber-400 font-semibold"
                    : "text-[#C8BA9E] hover:text-amber-300"
                }`}
              >
                Beranda
                {isActive("/") && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400" />
                )}
              </Link>
              <Link
                to="/jelajahi"
                className={`text-sm tracking-wide transition relative py-1 font-[Bricolage_Grotesque] ${
                  isActive("/jelajahi")
                    ? "text-amber-400 font-semibold"
                    : "text-[#C8BA9E] hover:text-amber-300"
                }`}
              >
                Jelajahi
                {isActive("/jelajahi") && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400" />
                )}
              </Link>
              <Link
                to="/tentang"
                className={`text-sm tracking-wide transition relative py-1 font-[Bricolage_Grotesque] ${
                  isActive("/tentang")
                    ? "text-amber-400 font-semibold"
                    : "text-[#C8BA9E] hover:text-amber-300"
                }`}
              >
                Tentang
                {isActive("/tentang") && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400" />
                )}
              </Link>
            </nav>

            {/* Quick Action */}
            <div className="flex items-center gap-3">
              <Link
                to="/jelajahi"
                className="btn-secondary btn-sm flex items-center gap-1.5 text-xs font-[Bricolage_Grotesque]"
              >
                <IconSearch className="w-3.5 h-3.5" />
                <span>Cari Artikel</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Top Bar */}
      <header className="sticky top-0 z-50 bg-[#0C0A08]/95 backdrop-blur-sm border-b border-[#241E16] md:hidden">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img
              className="h-7 w-auto"
              src="/logo-horizontal-negative.webp"
              alt="Impervious Generation"
              loading="eager"
            />
          </Link>
          <Link
            to="/jelajahi"
            className="p-1.5 text-[#C8BA9E] hover:text-amber-300 transition"
            aria-label="Cari artikel"
          >
            <IconSearch className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Mobile Bottom Navigation (Lean, Crisp) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0E0B08] border-t border-[#241E16] md:hidden">
        <div className="grid grid-cols-3 h-14">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center gap-1 transition ${
              isActive("/") ? "text-amber-400 font-semibold" : "text-[#9A8B74] hover:text-amber-300"
            }`}
          >
            <IconHome className="w-5 h-5" />
            <span className="text-[11px] font-[Bricolage_Grotesque]">Beranda</span>
          </Link>
          <Link
            to="/jelajahi"
            className={`flex flex-col items-center justify-center gap-1 transition ${
              isActive("/jelajahi") ? "text-amber-400 font-semibold" : "text-[#9A8B74] hover:text-amber-300"
            }`}
          >
            <IconArticle className="w-5 h-5" />
            <span className="text-[11px] font-[Bricolage_Grotesque]">Artikel</span>
          </Link>
          <Link
            to="/tentang"
            className={`flex flex-col items-center justify-center gap-1 transition ${
              isActive("/tentang") ? "text-amber-400 font-semibold" : "text-[#9A8B74] hover:text-amber-300"
            }`}
          >
            <IconInfoCircle className="w-5 h-5" />
            <span className="text-[11px] font-[Bricolage_Grotesque]">Tentang</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
