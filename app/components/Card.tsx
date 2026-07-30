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
  const baseClass = featured ? "card-featured" : "card";
  const hoverClass = hoverable ? "hover-lift hover-glow" : "";
  
  return (
    <div
      className={`${baseClass} ${hoverClass} p-6 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
