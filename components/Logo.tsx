import React from "react";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Logo: React.FC<LogoProps> = ({ className = "", iconOnly = false, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const iconSize = sizeClasses[size];
  const textSize = textSizes[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Soft circular badge containing the flower bud icon */}
      <div className={`relative flex items-center justify-center rounded-full bg-bloom-green/10 dark:bg-bloom-green/20 ${iconSize}`}>
        <svg
          viewBox="0 0 100 100"
          className="w-2/3 h-2/3"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Petal (bloom-green) */}
          <rect
            x="20"
            y="35"
            width="35"
            height="35"
            rx="10"
            transform="rotate(-25 37.5 52.5)"
            fill="#22C55E"
            opacity="0.9"
          />
          {/* Right Petal (blossom-pink) */}
          <rect
            x="45"
            y="35"
            width="35"
            height="35"
            rx="10"
            transform="rotate(25 62.5 52.5)"
            fill="#F472B6"
            opacity="0.9"
          />
          {/* Center Petal (bloom-green) */}
          <rect
            x="32.5"
            y="25"
            width="35"
            height="35"
            rx="10"
            transform="rotate(0 50 42.5)"
            fill="#22C55E"
            opacity="0.95"
          />
          {/* Small center bud point (blossom-pink) */}
          <circle cx="50" cy="48" r="8" fill="#F472B6" />
        </svg>
      </div>
      
      {!iconOnly && (
        <span className={`font-heading font-bold tracking-tight text-text-primary dark:text-white ${textSize}`}>
          Kan<span className="text-bloom-green">bloom</span>
        </span>
      )}
    </div>
  );
};
export default Logo;
