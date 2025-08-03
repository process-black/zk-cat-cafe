"use client";
import React from "react";

export default function MarketIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="8" width="18" height="10" rx="2" fill="#B3E5FC" stroke="#226085" strokeWidth="1.5" />
      <rect x="6" y="4" width="12" height="4" rx="1.5" fill="#B3E5FC" stroke="#226085" strokeWidth="1.5" />
      <path d="M8 12h8" stroke="#226085" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 16h8" stroke="#226085" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
