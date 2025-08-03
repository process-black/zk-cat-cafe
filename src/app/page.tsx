"use client";
import Image from "next/image";

import WelcomeScreen from "./WelcomeScreen";
import DisclaimerScreen from "./DisclaimerScreen";
import NewGameScreen, { GameState } from "./NewGameScreen";
import { useState, useEffect } from "react";

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showNewGame, setShowNewGame] = useState(false);
  const [canContinue, setCanContinue] = useState(false);
  const [gameState, setGameState] = useState<GameState | undefined>(undefined);
const [initialInventory, setInitialInventory] = useState<{ [ingredient: string]: number }>({});
const [initialMoney, setInitialMoney] = useState<number>(50);

  // Check for saved progress on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cat-cafe-save");
      setCanContinue(!!saved);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setGameState(parsed);
          // Restore inventory and money if present
          if (parsed.inventory) {
            localStorage.setItem("cat-cafe-inventory", JSON.stringify(parsed.inventory));
          }
          if (parsed.money !== undefined) {
            localStorage.setItem("cat-cafe-money", String(parsed.money));
          }
        } catch {
          setGameState(undefined);
        }
      }
    }
  }, []);

  // Save progress to localStorage whenever gameState changes
  const handleSaveProgress = (state: GameState & { inventory?: any; money?: any }) => {
    setGameState(state);
    // Also save inventory and money if present
    if (state.inventory) {
      localStorage.setItem("cat-cafe-inventory", JSON.stringify(state.inventory));
    }
    if (state.money !== undefined) {
      localStorage.setItem("cat-cafe-money", String(state.money));
    }

    localStorage.setItem("cat-cafe-save", JSON.stringify(state));
    setCanContinue(true);
  };

  // Start a new game: reset progress
  const handleNewGame = () => {
    localStorage.removeItem("cat-cafe-save");
    localStorage.removeItem("cat-cafe-inventory");
    localStorage.removeItem("cat-cafe-money");
    localStorage.removeItem("cat-cafe-food-stats");
    setGameState({ progress: 0 }); // or your default state
    setShowWelcome(false);
    setShowDisclaimer(true);
    setShowNewGame(false);
    setCanContinue(false);
  };

  const handleAcceptDisclaimer = () => {
    setShowDisclaimer(false);
    setShowNewGame(true);
  };

  // Continue: load saved progress
  const handleContinue = () => {
    // Load inventory and money from localStorage and set as initial values for NewGameScreen
    const storedInv = localStorage.getItem("cat-cafe-inventory");
    const storedMoney = localStorage.getItem("cat-cafe-money");
    setInitialInventory(storedInv ? JSON.parse(storedInv) : {});
    setInitialMoney(storedMoney ? Number(storedMoney) : 50);
    setShowWelcome(false);
    setShowNewGame(true);
  };

  return (
    <>
      {showWelcome && (
        <WelcomeScreen
          onNewGame={handleNewGame}
          onContinue={handleContinue}
          canContinue={canContinue}
        />
      )}
      {showDisclaimer && (
        <DisclaimerScreen onAccept={handleAcceptDisclaimer} />
      )}
      {showNewGame && (
        <NewGameScreen
          initialState={gameState}
          initialInventory={initialInventory}
          initialMoney={initialMoney}
          onSaveProgress={handleSaveProgress}
        />
      )}
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            hi please edit{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            look i can edit this too
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
      </div>
    </>
  );
}
