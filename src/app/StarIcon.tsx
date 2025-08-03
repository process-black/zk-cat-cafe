"use client";
import React from "react";

export default function StarIcon({ filled = true, size = 32 }: { filled?: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill={filled ? "#FFD600" : "none"}
      stroke="#FFD600"
      strokeWidth={2}
      strokeLinejoin="round"
      style={{ borderRadius: 6 }}
    >
      <polygon points="16,3 20,13 31,13 22,20 25,31 16,24 7,31 10,20 1,13 12,13" />
    </svg>
  );
}
