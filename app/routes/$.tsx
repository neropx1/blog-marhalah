import { Link } from "@remix-run/react";
import Footer from "../components/Footer";
import LazyImage from "~/components/LazyImage";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [
  { title: "Halaman Tidak Ditemukan — Impervious Generation" },
];

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0C0A08] text-[#FAF4E8] pb-16 md:pb-0 flex flex-col justify-between">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="border border-[#272118] bg-[#120F0C] rounded-lg p-8 md:p-12">
          <LazyImage
            src="/404.webp"
            alt="404"
            className="mx-auto w-40 md:w-56 mb-6 opacity-90"
          />
          <span className="text-xs uppercase font-bold tracking-widest text-amber-400 font-[Bricolage_Grotesque]">
            Galat 404
          </span>
          <h1 className="text-2xl md:text-3xl font-bold font-[Texturina] text-[#FAF4E8] mt-1 mb-3">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs md:text-sm text-[#A89C86] font-[Merriweather] leading-relaxed mb-6 max-w-md mx-auto">
            Halaman atau artikel yang Anda tuju mungkin telah dipindahkan, berganti tautan, atau sudah tidak tersedia.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/" className="btn-primary btn-sm font-[Bricolage_Grotesque]">
              Kembali ke Beranda
            </Link>
            <Link to="/jelajahi" className="btn-secondary btn-sm font-[Bricolage_Grotesque]">
              Jelajahi Artikel Lain
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
