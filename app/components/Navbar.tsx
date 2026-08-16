import { Link, useLocation } from "@remix-run/react";
import { useState } from "react";
import { IconHome, IconSearch, IconUser, IconSettings, IconInfoCircle } from "@tabler/icons-react";

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="glass-strong sticky top-0 z-50 transition-all duration-300 border-b border-amber-500/10 md:block hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition flex-shrink-0">
              <img className="h-10 w-auto" src="/logo-horizontal-negative.webp" alt="Impervious Generation" />
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex gap-8 items-center">
              <Link
                to="/"
                className={`nav-link transition text-sm font-medium font-[Merriweather] tracking-wide ${isActive("/")
                  ? "text-amber-400 font-semibold"
                  : "text-amber-100/80 hover:text-amber-400"
                  }`}
              >
                Beranda
              </Link>
              <Link
                to="/jelajahi"
                className={`nav-link transition text-sm font-medium font-[Merriweather] tracking-wide ${isActive("/jelajahi")
                  ? "text-amber-400 font-semibold"
                  : "text-amber-100/80 hover:text-amber-400"
                  }`}
              >
                Jelajahi
              </Link>
              <Link
                to="/tentang"
                className={`nav-link transition text-sm font-medium font-[Merriweather] tracking-wide ${isActive("/tentang")
                  ? "text-amber-400 font-semibold"
                  : "text-amber-100/80 hover:text-amber-400"
                  }`}
              >
                Tentang
              </Link>
              
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <nav className="glass-strong sticky top-0 z-50 transition-all duration-300 border-b border-amber-500/10 md:hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition flex-shrink-0">
              <img className="h-10 w-auto" src="/logo-horizontal-negative.webp" alt="Impervious Generation" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-amber-500/10 md:hidden">
        <div className="flex justify-around items-center py-3 px-4">
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 transition ${isActive("/")
              ? "text-amber-400"
              : "text-amber-100/60 hover:text-amber-400"
              }`}
          >
            <IconHome className="w-6 h-6" />
            <span className="text-xs font-[Merriweather]">Beranda</span>
          </Link>
          <Link
            to="/jelajahi"
            className={`flex flex-col items-center gap-1 transition ${isActive("/jelajahi")
              ? "text-amber-400"
              : "text-amber-100/60 hover:text-amber-400"
              }`}
          >
            <IconSearch className="w-6 h-6" />
            <span className="text-xs font-[Merriweather]">Jelajahi</span>
          </Link>
          <Link
            to="/tentang"
            className={`flex flex-col items-center gap-1 transition ${isActive("/tentang")
              ? "text-amber-400"
              : "text-amber-100/60 hover:text-amber-400"
              }`}
          >
            <IconInfoCircle className="w-6 h-6" />
            <span className="text-xs font-[Merriweather]">Tentang</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
