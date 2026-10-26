import { useState, useRef, useCallback, useMemo } from "react";
import LazyImage from "./LazyImage";
import type { CoverImageItem } from "../utils/sanity.server";

interface CoverImageSliderProps {
  images: (string | CoverImageItem)[];
  title: string;
}

export default function CoverImageSlider({ images, title }: CoverImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchMovedRef = useRef(false);

  const imageItems: CoverImageItem[] = useMemo(
    () =>
      (images || []).map((img) =>
        typeof img === "string" ? { url: img } : img
      ),
    [images]
  );

  const currentItem = imageItems[currentIndex] || imageItems[0];
  const translateXPercent = -currentIndex * 100;

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? imageItems.length - 1 : prev - 1));
  }, [imageItems.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === imageItems.length - 1 ? 0 : prev + 1));
  }, [imageItems.length]);

  if (!imageItems || imageItems.length === 0) return null;

  if (imageItems.length === 1) {
    return (
      <figure className="mb-8">
        <div className="overflow-hidden rounded-lg border border-[#272118] bg-[#120F0C]">
          <LazyImage
            src={currentItem.url}
            alt={currentItem.alt || title}
            className="w-full h-auto max-h-[560px] object-cover"
          />
        </div>
        {currentItem.caption && (
          <figcaption className="mt-2.5 px-1 text-center text-xs md:text-sm text-[#A89C86] font-[Bricolage_Grotesque] italic">
            {currentItem.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchMovedRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = Math.abs((e.touches[0].clientX || 0) - (touchStartX.current || 0));
    const dy = Math.abs((e.touches[0].clientY || 0) - (touchStartY.current || 0));
    if (dx > dy && dx > 8) {
      touchMovedRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchMovedRef.current || touchStartX.current === null) return;

    const clientX = e.changedTouches[0].clientX;
    const distance = touchStartX.current - clientX;
    const isSwipeLeft = distance > 40;
    const isSwipeRight = distance < -40;

    if (isSwipeLeft) {
      nextSlide();
    } else if (isSwipeRight) {
      prevSlide();
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchMovedRef.current = false;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  return (
    <figure
      className="mb-8 relative group"
      tabIndex={0}
      role="region"
      aria-label="Galeri gambar artikel"
      onKeyDown={handleKeyDown}
    >
      <div
        className="overflow-hidden relative rounded-lg border border-[#272118] bg-[#120F0C] aspect-[16/9] md:aspect-[21/9]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `translateX(${translateXPercent}%)` }}
        >
          {imageItems.map((img, idx) => (
            <div key={idx} className="w-full h-full flex-shrink-0 relative">
              <LazyImage
                src={img.url}
                alt={img.alt || `${title} - Gambar ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Counter badge */}
        <div className="absolute top-3 right-3 bg-black/75 text-amber-300 text-[11px] font-mono px-2 py-0.5 rounded border border-white/10 z-10">
          {currentIndex + 1} / {imageItems.length}
        </div>

        {/* Prev & Next Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 text-amber-300 flex items-center justify-center transition border border-white/10 z-10"
          aria-label="Gambar Sebelumnya"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 text-amber-300 flex items-center justify-center transition border border-white/10 z-10"
          aria-label="Gambar Selanjutnya"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicator dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/60 px-2.5 py-1 rounded-full border border-white/10">
          {imageItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                currentIndex === idx ? "w-4 bg-amber-400" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Ke gambar ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Caption if provided */}
      {currentItem.caption && (
        <figcaption className="mt-2.5 px-1 text-center text-xs md:text-sm text-[#A89C86] font-[Bricolage_Grotesque] italic">
          {currentItem.caption}
        </figcaption>
      )}

      {/* Sleek thumbnails row */}
      <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1 scrollbar-thin">
        {imageItems.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative rounded overflow-hidden h-12 w-20 flex-shrink-0 border transition ${
              currentIndex === idx
                ? "border-amber-400 opacity-100 ring-1 ring-amber-400/50"
                : "border-[#272118] opacity-50 hover:opacity-90"
            }`}
          >
            <LazyImage src={img.url} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </figure>
  );
}
