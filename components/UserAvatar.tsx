"use client";

import React, { useState, useEffect } from "react";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  uid?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function UserAvatar({ src, name, uid, size = "md", className = "" }: UserAvatarProps) {
  const [error, setError] = useState(false);

  // Reset error state if the source URL changes
  useEffect(() => {
    setError(false);
  }, [src]);

  const initials = (() => {
    if (!name) return "G";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return "G";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  })();

  // Premium, deterministic gardener-themed color palette
  const colors = [
    "bg-bloom-green/15 text-bloom-green border-bloom-green/35 dark:bg-bloom-green/20 dark:text-bloom-green dark:border-bloom-green/30",
    "bg-blossom-pink/15 text-blossom-pink border-blossom-pink/35 dark:bg-blossom-pink/20 dark:text-blossom-pink dark:border-blossom-pink/30",
    "bg-indigo-500/15 text-indigo-600 border-indigo-500/35 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30",
    "bg-amber-500/15 text-amber-600 border-amber-500/35 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30",
    "bg-teal-500/15 text-teal-600 border-teal-500/35 dark:bg-teal-500/20 dark:text-teal-400 dark:border-teal-500/30",
  ];

  const hashString = uid || name || "gardener";
  const hash = hashString.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorClass = colors[hash % colors.length];

  const sizeClasses = {
    sm: "w-8 h-8 text-xs font-semibold border",
    md: "w-9 h-9 text-sm font-semibold border-2",
    lg: "w-12 h-12 text-base font-bold border-2",
  };

  // Check if src is valid and not a placeholder string
  const hasValidSrc = src && src.trim() !== "" && src !== "undefined" && src !== "null";

  if (hasValidSrc && !error) {
    return (
      <img
        src={src}
        alt={name || "User"}
        onError={() => setError(true)}
        className={`${sizeClasses[size]} rounded-full object-cover bg-neutral-100 dark:bg-neutral-800 border-bloom-green/20 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-heading select-none shrink-0 ${colorClass} ${className}`}
      title={name || "User"}
    >
      {initials}
    </div>
  );
}
