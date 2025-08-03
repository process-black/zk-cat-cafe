"use client";
import React from "react";

interface DisclaimerScreenProps {
  onAccept: () => void;
}

export default function DisclaimerScreen({ onAccept }: DisclaimerScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-[#FFF8E7] min-h-screen w-full">
      <div className="bg-white/90 rounded-xl shadow-lg p-8 max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 font-delius-unicase text-[#7B5537]">Disclaimer</h2>
        <p className="mb-6 text-[#7B5537] text-center font-sour-gummy">
          Many of the foods consumed by cats in this game are not safe for real cats to consume in real life. I wanted to make a game with cute cats and cute food, but much of said food is not edible to real cats. Please do not feed your cats food that you are not sure is safe for them to consume.
        </p>
        <button
          className="px-6 py-3 rounded-lg text-xl font-semibold bg-[#B3E5FC] text-[#226085] hover:bg-[#81D4FA] transition-colors shadow font-sour-gummy"
          onClick={onAccept}
        >
          OK
        </button>
      </div>
    </div>
  );
}
