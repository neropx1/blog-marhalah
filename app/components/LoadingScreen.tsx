import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActive(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center bg-[#0C0A08]/75 backdrop-blur-xs transition-opacity duration-200"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-3">
        <img
          src="/horizontal.webp"
          alt="Impervious Generation"
          className="h-8 w-auto"
        />
        <div className="flex gap-1.5" aria-hidden="true">
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
