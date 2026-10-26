import React from "react";

interface CardProps {
  children: React.ReactNode;
  featured?: boolean;
  hoverable?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Card({
  children,
  featured = false,
  hoverable = true,
  className = "",
  onClick
}: CardProps) {
  const baseClass = featured
    ? "border border-amber-500/30 bg-[#16120D] rounded-lg"
    : "border border-[#272118] bg-[#120F0C] rounded-lg";
  const hoverClass = hoverable ? "hover:border-amber-500/35 transition" : "";

  return (
    <div
      className={`${baseClass} ${hoverClass} p-5 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
