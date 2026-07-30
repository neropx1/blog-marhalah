import { Link, useLocation } from "@remix-run/react";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b backdrop-blur sticky top-0 z-50 transition-colors" style={{
      backgroundColor: "rgba(26, 15, 10, 0.95)",
      borderColor: "var(--border-dark)"
    }}>
      <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
        {/* Desktop & Mobile Top Bar */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition flex-shrink-0">
            <img className="w-32 md:w-48 " src="/horizontal.webp" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex gap-8 items-center">
            <Link
              to="/"
              className={`nav-link transition text-sm font-medium ${isActive("/")
                ? "border-b-2"
                : "hover:opacity-70"
                }`}
              style={{
                color: isActive("/") ? "var(--gold)" : undefined,
                borderColor: "var(--gold)"
              }}
            >
              Beranda
            </Link>
            <Link
              to="/jelajahi"
              className={`nav-link transition text-sm font-medium ${isActive("/jelajahi")
                ? "border-b-2"
                : "hover:opacity-70"
                }`}
              style={{
                color: isActive("/jelajahi") ? "var(--gold)" : undefined,
                borderColor: "var(--gold)"
              }}
            >
              Jelajahi
            </Link>
            <div className="flex gap-2 items-center">
              <Link
                to="/admin"
                className="nav-link transition text-sm font-medium hover:opacity-70"
              >
                CMS
              </Link>
              <Link
                to="/admin-panel"
                className="btn-primary text-sm"
              >
                Panel
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-800 rounded transition"
            title="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--gold)" }}>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Mobile Nav Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden flex flex-col gap-3 mt-4 pt-4 border-t" style={{ borderColor: "var(--border-dark)" }}>
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2 rounded text-sm font-medium transition`}
              style={{
                backgroundColor: isActive("/") ? "var(--gold)" : "var(--bg-dark-2)",
                color: isActive("/") ? "var(--text-light)" : "var(--text-dark)"
              }}
            >
              Beranda
            </Link>
            <Link
              to="/jelajahi"
              onClick={() => setMobileMenuOpen(false)}
              className={`px-4 py-2 rounded text-sm font-medium transition`}
              style={{
                backgroundColor: isActive("/jelajahi") ? "var(--gold)" : "var(--bg-dark-2)",
                color: isActive("/jelajahi") ? "var(--text-light)" : "var(--text-dark)"
              }}
            >
              Jelajahi
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="nav-link transition text-sm font-medium px-4 py-2 hover:opacity-70"
            >
              CMS
            </Link>
            <Link
              to="/admin-panel"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-primary text-sm"
            >
              Panel
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
