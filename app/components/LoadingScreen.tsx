import { useEffect, useState } from "react";

interface LoadingScreenProps {
  minDuration?: number;
}

export default function LoadingScreen({ minDuration = 800 }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, minDuration);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, minDuration + 500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [minDuration]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#0E0B08] transition-opacity duration-500 ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex flex-col items-center gap-4">
        <img 
          src="/horizontal.webp" 
          alt="Impervious Generation" 
          className="h-10 w-auto"
          loading="eager"
        />
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
