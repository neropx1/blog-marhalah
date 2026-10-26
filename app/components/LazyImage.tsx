import { useState, useRef, useEffect } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

export default function LazyImage({ src, alt, className = "", placeholder = "" }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const inViewRef = useRef(false);
  const hasObservedRef = useRef(false);

  useEffect(() => {
    const imgElement = imgRef.current;
    if (!imgElement || hasObservedRef.current) return;

    inViewRef.current = false;
    hasObservedRef.current = true;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            inViewRef.current = true;
            setIsInView(true);
            if (observerRef.current) {
              observerRef.current.disconnect();
              observerRef.current = null;
            }
            break;
          }
        }
      },
      { rootMargin: "400px 0px", threshold: 0 }
    );

    observerRef.current.observe(imgElement);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      hasObservedRef.current = false;
    };
  }, []);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {!isLoaded && placeholder && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse" />
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
          decoding="async"
          fetchPriority={isLoaded ? "low" : "auto"}
        />
      )}
    </div>
  );
}