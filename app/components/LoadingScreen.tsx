import { useEffect, useState } from "react";

interface LoadingScreenProps {
  minDuration?: number;
}

export default function LoadingScreen({ minDuration = 1500 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    const timeout = setTimeout(() => {
      setProgress(100);
      clearInterval(interval);
    }, minDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [minDuration]);

  useEffect(() => {
    if (progress === 100 && !isFadingOut) {
      setIsFadingOut(true);
      const fadeOut = setTimeout(() => {
        setIsVisible(false);
      }, 500);

      return () => clearTimeout(fadeOut);
    }
  }, [progress, isFadingOut]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#0E0B08] transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative w-full max-w-md px-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src="/horizontal.webp" 
            alt="Impervious Generation" 
            className="h-12 w-auto animate-pulse"
          />
        </div>

        {/* Loading Bar */}
        <div className="w-full h-1 bg-amber-900/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading Text */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-amber-400/60 text-sm font-[Merriweather]">Loading...</p>
          <p className="text-amber-400/60 text-sm font-[Merriweather]">{Math.round(progress)}%</p>
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
