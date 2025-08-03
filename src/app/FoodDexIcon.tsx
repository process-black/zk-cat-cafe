"use client";
import React from "react";

export default function FoodDexIcon({ size = 24 }: { size?: number }) {
  // A small square button with a fork and spoon (food) icon, visually distinct from MarketIcon
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="3" fill="#B3E5FC" />
      <circle cx="7" cy="8.5" r="0.8" fill="#81D4FA" />
      <rect x="9" y="8" width="8" height="1.1" rx="0.5" fill="#2994C5" />
      <circle cx="7" cy="12" r="0.8" fill="#81D4FA" />
      <rect x="9" y="11.5" width="8" height="1.1" rx="0.5" fill="#2994C5" />
      <circle cx="7" cy="15.5" r="0.8" fill="#81D4FA" />
      <rect x="9" y="15" width="8" height="1.1" rx="0.5" fill="#2994C5" />
    </svg>
  );
}
