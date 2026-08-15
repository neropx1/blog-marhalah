import { Link } from "@remix-run/react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { motion } from "motion/react";
import { useState } from "react";
import { ShootingStars } from "~/components/ui/shooting-stars";
import { StarsBackground } from "~/components/ui/stars-bg";

export default function Tentang() {
  const [activeShard, setActiveShard] = useState<string | null>(null);

  const shards = [
    {
      id: 'crown',
      title: 'Mahkota',
      color: 'from-amber-400 to-amber-600',
      shadow: 'shadow-amber-500/50',
      glow: 'bg-amber-400/20',
      textColor: 'text-amber-300',
      image: 'https://imperviousgeneration.my.id/assets/images/part_logo/lafadz_allah.webp'
    },
    {
      id: 'circle',
      title: 'Satuan Lingkaran',
      color: 'from-purple-400 to-purple-600',
      shadow: 'shadow-purple-500/50',
      glow: 'bg-purple-400/20',
      textColor: 'text-purple-300',
      image: 'https://imperviousgeneration.my.id/assets/images/part_logo/mahkota.webp'
    },
    {
      id: 'book',
      title: 'Ilmu Pengetahuan',
      color: 'from-blue-400 to-blue-600',
      shadow: 'shadow-blue-500/50',
      glow: 'bg-blue-400/20',
      textColor: 'text-blue-300',
      image: 'https://imperviousgeneration.my.id/assets/images/part_logo/lempengan.webp'
    },
    {
      id: 'shield',
      title: 'Perlindungan',
      color: 'from-green-400 to-green-600',
      shadow: 'shadow-green-500/50',
      glow: 'bg-green-400/20',
      textColor: 'text-green-300',
      image: 'https://imperviousgeneration.my.id/assets/images/part_logo/muhammad.webp'
    }
  ];

  return (
    <main className="min-h-screen relative pb-20 md:pb-0">
      {/* Background gradient shader */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-amber-800/10 to-purple-900/20 animate-pulse" />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-2 md:py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-block mb-8">
                <img src="/lambang.webp" alt="Lambang Impervious Generation" className="w-48 md:w-96 mx-auto" />
              </div>
              <h1 className="text-5xl md:text-7xl mb-4 font-[Zhoro] text-amber-200">
                Impervious Generation
              </h1>
              <p className="text-2xl md:text-3xl font-[Zhoro] text-amber-400 mb-6">
                Golden Age Catalyst
              </p>
              <p className="text-lg md:text-xl text-amber-100/80 font-[Merriweather] leading-relaxed">
                Unshaken · Unbroken
              </p>
            </div>
          </div>
        </section>

        {/* Landasan Angkatan */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-dashed border-amber-400/30 p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-[Zhoro] !text-amber-400">
              Landasan Angkatan
            </h2>
            <p className="text-lg md:text-xl leading-relaxed font-[Merriweather] text-amber-100/90 ">
              Generasi tonggak 100 Tahun Kedua Gontor yang tangguh dalam mengupayakan perbaikan umat dan menegakkan kebenaran, teguh dalam mempertahankan prinsip Islam, identitas, dan nilai Gontori, kokoh dalam integritas, selaras antara seruan dan perbuatan, serta dinamis meningkatkan kualitas umat demi mewujudkan pusat peradaban dunia.
            </p>
          </div>
        </section>

        {/* Landasan Angkatan */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
          <div className="border-dashed border-amber-400/30 p-8 md:p-12">
           
            <h2 className="text-3xl md:text-4xl font-bold mb-6 font-[Zhoro] !text-amber-400">
              Landasan Ayat
            </h2>

            <img src="/ayat.webp" alt="Landasan Ayat" className="md:w-5xl w-full mx-auto md:p-8 p-2  md:liquid-card" />
            <p className="text-lg md:text-xl leading-relaxed font-[Merriweather] text-amber-100/90 py-8">
              ...Dan aku tidak berkehendak menyalahi kamu (dengan mengerjakan) apa yang aku larang. Aku tidak bermaksud kecuali (mendatangkan) perbaikan selama aku masih berkesanggupan. Dan tidak ada taufik bagiku melainkan dengan (pertolongan) Allah. Hanya kepada Allah aku bertawakkal dan hanya kepada-Nya-lah aku kembali.” (QS Huud: 88)
            </p>
          </div>
        </section>

        {/* Identitas Visual */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 font-[Zhoro] !text-amber-400 text-center">
            Identitas Visual
          </h2>
          
          <div className="flex flex-col items-center">
            {/* Main Logo */}
            <div className="mb-12 relative">
              <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full" />
              <img src="/lambang.webp" alt="Lambang Impervious Generation" className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 relative z-10" />
            </div>

            {/* Philosophy Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
              {shards.map((shard) => (
                <motion.div
                  key={shard.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`liquid-card p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:border-amber-400 ${activeShard === shard.id ? 'border-2 ' + shard.color.split(' ')[1] : ''}`}
                  onClick={() => setActiveShard(activeShard === shard.id ? null : shard.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-24 md:w-36`}>
                      <img 
                        src={shard.image} 
                        alt={shard.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg md:text-xl font-bold mb-2 font-[Bricolage_Grotesque] ${shard.textColor}`}>
                        {shard.title}
                      </h3>
                      <p className="text-amber-100/80 font-[Merriweather] leading-relaxed text-sm md:text-base">
                        {shard.id === 'crown' && 'Simbol keagungan dan kemuliaan dalam perjuangan. Menggambarkan visi tinggi untuk mencapai kejayaan umat.'}
                        {shard.id === 'circle' && 'Melambangkan kebersamaan dan kesatuan dalam perjuangan. Setiap elemen saling melengkapi demi tujuan yang sama.'}
                        {shard.id === 'book' && 'Al-Qur\'an, Hadist, dan pena. Fondasi ilmu yang menjadi dasar setiap langkah dan keputusan.'}
                        {shard.id === 'shield' && 'Integritas dan prinsip yang kokoh. Menjaga identitas Gontori dalam setiap tantangan zaman.'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

            </div>
          </div>
        </section>

        {/* Maskot */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 font-[Zhoro] !text-amber-300 text-center">
            Maskot Angkatan
          </h2>
          <div className="liquid-card p-6 md:p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="w-full max-w-xs md:max-w-sm rounded-2xl overflow-hidden bg-amber-900/20">
                  <img 
                    src="https://imperviousgeneration.my.id/_next/image?url=%2Fassets%2Fimages%2Fmaskot.webp&w=640&q=75"
                    alt="Maskot Zu'aym"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <h3 className="text-xl md:text-2xl font-bold mb-3 font-[Bricolage_Grotesque] text-amber-400 text-center md:text-left !text-amber-400 uppercase tracking-widest">
                  Zu'aym
                </h3>
                <p className="text-amber-100/80 font-[Merriweather] leading-relaxed mb-6 text-sm md:text-base text-center md:text-left">
                  Berakar dari za'āmah (kepemimpinan), mencerminkan sosok yang siap memikul amanah dan menentukan arah perjuangan—dekat dengan yang dipimpinnya, teguh dalam prinsip, berintegritas, serta konsisten membuktikan seruan melalui tindakan nyata, sehingga kepemimpinannya hidup dalam amal dan berdampak bagi peradaban umat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ketua Angkatan */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 font-[Bricolage_Grotesque] text-amber-300 text-center">
            Ketua Angkatan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="liquid-card p-6 text-center">
              <div className="w-64 rounded-2xl mx-auto mb-4 flex items-center justify-center overflow-hidden">
                {/* Placeholder image from placehold.co */}
                <img 
                  src="https://imperviousgeneration.my.id/_next/image?url=%2Fassets%2Fimages%2Fketua%2Ffachrillah.webp&w=3840&q=75"
                  alt="Muhammad Fachrillah"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 font-[Bricolage_Grotesque] text-amber-300">
                Muhammad Fachrillah
              </h3>
              <p className="text-amber-400 font-[Merriweather] mb-2">Ketua 1</p>
              <p className="text-amber-100/60 text-sm font-[Merriweather]">Our Prime Catalyst</p>
            </div>

            <div className="liquid-card p-6 text-center">
              <div className="w-64 rounded-2xl mx-auto mb-4 flex items-center justify-center overflow-hidden">
                {/* Placeholder image from placehold.co */}
                <img 
                  src="https://imperviousgeneration.my.id/_next/image?url=%2Fassets%2Fimages%2Fketua%2Fyusuf.webp&w=3840&q=75"
                  alt="Yusuf Praba Andhika Prayoga"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 font-[Bricolage_Grotesque] text-amber-300">
                Yusuf Praba Andhika Prayoga
              </h3>
              <p className="text-amber-400 font-[Merriweather] mb-2">Ketua 2</p>
              <p className="text-amber-100/60 text-sm font-[Merriweather]">Vice Catalyst</p>
            </div>

            <div className="liquid-card p-6 text-center">
               <div className="w-64 rounded-2xl mx-auto mb-4 flex items-center justify-center overflow-hidden">
                {/* Placeholder image from placehold.co */}
                <img 
                  src="https://imperviousgeneration.my.id/_next/image?url=%2Fassets%2Fimages%2Fketua%2Ffawwaz.webp&w=3840&q=75"
                  alt="Fawwaz Muhammad Royyan"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2 font-[Bricolage_Grotesque] text-amber-300">
                Fawwaz Muhammad Royyan
              </h3>
              <p className="text-amber-400 font-[Merriweather] mb-2">Ketua 3</p>
              <p className="text-amber-100/60 text-sm font-[Merriweather]">Support Catalyst</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="liquid-card p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-[Bricolage_Grotesque] text-amber-300">
              Bergabunglah dengan Perjalanan Kami
            </h2>
            <p className="text-lg text-amber-100/80 mb-8 font-[Merriweather]">
              Jelajahi artikel dan cerita dari Impervious Generation
            </p>
            <Link
              to="/jelajahi"
              className="liquid-btn btn-lg"
            >
              Jelajahi Artikel
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
