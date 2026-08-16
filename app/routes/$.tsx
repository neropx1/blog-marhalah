import { Link, useRouteError } from "@remix-run/react";
import Footer from "../components/Footer";
import LazyImage from "~/components/LazyImage";

export default function NotFound() {
  const error = useRouteError();
  
  return (
    <main className="min-h-screen gradient-wave pb-20 md:pb-0">
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center">
          
          <div className=" p-8 md:p-12 max-w-2xl mx-auto">
            <LazyImage src="/404.webp" alt="404" className="mx-auto w-48 md:w-64 mb-8" />
            <h2 className="text-2xl md:text-3xl font-bold mb-6 font-[Bricolage_Grotesque] text-amber-300 uppercase tracking-widest">
              Halaman Tidak Ditemukan
            </h2>
            <p className="text-amber-100/80 font-[Merriweather] leading-relaxed mb-8">
              Maaf, halaman yang Anda cari tidak dapat ditemukan. 
              Mungkin halaman telah dipindahkan atau dihapus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="liquid-btn btn-lg"
              >
                Kembali ke Beranda
              </Link>
              <Link
                to="/jelajahi"
                className="btn-ghost btn-lg"
              >
                Jelajahi Artikel
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
