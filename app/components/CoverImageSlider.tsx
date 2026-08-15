import { useState, useRef } from "react";
import LazyImage from "./LazyImage";
import type { CoverImageItem } from "../utils/github-posts";

interface CoverImageSliderProps {
  images: (string | CoverImageItem)[];
  title: string;
}

export default function CoverImageSlider({ images, title }: CoverImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const imageItems: CoverImageItem[] = (images || []).map((img) =>
    typeof img === "string" ? { url: img } : img
  );

  if (!imageItems || imageItems.length === 0) return null;

  const currentItem = imageItems[currentIndex] || imageItems[0];

  if (imageItems.length === 1) {
    return (
      <div className="mb-8 glass-card rounded-xl overflow-hidden">
        <LazyImage src={currentItem.url} alt={title} className="w-full h-auto max-h-[550px] object-cover" />
        {currentItem.caption && (
          <div className="glass px-5 py-3 text-amber-200 text-sm font-[Bricolage_Grotesque] flex items-center gap-3">
            <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2 2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="leading-snug">{currentItem.caption}</span>
          </div>
        )}
      </div>
    );
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageItems.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === imageItems.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isSwipeLeft = distance > 40;
    const isSwipeRight = distance < -40;

    if (isSwipeLeft) {
      nextSlide();
    } else if (isSwipeRight) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="mb-8 relative group">
      <div
        className={`glass-card overflow-hidden relative aspect-[16/9] md:aspect-[21/9] ${
          currentItem.caption ? "rounded-t-xl" : "rounded-xl"
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {imageItems.map((img, idx) => (
            <div key={idx} className="w-full h-full flex-shrink-0 relative">
              <LazyImage
                src={img.url}
                alt={`${title} - Gambar ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="absolute top-4 right-4 glass text-amber-400 text-xs px-3 py-1.5 rounded-full font-mono z-10">
          {currentIndex + 1} / {imageItems.length}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 glass-button w-10 h-10 rounded-full text-amber-400 flex items-center justify-center hover:text-slate-950 transition z-10 opacity-80 hover:opacity-100"
          aria-label="Gambar Sebelumnya"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 glass-button w-10 h-10 rounded-full text-amber-400 flex items-center justify-center hover:text-slate-950 transition z-10 opacity-80 hover:opacity-100"
          aria-label="Gambar Selanjutnya"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 glass px-3 py-1.5 rounded-full">
          {imageItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                currentIndex === idx ? "w-6 bg-amber-400" : "w-2 bg-amber-100/50 hover:bg-amber-100/80"
              }`}
              aria-label={`Ke gambar ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {currentItem.caption && (
        <div className="glass border-x border-b border-amber-500/30 px-5 py-3 rounded-b-xl text-amber-200 text-sm font-[Bricolage_Grotesque] flex items-center gap-3">
          <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2 2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="leading-snug">{currentItem.caption}</span>
        </div>
      )}

      <div className="flex gap-3 mt-3 overflow-x-auto pb-2 scrollbar-thin">
        {imageItems.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative rounded-lg overflow-hidden h-16 w-24 flex-shrink-0 border-2 transition ${
              currentIndex === idx
                ? "border-amber-400 ring-2 ring-amber-400/50 opacity-100 scale-105"
                : "border-slate-800 opacity-60 hover:opacity-100"
            }`}
          >
            <LazyImage src={img.url} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}