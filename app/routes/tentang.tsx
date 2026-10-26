import { Link } from "@remix-run/react";
import Footer from "../components/Footer";
import LazyImage from "../components/LazyImage";
import { useState } from "react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [
  { title: "Tentang — Impervious Generation" },
  { name: "description", content: "Profil, visi, filosofi lambang, dan identitas resmi Impervious Generation." },
];

export default function Tentang() {
  const [activeShard, setActiveShard] = useState<string | null>(null);

  const shards = [
    {
      id: "crown",
      title: "Mahkota",
      badge: "Keagungan",
      image: "https://imperviousgeneration.my.id/assets/images/part_logo/lafadz_allah.webp",
      desc: "Simbol keagungan dan kemuliaan dalam perjuangan. Menggambarkan visi tinggi untuk mencapai kejayaan umat.",
    },
    {
      id: "circle",
      title: "Satuan Lingkaran",
      badge: "Persatuan",
      image: "https://imperviousgeneration.my.id/assets/images/part_logo/mahkota.webp",
      desc: "Melambangkan kebersamaan dan kesatuan dalam perjuangan. Setiap elemen saling melengkapi demi tujuan yang sama.",
    },
    {
      id: "book",
      title: "Ilmu Pengetahuan",
      badge: "Intelektual",
      image: "https://imperviousgeneration.my.id/assets/images/part_logo/lempengan.webp",
      desc: "Al-Qur'an, Hadist, dan pena. Fondasi ilmu pengetahuan yang menjadi dasar setiap langkah dan keputusan.",
    },
    {
      id: "shield",
      title: "Perlindungan & Integritas",
      badge: "Prinsip",
      image: "https://imperviousgeneration.my.id/assets/images/part_logo/muhammad.webp",
      desc: "Integritas dan prinsip yang kokoh. Menjaga identitas dan nilai luhur Gontori dalam menghadapi dinamika zaman.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0C0A08] text-[#FAF4E8] pb-16 md:pb-0">
      {/* Editorial Header */}
      <section className="border-b border-[#221C14] bg-[#0E0C09] py-12 md:py-16 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="w-28 md:w-36 mx-auto mb-6">
            <LazyImage
              src="/lambang.webp"
              alt="Lambang Impervious Generation"
              className="w-full h-auto"
            />
          </div>
          <span className="text-xs uppercase font-bold tracking-widest text-amber-400 font-[Bricolage_Grotesque]">
            Profil & Landasan Angkatan
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-[Zhoro] text-[#FAF4E8] mt-2 mb-3">
            Impervious Generation
          </h1>
          <p className="text-lg md:text-xl font-[Zhoro] text-amber-400 mb-2">
            Golden Age Catalyst
          </p>
          <p className="text-xs md:text-sm text-[#8F816B] font-[Bricolage_Grotesque] tracking-widest uppercase">
            Unshaken · Unbroken
          </p>
        </div>
      </section>

      {/* Landasan Angkatan & Landasan Ayat */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Landasan Angkatan */}
        <div className="border border-[#272118] bg-[#120F0C] rounded-lg p-6 md:p-8">
          <span className="text-[11px] uppercase font-bold tracking-widest text-amber-400 font-[Bricolage_Grotesque] block mb-2">
            Landasan Filosofis
          </span>
          <h2 className="text-xl md:text-2xl font-bold font-[Zhoro] text-[#FAF4E8] mb-4">
            Landasan Angkatan
          </h2>
          <p className="text-sm md:text-base leading-relaxed font-[Merriweather] text-[#D8CEBA]">
            Generasi tonggak 100 Tahun Kedua Gontor yang tangguh dalam mengupayakan perbaikan umat dan menegakkan kebenaran, teguh dalam mempertahankan prinsip Islam, identitas, dan nilai Gontori, kokoh dalam integritas, selaras antara seruan dan perbuatan, serta dinamis meningkatkan kualitas umat demi mewujudkan pusat peradaban dunia.
          </p>
        </div>

        {/* Landasan Ayat */}
        <div className="border border-[#272118] bg-[#120F0C] rounded-lg p-6 md:p-8">
          <span className="text-[11px] uppercase font-bold tracking-widest text-amber-400 font-[Bricolage_Grotesque] block mb-2">
            Landasan Wahyu
          </span>
          <h2 className="text-xl md:text-2xl font-bold font-[Zhoro] text-[#FAF4E8] mb-4">
            QS. Huud: 88
          </h2>
          <div className="rounded overflow-hidden my-4 bg-[#16120D] border border-[#272118]">
            <LazyImage
              src="/ayat.webp"
              alt="Landasan Ayat QS Huud 88"
              className="w-full h-auto p-4 md:p-6"
            />
          </div>
          <blockquote className="border-l-2 border-amber-400 pl-4 my-4 italic text-sm md:text-base font-[Merriweather] text-[#F7E4A9]">
            "...Dan aku tidak berkehendak menyalahi kamu (dengan mengerjakan) apa yang aku larang. Aku tidak bermaksud kecuali (mendatangkan) perbaikan selama aku masih berkesanggupan. Dan tidak ada taufik bagiku melainkan dengan (pertolongan) Allah. Hanya kepada Allah aku bertawakkal dan hanya kepada-Nya-lah aku kembali.” (QS Huud: 88)
          </blockquote>
        </div>
      </section>

      {/* Identitas Visual & Filosofi Lambang */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-[#221C14] pb-3 mb-8 text-center">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-400 font-[Bricolage_Grotesque]">
            Simbolisme
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-[Zhoro] text-[#FAF4E8] mt-1">
            Identitas Visual
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shards.map((shard) => {
            const isSelected = activeShard === shard.id;
            return (
              <div
                key={shard.id}
                onClick={() => setActiveShard(isSelected ? null : shard.id)}
                className={`border rounded-lg p-5 cursor-pointer transition ${
                  isSelected
                    ? "border-amber-400 bg-[#16130F]"
                    : "border-[#272118] bg-[#120F0C] hover:border-amber-500/30"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded bg-[#16120D] border border-[#272118] p-2 flex-shrink-0 flex items-center justify-center">
                    <LazyImage
                      src={shard.image}
                      alt={shard.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm md:text-base font-bold font-[Bricolage_Grotesque] text-[#FAF4E8]">
                        {shard.title}
                      </h3>
                      <span className="editorial-tag text-[9px] py-0 px-1.5">
                        {shard.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#8F816B] font-[Merriweather] leading-relaxed">
                      {shard.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Maskot Angkatan */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="border border-[#272118] bg-[#120F0C] rounded-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-40 md:w-52 flex-shrink-0">
              <div className="rounded bg-[#16120D] border border-[#272118] p-4">
                <LazyImage
                  src="https://imperviousgeneration.my.id/_next/image?url=%2Fassets%2Fimages%2Fmaskot.webp&w=640&q=75"
                  alt="Maskot Zu'aym"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 font-[Bricolage_Grotesque]">
                Maskot Resmi
              </span>
              <h3 className="text-2xl font-bold font-[Bricolage_Grotesque] text-[#FAF4E8] mt-0.5 mb-2">
                Zu'aym
              </h3>
              <p className="text-xs md:text-sm text-[#A89C86] font-[Merriweather] leading-relaxed">
                Berakar dari kata <em>za'āmah</em> (kepemimpinan), mencerminkan sosok yang siap memikul amanah dan menentukan arah perjuangan—dekat dengan yang dipimpinnya, teguh dalam prinsip, berintegritas, serta konsisten membuktikan seruan melalui tindakan nyata.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dewan Pimpinan / Ketua Angkatan */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="border-b border-[#221C14] pb-3 mb-6 text-center">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-400 font-[Bricolage_Grotesque]">
            Kepengurusan
          </span>
          <h2 className="text-xl md:text-2xl font-bold font-[Bricolage_Grotesque] text-[#FAF4E8] mt-1">
            Ketua Angkatan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-[#272118] bg-[#120F0C] rounded-lg p-5 text-center">
            <div className="w-24 h-24 rounded-full mx-auto mb-3 overflow-hidden border border-amber-500/25 bg-[#16120D]">
              <LazyImage
                src="https://imperviousgeneration.my.id/_next/image?url=%2Fassets%2Fimages%2Fketua%2Ffachrillah.webp&w=3840&q=75"
                alt="Muhammad Fachrillah"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-sm font-bold font-[Bricolage_Grotesque] text-[#FAF4E8]">
              Muhammad Fachrillah
            </h4>
            <p className="text-xs text-amber-400 font-medium font-[Bricolage_Grotesque] mt-0.5">
              Ketua 1
            </p>
            <p className="text-[11px] text-[#7A6D5A] font-[Merriweather] mt-1">
              Prime Catalyst
            </p>
          </div>

          <div className="border border-[#272118] bg-[#120F0C] rounded-lg p-5 text-center">
            <div className="w-24 h-24 rounded-full mx-auto mb-3 overflow-hidden border border-amber-500/25 bg-[#16120D]">
              <LazyImage
                src="https://imperviousgeneration.my.id/_next/image?url=%2Fassets%2Fimages%2Fketua%2Fyusuf.webp&w=3840&q=75"
                alt="Yusuf Praba Andhika Prayoga"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-sm font-bold font-[Bricolage_Grotesque] text-[#FAF4E8]">
              Yusuf Praba Andhika Prayoga
            </h4>
            <p className="text-xs text-amber-400 font-medium font-[Bricolage_Grotesque] mt-0.5">
              Ketua 2
            </p>
            <p className="text-[11px] text-[#7A6D5A] font-[Merriweather] mt-1">
              Vice Catalyst
            </p>
          </div>

          <div className="border border-[#272118] bg-[#120F0C] rounded-lg p-5 text-center">
            <div className="w-24 h-24 rounded-full mx-auto mb-3 overflow-hidden border border-amber-500/25 bg-[#16120D]">
              <LazyImage
                src="https://imperviousgeneration.my.id/_next/image?url=%2Fassets%2Fimages%2Fketua%2Ffawwaz.webp&w=3840&q=75"
                alt="Fawwaz Muhammad Royyan"
                className="w-full h-full object-cover"
              />
            </div>
            <h4 className="text-sm font-bold font-[Bricolage_Grotesque] text-[#FAF4E8]">
              Fawwaz Muhammad Royyan
            </h4>
            <p className="text-xs text-amber-400 font-medium font-[Bricolage_Grotesque] mt-0.5">
              Ketua 3
            </p>
            <p className="text-[11px] text-[#7A6D5A] font-[Merriweather] mt-1">
              Support Catalyst
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="border border-[#272118] bg-[#120F0C] rounded-lg p-6 md:p-8 text-center">
          <h3 className="text-xl md:text-2xl font-bold font-[Texturina] text-[#FAF4E8] mb-2">
            Mulai Membaca Jurnal
          </h3>
          <p className="text-xs md:text-sm text-[#8F816B] font-[Merriweather] mb-5 max-w-md mx-auto">
            Jelajahi tulisan, analisis, dan dokumentasi warta Impervious Generation.
          </p>
          <Link to="/jelajahi" className="btn-primary btn-sm inline-flex font-[Bricolage_Grotesque]">
            Buka Katalog Artikel →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
