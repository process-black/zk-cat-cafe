"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { foodData, allIngredients } from "./foodData";
import StarIcon from "./StarIcon";
import ShopBagIcon from "./ShopBagIcon";
import FoodDexIcon from "./FoodDexIcon";
import FoodDexOverlay, { FoodDexEntry } from "./FoodDexOverlay";

export interface GameState {
  // Add fields as needed for your game, e.g. level, score, etc.
  progress: number;
}

interface NewGameScreenProps {
  initialState?: GameState;
  onSaveProgress?: (state: GameState) => void;
  initialInventory?: { [ingredient: string]: number };
  initialMoney?: number;
}

type CatType = "suki" | "miso" | "espy";

const CAT_NAMES: Record<CatType, string> = {
  suki: "Suki",
  miso: "Miso",
  espy: "Espy",
};

const FOOD_CATEGORIES = [
  { key: "meal", label: "meal", files: ["beef_udon.png"] },
  { key: "dessert", label: "dessert", files: ["triple_chocolate_cake.png"] },
  { key: "drinks", label: "drinks", files: ["strawberry_milk_boba.png"] },
];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// TEMP: Mock data for FoodDexOverlay (replace with real tracking)
const mockFoodDexEntries: FoodDexEntry[] = [
  {
    name: "Beef Udon",
    image: "/images/food/meal/beef_udon.png",
    mostOrderedBy: "Suki",
    ingredients: ["Beef", "Udon", "Broth"],
    timesMade: 3,
    stars: 8
  },
  {
    name: "Triple Chocolate Cake",
    image: "/images/food/dessert/triple_chocolate_cake.png",
    mostOrderedBy: "Miso",
    ingredients: ["Chocolate", "Flour", "Sugar"],
    timesMade: 2,
    stars: 5
  }
];

// --- Food stats tracking ---
interface FoodStats {
  [foodKey: string]: {
    timesMade: number;
    stars: number;
    catOrders: { [cat in CatType]?: number };
  };
}

// Helper: get display name from food key
function displayFoodName(foodKey: string) {
  return foodKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const FOOD_STATS_KEY = "cat-cafe-food-stats";

export default function NewGameScreen(props: NewGameScreenProps) {
  // Minigame overlay component
  function MinigameOverlay({ onFinish }: { onFinish: (clicks: number) => void }) {
    const [clicks, setClicks] = useState(0);
    const [circlePos, setCirclePos] = useState({ x: 60, y: 120 });
    const [startTime] = useState(Date.now());
    const [timeLeft, setTimeLeft] = useState(10);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [moving, setMoving] = useState(true);

    // Move the circle every 650ms
    useEffect(() => {
      if (!moving) return;
      intervalRef.current = setInterval(() => {
        setCirclePos({
          x: Math.random() * 200 + 40,
          y: Math.random() * 80 + 80
        });
      }, 650);
      return () => clearInterval(intervalRef.current!);
    }, [moving]);

    // Timer
    useEffect(() => {
      if (!moving) return;
      const t = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setTimeLeft(Math.max(0, 10 - elapsed));
        if (elapsed >= 10) {
          setMoving(false);
          setTimeout(() => onFinish(clicks), 600);
        }
      }, 50);
      return () => clearInterval(t);
    }, [moving, clicks, onFinish, startTime]);

    // End minigame if 5 clicks
    useEffect(() => {
      if (clicks >= 5 && moving) {
        setMoving(false);
        setTimeout(() => onFinish(clicks), 400);
      }
    }, [clicks, moving, onFinish]);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div
          ref={overlayRef}
          className="rounded-2xl bg-white/95 shadow-lg px-8 py-7 flex flex-col items-center min-w-[360px] min-h-[240px] max-w-[94vw] border border-[#f2e6d9] relative"
          style={{ width: 360, height: 240 }}
        >
          {/* Time bar top left */}
          <div className="absolute left-6 top-5 h-4 bg-[#e0e0e0] rounded-full w-32 overflow-hidden" style={{width: 120}}>
            <div
              className="h-4 bg-green-400 rounded-full transition-all duration-100"
              style={{ width: `${(timeLeft / 10) * 120}px` }}
            />
          </div>
          {/* Click counter top right */}
          <div className="absolute right-6 top-5 font-sour-gummy text-lg text-[#226085] select-none">
            {clicks} / 5
          </div>
          {/* Moving circle */}
          <button
            type="button"
            className="absolute"
            style={{
              left: circlePos.x,
              top: circlePos.y,
              width: 60,
              height: 60,
              background: "#B3E5FC",
              borderRadius: "50%",
              border: "none",
              boxShadow: "0 2px 8px #b3e5fc77",
              cursor: moving ? "pointer" : "default",
              opacity: moving ? 1 : 0.5,
              transition: "left 0.2s, top 0.2s, opacity 0.4s"
            }}
            disabled={!moving}
            aria-label="Click the moving circle"
            onClick={() => setClicks(c => Math.min(5, c + 1))}
          />
          {/* Instructions */}
          <div className="absolute left-0 right-0 bottom-5 text-center font-sour-gummy text-base text-[#7B5537] select-none">
            Click the blue circle 5 times before time runs out!
          </div>
        </div>
      </div>
    );
  }

  // --- Minigame overlay state ---
  const [showMinigame, setShowMinigame] = useState(false);
  // Result overlay state
  const [showResult, setShowResult] = useState<null | { clicks: number }>(null);

  // --- New states for cat leaving/transition ---
  const [catLeaving, setCatLeaving] = useState(false);
  const [catGone, setCatGone] = useState(false);
  const [cat, setCat] = useState<CatType>(() => {
    const cats: CatType[] = ["suki", "miso", "espy"];
    return cats[Math.floor(Math.random() * cats.length)];
  });
  const [foodCategory, setFoodCategory] = useState(() => randomChoice(FOOD_CATEGORIES));
  const [foodFile, setFoodFile] = useState(() => randomChoice(foodCategory.files));
  const [progress, setProgress] = useState(props.initialState?.progress ?? 0);
  const foodName = foodFile.replace(/\.png$/, "").replace(/_/g, " ");
  const foodImgSrc = `/images/food/${foodCategory.key}/${foodFile}`;

  // Show/hide ingredient overlay
  const [showIngredients, setShowIngredients] = useState(false);
  // Show insufficient ingredients warning after failed attempt
  const [showInsufficient, setShowInsufficient] = useState(false);
  // Show out-of-stock message at top
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  // Show market screen
  const [showMarket, setShowMarket] = useState(false);
  // Show shop overlay
  const [showShopOverlay, setShowShopOverlay] = useState(false);
  // Food Dex overlay state
  const [showFoodDex, setShowFoodDex] = useState(false);

  // --- Food stats state ---
  const [foodStats, setFoodStats] = useState<FoodStats>(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(FOOD_STATS_KEY);
      if (raw) return JSON.parse(raw);
    }
    return {};
  });

  // Persist foodStats
  useEffect(() => {
    localStorage.setItem(FOOD_STATS_KEY, JSON.stringify(foodStats));
  }, [foodStats]);

  // Sort allIngredients alphabetically by name
  const sortedIngredients = [...allIngredients].sort((a, b) => a.name.localeCompare(b.name));

  // Ingredient inventory (persisted in localStorage)
  const [inventory, setInventory] = useState<{ [ingredient: string]: number }>(props.initialInventory ?? {});
  // Money state (persisted in localStorage)
  const [money, setMoney] = useState<number>(props.initialMoney ?? 50);

  // Save inventory to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cat-cafe-inventory", JSON.stringify(inventory));
    console.log("[SAVE] inventory to localStorage", inventory);
  }, [inventory]);
  // Save money to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cat-cafe-money", String(money));
    console.log("[SAVE] money to localStorage", money);
  }, [money]);

  // Save progress to parent/localStorage whenever it changes
  useEffect(() => {
    if (props.onSaveProgress) {
      props.onSaveProgress({ progress });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  if (showMarket) {
    // Market mode: only show lace borders, market image, and back to cafe button
    return (
      <div className="relative flex flex-row justify-center items-center bg-[#FFF8E7] min-h-screen w-full" style={{ height: '100vh', minHeight: 0 }}>
        {/* Shop button at top */}
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
          <button
            className="px-6 py-2 rounded-lg text-lg font-sour-gummy bg-[#B3E5FC] text-[#226085] hover:bg-[#81D4FA] transition-colors shadow"
            type="button"
            aria-label="Shop"
            onClick={() => setShowShopOverlay(true)}
          >
            shop
          </button>
        </div>
        {/* Money display in shop overlay */}
        {showShopOverlay && (
          <>
            <div className="fixed top-8 right-8 z-50">
              <div className="rounded-xl bg-white/95 shadow-lg px-6 py-3 border border-[#f2e6d9] font-sour-gummy text-lg text-[#226085] min-w-[110px] text-center select-none">
                ${money}
              </div>
            </div>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="rounded-2xl bg-white/95 shadow-lg px-8 py-7 flex flex-col items-center min-w-[320px] max-w-[94vw] border border-[#f2e6d9] relative">
                <h2 className="text-2xl font-bold font-delius-unicase text-[#7B5537] mb-4">All Ingredients</h2>
                <ul className="mb-6 max-h-[45vh] overflow-y-auto w-full">
                  {sortedIngredients.map(({ name, cost }) => {
                    const notEnough = money < cost;
                    return (
                      <li key={name} className="font-sour-gummy text-[#7B5537] text-base py-1 border-b border-[#f2e6d9] last:border-b-0 flex justify-between items-center">
                        <span>{name}</span>
                        <span className="text-[#226085] ml-4">${cost} for 10</span>
                        <button
                          className={`ml-4 px-4 py-1 rounded-lg text-base font-sour-gummy bg-[#B3E5FC] text-[#226085] hover:bg-[#81D4FA] transition-colors shadow ${notEnough ? 'opacity-50 cursor-not-allowed' : ''}`}
                          type="button"
                          disabled={notEnough}
                          onClick={() => {
                            if (money < cost) return;
                            setMoney(money - cost);
                            setInventory(prev => ({
                              ...prev,
                              [name]: (prev[name] || 0) + 10
                            }));
                          }}
                        >
                          buy
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <button
                  className="px-5 py-2 rounded-lg text-lg font-sour-gummy bg-[#B3E5FC] text-[#226085] hover:bg-[#81D4FA] transition-colors shadow mt-2"
                  type="button"
                  onClick={() => setShowShopOverlay(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
        {/* Left lace border */}
        <img
          src="/images/laceborderleft.png"
          alt="Lace Border Left"
          style={{ height: '100vh', width: 'auto', objectFit: 'cover', position: 'absolute', left: 240, top: 0, display: 'block', zIndex: 10 }}
          className="select-none pointer-events-none"
          draggable={false}
        />
        {/* Market screen image centered and flush */}
        <img
          src="/images/marketscreen.png"
          alt="Market"
          className="w-auto max-w-[90vw] max-h-[90vh] rounded-2xl shadow-lg z-20"
          style={{ objectFit: 'contain' }}
          draggable={false}
        />
        {/* Right lace border */}
        <img
          src="/images/laceborderright.png"
          alt="Lace Border Right"
          style={{ height: '100vh', width: 'auto', objectFit: 'cover', position: 'absolute', right: 5, top: 0, display: 'block', zIndex: 10 }}
          className="select-none pointer-events-none"
          draggable={false}
        />
        {/* Back to cafe button overlays market image */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <button
            className="px-6 py-2 rounded-lg text-lg font-sour-gummy bg-[#B3E5FC] text-[#226085] hover:bg-[#81D4FA] transition-colors shadow"
            type="button"
            onClick={() => {
              setShowMarket(false);
              setShowOutOfStock(false); // Hide out-of-stock
              setCatLeaving(true); // Start cat leaving animation
              setTimeout(() => {
                // After random delay, new cat and order
                setCatLeaving(false);
                setCatGone(false);
                setCat(randomChoice(["suki", "miso", "espy"]));
                const newFoodCategory = randomChoice(FOOD_CATEGORIES);
                setFoodCategory(newFoodCategory);
                setFoodFile(randomChoice(newFoodCategory.files));
              }, Math.random() * 4000 + 1000); // 1-5 seconds
              setTimeout(() => setCatGone(true), 400); // fade out in 0.4s
            }}
          >
            back to cafe
          </button>
        </div>
      </div>
    );
  }

  // Cafe mode: render all cafe overlays and content
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-[#FFF8E7] min-h-screen w-full">
      {/* Persistent market and food dex buttons bottom left */}
      {!showMarket && !showShopOverlay && !showMinigame && !showResult && !showFoodDex && (
        <div className="fixed bottom-8 left-8 flex flex-col gap-4 z-[120]">
          <button
            className="w-14 h-14 rounded-lg bg-[#B3E5FC] flex items-center justify-center shadow-lg hover:bg-[#81D4FA] transition-colors"
            style={{ boxShadow: '0 2px 8px #b3e5fc77' }}
            aria-label="Go to market"
            onClick={() => setShowMarket(true)}
          >
            <ShopBagIcon size={32} />
          </button>
          <button
            className="w-14 h-14 rounded-lg bg-[#B3E5FC] flex items-center justify-center shadow-lg hover:bg-[#81D4FA] transition-colors"
            style={{ boxShadow: '0 2px 8px #b3e5fc77' }}
            aria-label="Open Food Dex"
            onClick={() => setShowFoodDex(true)}
          >
            <FoodDexIcon size={32} />
          </button>
        </div>
      )}

      {/* Food Dex Overlay */}
      {showFoodDex && (
        <FoodDexOverlay
          foods={Object.entries(foodStats)
            .filter(([, stats]) => stats.timesMade > 0)
            .map(([foodKey, stats]) => {
              // Get ingredients from foodData
              const ingredients = (foodData[foodKey]?.ingredients || []).map(i => i.name.charAt(0).toUpperCase() + i.name.slice(1));
              // Find most ordered cat
              const catOrders = stats.catOrders || {};
              let mostOrderedBy = '';
              let maxOrders = 0;
              Object.entries(catOrders).forEach(([cat, count]) => {
                if (count && count > maxOrders) {
                  mostOrderedBy = CAT_NAMES[cat as CatType] || cat;
                  maxOrders = count;
                }
              });
              // Image path logic (category lookup)
              let img = '';
              for (const catObj of FOOD_CATEGORIES) {
                if (catObj.files.includes(foodKey + '.png')) {
                  img = `/images/food/${catObj.key}/${foodKey}.png`;
                  break;
                }
              }
              return {
                name: displayFoodName(foodKey),
                image: img,
                mostOrderedBy: mostOrderedBy || '-',
                ingredients,
                timesMade: stats.timesMade,
                stars: stats.stars
              };
            })}
          onClose={() => setShowFoodDex(false)}
        />
      )}

      {/* Render MinigameOverlay absolutely above all content if active */}
      {showMinigame && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <MinigameOverlay
            onFinish={(clicks: number) => {
              setShowMinigame(false);
              setTimeout(() => setShowResult({ clicks }), 400); // fade out minigame, then show result
            }}
          />
        </div>
      )}
      {showResult && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
          {showResult.clicks === 0 ? (
            <div className="rounded-2xl bg-white/95 shadow-lg px-12 py-12 flex flex-col items-center border border-[#f2e6d9]">
              <span className="font-delius-unicase text-2xl text-[#7B5537] mb-4">Oh no! You missed the dish!</span>
              <button
                className="mt-6 px-6 py-2 rounded-lg text-lg font-sour-gummy bg-[#B3E5FC] text-[#226085] hover:bg-[#81D4FA] shadow"
                onClick={() => {
                  // Deduct ingredients used for this dish (even on fail)
                  const foodKey = foodName.replace(/ /g, "_");
                  const reqs = foodData[foodKey]?.ingredients || [];
                  setInventory(inv => {
                    const newInv = { ...inv };
                    reqs.forEach(ing => {
                      newInv[ing.name] = Math.max(0, (newInv[ing.name] ?? 0) - ing.amount);
                    });
                    return newInv;
                  });
                  setShowResult(null);
                  setCatLeaving(true);
                  setTimeout(() => setCatGone(true), 400);
                  setTimeout(() => {
                    setCatLeaving(false);
                    setCatGone(false);
                    setCat(randomChoice(["suki", "miso", "espy"]));
                    const newFoodCategory = randomChoice(FOOD_CATEGORIES);
                    setFoodCategory(newFoodCategory);
                    setFoodFile(randomChoice(newFoodCategory.files));
                  }, Math.random() * 4000 + 1000);
                }}
              >Continue</button>
            </div>
          ) : (
            <div className="rounded-2xl bg-white/95 shadow-lg px-12 py-12 flex flex-col items-center border border-[#f2e6d9]">
              <span className="font-delius-unicase text-2xl text-[#7B5537] mb-2">You made a {foodName}!</span>
              <img src={foodImgSrc} alt={foodName} className="my-4 rounded-xl" style={{ width: 180, height: 180, objectFit: 'contain' }} />
              <div className="flex flex-row gap-2 mb-4">
                {Array.from({ length: showResult.clicks <= 2 ? 1 : showResult.clicks <= 4 ? 2 : 3 }).map((_, i) => (
                  <span key={i} style={{ display: 'inline-block' }}><StarIcon size={36} /></span>
                ))}
              </div>
              <span className="font-sour-gummy text-lg text-[#226085] mb-4">
                {showResult.clicks <= 2 ? '$2 earned!' : showResult.clicks <= 4 ? '$3 earned!' : '$5 earned!'}
              </span>
              <button
                className="mt-2 px-6 py-2 rounded-lg text-lg font-sour-gummy bg-[#B3E5FC] text-[#226085] hover:bg-[#81D4FA] shadow"
                onClick={() => {
                  // Deduct ingredients used for this dish
                  const foodKey = foodName.replace(/ /g, "_");
                  const reqs = foodData[foodKey]?.ingredients || [];
                  setInventory(inv => {
                    const newInv = { ...inv };
                    reqs.forEach(ing => {
                      newInv[ing.name] = Math.max(0, (newInv[ing.name] ?? 0) - ing.amount);
                    });
                    return newInv;
                  });
                  // Add money
                  setMoney(m => m + (showResult.clicks <= 2 ? 2 : showResult.clicks <= 4 ? 3 : 5));
                  // --- Update foodStats ---
                  const foodKeyForStats = foodName.replace(/ /g, "_");
                  const starsEarned = showResult.clicks <= 2 ? 1 : showResult.clicks <= 4 ? 2 : 3;
                  setFoodStats(prev => {
                    const prevStats = prev[foodKeyForStats] || { timesMade: 0, stars: 0, catOrders: {} };
                    const catKey = cat as CatType;
                    return {
                      ...prev,
                      [foodKeyForStats]: {
                        timesMade: prevStats.timesMade + 1,
                        stars: Math.max(prevStats.stars, starsEarned),
                        catOrders: {
                          ...prevStats.catOrders,
                          [catKey]: (prevStats.catOrders[catKey] || 0) + 1
                        }
                      }
                    };
                  });
                  setShowResult(null);
                  setCatLeaving(true);
                  setTimeout(() => setCatGone(true), 400);
                  setTimeout(() => {
                    setCatLeaving(false);
                    setCatGone(false);
                    setCat(randomChoice(["suki", "miso", "espy"]));
                    const newFoodCategory = randomChoice(FOOD_CATEGORIES);
                    setFoodCategory(newFoodCategory);
                    setFoodFile(randomChoice(newFoodCategory.files));
                  }, Math.random() * 4000 + 1000);
                }}
              >Continue</button>
            </div>
          )}
        </div>
      )}
      {/* Cat name and food order UI */}
      {!showIngredients && !showOutOfStock && !showMinigame && !catGone && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[420px] max-w-[94vw] z-30">
        <div className="rounded-2xl bg-white/95 shadow-lg px-8 py-5 flex flex-col items-start border border-[#f2e6d9] relative min-w-[220px]">
          <span className="text-lg font-bold font-delius-unicase text-[#7B5537] mb-1">{CAT_NAMES[cat]}</span>
          <span className="font-sour-gummy text-[#7B5537] text-base mb-4">I want the <span className="font-bold">{foodName}</span>.</span>
          <div className="flex flex-row-reverse w-full">
            <button
              className="px-5 py-2 rounded-lg text-lg font-sour-gummy bg-[#B3E5FC] text-[#226085] hover:bg-[#81D4FA] transition-colors shadow self-end"
              type="button"
              onClick={() => setShowIngredients(true)}
            >
              OK
            </button>
          </div>
        </div>
      </div>
      )}
      {/* Out of stock overlay at top */}
      {showOutOfStock && (
        <>
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[420px] max-w-[94vw] z-40">
            <div className="rounded-2xl bg-white/95 shadow-lg px-8 py-5 flex flex-col items-start border border-[#f2e6d9] relative min-w-[220px]">
              <span className="text-lg font-bold font-delius-unicase text-[#7B5537] mb-1">you</span>
              <span className="font-sour-gummy text-[#7B5537] text-base mb-2">Sorry, we&apos;re out of that.</span>
            </div>
          </div>
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <button
              className="px-6 py-2 rounded-lg text-lg font-sour-gummy bg-[#B3E5FC] text-[#226085] hover:bg-[#81D4FA] transition-colors shadow"
              type="button"
              onClick={() => setShowMarket(true)}
            >
              go to market
            </button>
          </div>
        </>
      )}
      {/* Ingredient overlay */}
      {showIngredients && !showMinigame && (
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-black/10">
          <div className="rounded-2xl bg-white shadow-2xl px-10 py-8 flex flex-col items-center border border-[#f2e6d9] min-w-[340px] max-w-[96vw] max-h-[90vh] overflow-y-auto">
            <span className="text-2xl font-bold font-delius-unicase text-[#7B5537] mb-4">Ingredients for {foodName}</span>
            <div className="w-full flex flex-col gap-2 mb-6">
              {(foodData[foodName.replace(/ /g, "_")]?.ingredients || []).map((ing) => (
                <div key={ing.name} className="flex flex-row justify-between items-center w-full border-b border-[#f2e6d9] pb-1">
                  <span className="font-sour-gummy text-lg text-[#7B5537]">{ing.name}</span>
                  <span className="font-sour-gummy text-[#226085]">You have: <b>{inventory[ing.name] ?? 0}</b></span>
                </div>
              ))}
              {!(foodData[foodName.replace(/ /g, "_")]?.ingredients?.length) && (
                <span className="italic text-[#b0a89e]">No ingredient data for this food. Edit foodData.ts!</span>
              )}
            </div>
            {/* Check if user has enough ingredients */}
            {(() => {
                const foodKey = foodName.replace(/ /g, "_");
                const reqs = foodData[foodKey]?.ingredients || [];
                const hasAll = reqs.every(ing => (inventory[ing.name] ?? 0) >= ing.amount);
                return <>
                  <div className="flex flex-row items-center w-full justify-end gap-4 mt-2 relative">
                    {!hasAll && showInsufficient && (
                      <div className="text-red-500 font-sour-gummy text-sm whitespace-nowrap">insufficient ingredients</div>
                    )}
                    {/* If not enough ingredients, show blue arrow to market button */}
                    {!hasAll && (
                      <div className="absolute left-[-80px] bottom-[-10px] flex flex-col items-center">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                          <path d="M24 4v36M24 40l-8-8M24 40l8-8" stroke="#81D4FA" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-sour-gummy text-xs text-[#81D4FA] mt-1">Market</span>
                      </div>
                    )}
                    <button
                      className={
                        !hasAll && showInsufficient
                          ? "px-6 py-2 rounded-lg text-lg font-sour-gummy bg-gray-300 text-gray-400 cursor-not-allowed shadow"
                          : "px-6 py-2 rounded-lg text-lg font-sour-gummy bg-[#B3E5FC] text-[#226085] hover:bg-[#81D4FA] transition-colors shadow"
                      }
                      type="button"
                      onClick={() => {
                        console.log("[CLICK] start making dish", { hasAll, showIngredients, showMinigame });
                        if (hasAll) {
                          setShowIngredients(false);
                          setShowMinigame(true);
                          console.log("[ACTION] setShowMinigame(true)");
                        } else if (!showInsufficient) {
                          setShowInsufficient(true);
                          setTimeout(() => {
                            setShowIngredients(false);
                            setShowInsufficient(false);
                            setShowOutOfStock(true);
                          }, 2000);
                        }
                      }}
                      disabled={!hasAll && showInsufficient}
                    >
                      start making dish
                    </button>
                  </div>
                </>;
              })()}

      {/* Minigame Overlay */}


          </div>
        </div>
      )}

      <div className="relative flex flex-row justify-center items-center" style={{ height: '100vh', minHeight: 0 }}>

        <img
          src="/images/laceborderleft.png"
          alt="Lace Border Left"
          style={{ height: '100vh', width: 'auto', objectFit: 'cover', position: 'absolute', left: -200, top: 0, display: 'block' }}
          className="hidden sm:block select-none pointer-events-none"
          draggable={false}
        />
        {/* Center content always centered between lace borders, scaled up */}
        <div className="flex flex-col items-center w-full" style={{ height: '100vh', justifyContent: 'center', position: 'relative' }}>
          {/* Cat tail and body layered under the counter, scaled up */}
          <div className="absolute" style={{ left: '50%', top: 'calc(59% - 400px)', transform: 'translate(-50%, 0)', width: 600, zIndex: 0 }}>
            <div style={{ position: "relative", width: 570, height: 380 }}>
              {/* Tail under body */}
              <div style={{
                opacity: catGone ? 0 : 1,
                transition: "opacity 0.4s cubic-bezier(.4,0,.2,1)",
                pointerEvents: catGone ? "none" : "auto"
              }}>
                <AnimatedTail cat={cat} />
              </div>
              {/* Cat body/head OVER the tail */}
              <Image
                src={
                  cat === "suki"
                    ? "/images/cats/suki/sprites/suki-ordersprite.png"
                    : cat === "miso"
                    ? "/images/cats/miso/sprites/miso-ordersprite.png"
                    : "/images/cats/espy/sprites/espy-ordersprite.png"
                }
                alt={
                  cat === "suki"
                    ? "Suki Order Sprite"
                    : cat === "miso"
                    ? "Miso Order Sprite"
                    : "Espy Order Sprite"
                }
                width={570}
                height={300}
                priority
                style={{
                  position: "absolute",
                  left: 0,
                  top: 120,
                  zIndex: 2,
                  maxWidth: "100%",
                  height: "auto",
                  opacity: catGone ? 0 : 1,
                  transition: "opacity 0.4s cubic-bezier(.4,0,.2,1)",
                  pointerEvents: catGone ? "none" : "auto"
                }}
              />
            </div>
          </div>
          {/* Order Counter always on top, scaled up */}
          <Image
            src="/images/ordercounter.png"
            alt="Order Counter"
            width={600}
            height={180}
            priority
            className="z-10"
            style={{ position: "relative", top: 0, left: 0, maxWidth: "100%", height: "auto" }}
          />
        </div>
        {/* Right lace border, absolutely positioned and tall */}
        <img
          src="/images/laceborderright.png"
          alt="Lace Border Right"
          style={{ height: '100vh', width: 'auto', objectFit: 'cover', position: 'absolute', right: -435, top: 0, display: 'block' }}
          className="hidden sm:block select-none pointer-events-none"
          draggable={false}
        />
      </div>
    </div>
  );
}

function AnimatedTail({ cat }: { cat: CatType }) {
  const [angle, setAngle] = useState(0);
  const directionRef = useRef(1);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    let last = performance.now();
    function animate(now: number) {
      const delta = now - last;
      last = now;
      setAngle(prev => {
        let next = prev + directionRef.current * (delta / 1000) * 4; // ~4deg/sec
        if (next > 2) {
          next = 2;
          directionRef.current = -1;
        } else if (next < -2) {
          next = -2;
          directionRef.current = 1;
        }
        return next;
      });
      requestRef.current = requestAnimationFrame(animate);
    }
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  return (
    <img
      src={
        cat === "suki"
          ? "/images/cats/suki/sprites/suki-ordersprite-tail.png"
          : cat === "miso"
          ? "/images/cats/miso/sprites/miso-ordersprite-tail.png"
          : "/images/cats/espy/sprites/espy-ordersprite-tail.png"
      }
      alt={
        cat === "suki"
          ? "Suki Order Sprite Tail"
          : cat === "miso"
          ? "Miso Order Sprite Tail"
          : "Espy Order Sprite Tail"
      }
      width={570}
      height={180}
      style={{
        position: "absolute",
        left: cat === "miso" ? 20 : 0,
        top: cat === "miso" ? 170 : 180,
        zIndex: 1,
        maxWidth: "100%",
        height: "auto",
        transform: `rotate(${angle}deg)`,
        transformOrigin: "60% 95%"
      }}
      draggable={false}
    />
  );
}
