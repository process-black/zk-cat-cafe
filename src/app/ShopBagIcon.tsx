"use client";
import React from "react";

export default function ShopBagIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="7" y="10" width="18" height="14" rx="4" fill="#B3E5FC" stroke="#226085" strokeWidth="1.5" />
      <path d="M11 14v-3a5 5 0 0 1 10 0v3" stroke="#226085" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="13" cy="17" r="1.5" fill="#226085"/>
      <circle cx="19" cy="17" r="1.5" fill="#226085"/>
    </svg>
  );
}
