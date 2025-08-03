"use client";
import React, { useState } from "react";
import Image from "next/image";
import { foodData } from "./foodData";

export interface FoodDexEntry {
  name: string;
  image: string;
  mostOrderedBy: string;
  ingredients: string[];
  timesMade: number;
  stars: number;
}

interface FoodDexOverlayProps {
  foods: FoodDexEntry[];
  onClose: () => void;
}

export default function FoodDexOverlay({ foods, onClose }: FoodDexOverlayProps) {
  const [current, setCurrent] = useState(0);
  if (!foods.length) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="rounded-2xl bg-white/95 shadow-lg px-8 py-7 flex flex-col items-center min-w-[360px] min-h-[240px] max-w-[94vw] border border-[#f2e6d9] relative">
          <button className="absolute top-4 right-4 text-xl font-bold text-[#B26A00]" onClick={onClose} aria-label="Close">×</button>
          <div className="text-lg font-sour-gummy text-[#B26A00]">No foods made yet!</div>
        </div>
      </div>
    );
  }
  const food = foods[current];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="rounded-2xl bg-white/95 shadow-lg px-12 pt-10 pb-10 flex flex-col min-w-[360px] max-w-[94vw] border border-[#f2e6d9] relative">
  <div className="flex flex-row items-center gap-8 w-full">

        {/* X button */}
        <button className="absolute top-4 right-4 text-xl font-bold text-[#B26A00] hover:bg-[#FFE0B2] rounded-full w-10 h-10 flex items-center justify-center" onClick={onClose} aria-label="Close">×</button>
        {/* Arrows */}
        <button className="absolute -left-8 top-1/2 -translate-y-1/2 -translate-x-8 text-3xl bg-[#A3E6FF] text-[#2994C5] shadow-md hover:bg-[#7BD3EA] rounded-full w-12 h-12 flex items-center justify-center disabled:opacity-30 transition-colors duration-150" onClick={() => setCurrent(c => Math.max(0, c-1))} disabled={current === 0} aria-label="Previous Food">‹</button>
        <button className="absolute -right-8 top-1/2 -translate-y-1/2 translate-x-8 text-3xl bg-[#A3E6FF] text-[#2994C5] shadow-md hover:bg-[#7BD3EA] rounded-full w-12 h-12 flex items-center justify-center disabled:opacity-30 transition-colors duration-150" onClick={() => setCurrent(c => Math.min(foods.length-1, c+1))} disabled={current === foods.length-1} aria-label="Next Food">›</button>
        {/* Food image */}
        <div className="flex-shrink-0">
          <Image src={food.image} alt={food.name} width={140} height={140} className="rounded-lg" />
        </div>
        <div className="flex flex-col justify-center items-start w-full">
          {/* Food name */}
          <div className="font-delius-unicase text-2xl text-[#B26A00] mb-1">{food.name}</div>
          {/* Most ordered by */}
          <div className="mb-1 text-[#7B5537] text-base font-sour-gummy">Top customer: <span className="font-bold">{food.mostOrderedBy}</span></div>
          <div className="mb-1 text-[#7B5537] text-base font-sour-gummy">Ingredients: <span className="font-bold">{food.ingredients.join(", ")}</span></div>
          <div className="flex gap-6 mt-2">
            <div className="text-[#7B5537] text-base font-sour-gummy">Made: <span className="font-bold">{food.timesMade}</span></div>
            <div className="text-[#7B5537] text-base font-sour-gummy">Stars: <span className="font-bold">{food.stars}</span></div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
