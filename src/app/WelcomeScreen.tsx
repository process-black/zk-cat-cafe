"use client";
import React, { useEffect, useState } from "react";

interface WelcomeScreenProps {
  onNewGame: () => void;
  onContinue: () => void;
  canContinue: boolean;
}

export default function WelcomeScreen({ onNewGame, onContinue, canContinue }: WelcomeScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-[#FFF8E7] min-h-screen w-full">
      <h1 className="text-5xl font-bold mb-12 text-[#7B5537] drop-shadow-sm tracking-wide font-delius-unicase">Cat Cafe</h1>
      <img
        src="/images/loadingreal.gif"
        alt="Loading..."
        className="mx-auto mb-8"
        width={96}
        height={96}
        draggable={false}
      />
      <div className="flex flex-col gap-6 w-64">
        <button
          className="py-3 rounded-lg text-xl font-semibold bg-[#B3E5FC] text-[#226085] hover:bg-[#81D4FA] transition-colors shadow font-sour-gummy"
          onClick={onNewGame}
        >
          New Game
        </button>
        <button
          className={`py-3 rounded-lg text-xl font-semibold font-sour-gummy ${canContinue ? "bg-[#fba8c5] text-[#A24B6B] hover:bg-[#F48FB1]" : "bg-gray-300 text-gray-400 cursor-not-allowed"} transition-colors shadow`}
          onClick={canContinue ? onContinue : undefined}
          disabled={!canContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
