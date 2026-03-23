"use client";

import { useState, useEffect, useRef } from "react";
import ParticleBackground from "@/components/ParticleBackground";
import TopBar from "@/components/TopBar";
import { useDoubleReactivity } from "@/hooks/useDoubleReactivity";
import { useDoubleContract } from "@/hooks/useDoubleContract";
import { formatEther } from "viem";
import { useAccount } from "wagmi";

import DoubleWheel from "@/components/DoubleGame/DoubleWheel";
import DoubleBetPanel from "@/components/DoubleGame/DoubleBetPanel";
import DoubleLiveFeed, { DoubleBetEntry } from "@/components/DoubleGame/DoubleLiveFeed";
import DoubleAnalyticsFooter from "@/components/DoubleGame/DoubleAnalyticsFooter";

export interface DoubleHistoryResult {
    id: number;
    roundId: number;
    color: number;
    number?: number;
}

export default function DoublePage() {
  const { address: userAddress } = useAccount();
  const { contractState, drawTargetTimestamp, placeBet, isBetting, refetchState, refetchTimestamp } = useDoubleContract();

  const [assembled, setAssembled] = useState(false);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const [history, setHistory] = useState<DoubleHistoryResult[]>([]);
  const [entries, setEntries] = useState<DoubleBetEntry[]>([]);
  
  const [spinToNumber, setSpinToNumber] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [drawPhase, setDrawPhase] = useState<"idle" | "selection" | "reveal" | "reset">("idle");

  const myBets = entries.filter((e) => e.isYou).map(e => ({ color: e.color, amount: String(e.amount) }));
  
  const entryCounter = useRef(0);
  const pendingHistoryRef = useRef<{ roundId: number; color: number, number: number } | null>(null);

  // Initialize from Backend API (Fallback to NextJS relative if undefined)
  useEffect(() => {
     const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
     fetch(`${API_URL}/api/v1/double/history`)
        .then(res => res.json())
        .then(data => {
            if (data && Array.isArray(data)) {
                setHistory(data.map(d => ({
                    id: d.id,
                    roundId: d.roundId,
                    color: d.color,
                    number: d.number,
                })));
            }
        })
        .catch(console.error);
  }, []);

  // Reactivity WebSockets
  useDoubleReactivity({
    onBetPlaced: (player, color, amount, newColorTotal, roundId) => {
      const isYou = userAddress?.toLowerCase() === player.toLowerCase();
      const amountStt = Number(formatEther(amount));

      const newEntry: DoubleBetEntry = {
        id: `bet-${entryCounter.current++}`,
        player: isYou ? "YOU" : `${player.slice(0, 6)}...${player.slice(-4)}`,
        amount: amountStt,
        color: color,
        isNew: true,
        isYou,
      };

      setEntries((prev) => {
        const updated = prev.map((e) => ({ ...e, isNew: false }));
        return [newEntry, ...updated];
      });
    },
    onRoundResult: (roundId, number, color, totalPayout) => {
      console.log(`[Double Reactivity] Result: Round ${roundId} | Number ${number} | Color ${color}`);
      
      setSpinToNumber(number);
      setIsSpinning(true);
      
      pendingHistoryRef.current = { roundId: Number(roundId), color, number };
      setDrawPhase("selection");
    }
  });

  // Draw Sequence Triggered by Socket Result
  useEffect(() => {
      if (drawPhase !== "selection") return;
      
      const runCinematic = async () => {
          // 5.5 seconds spin matching the CSS transition in DoubleWheel
          await new Promise(r => setTimeout(r, 5500));
          
          if (pendingHistoryRef.current) {
              const { roundId, color, number } = pendingHistoryRef.current;
              setHistory(prev => [...prev.slice(-99), { id: Math.random(), roundId, color, number }]);
              pendingHistoryRef.current = null;
          }

          setDrawPhase("reveal");
          await new Promise(r => setTimeout(r, 4000));
          
          setDrawPhase("reset");
          setSpinToNumber(null);
          setIsSpinning(false);
          setEntries([]);
          setRound(r => r + 1);

          refetchState();
          refetchTimestamp();

          setDrawPhase("idle");
      };
      runCinematic();
  }, [drawPhase, refetchState, refetchTimestamp]);


  // Countdown mapping
  useEffect(() => {
    if (drawTargetTimestamp === undefined) return;
    const target = Number(drawTargetTimestamp as bigint);

    const interval = setInterval(() => {
      if (target === 0) {
        setTimeLeft(60);
        return;
      }
      const nowSeconds = Math.floor(Date.now() / 1000);
      const secondsLeft = target - nowSeconds;
      setTimeLeft(secondsLeft > 0 ? secondsLeft : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [drawTargetTimestamp]);

  useEffect(() => {
    setTimeout(() => setAssembled(true), 100);
  }, []);

  const isUrgent = timeLeft <= 30 && timeLeft > 15;
  const isCritical = timeLeft <= 15 && timeLeft > 0;
  const isLocked = isCritical || drawPhase !== "idle";

  const lastWinner = history.length > 0 ? history[history.length - 1] : null;

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#050505] selection:bg-[#CC1111]/40 font-sans">
      <div className="fixed inset-0 pointer-events-none opacity-5 mix-blend-overlay noise-bg z-50"></div>
      <ParticleBackground />

      <TopBar
        timeLeft={timeLeft}
        totalTime={60}
        round={round}
        isUrgent={isUrgent}
        isCritical={isCritical}
      />

      {/* Main content fully adopting the Prototype structure */}
      <main className="relative z-20 flex-1 flex flex-col items-center pt-[70px] pb-4 px-4 lg:px-8 gap-4 w-full max-w-[1500px] mx-auto transition-all duration-700" 
            style={{
                opacity: assembled ? 1 : 0,
                transform: assembled ? "translateY(0)" : "translateY(10px)",
            }}>
        
        {/* Layer 1: Hero Carousel (The Slide) */}
        <div className="w-full">
            <DoubleWheel 
                spinToNumber={spinToNumber}
                isSpinning={isSpinning}
                timeLeft={timeLeft}
                lastWinner={lastWinner}
            />
        </div>

        {/* Layer 2: Main Grid containing Betting and Live Feed */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
            
            {/* Left Column (SPAN 8) -> Bet interface */}
            <div className="lg:col-span-8 flex flex-col">
                <DoubleBetPanel 
                    onPlaceBet={placeBet}
                    isBetting={isBetting}
                    disabled={isLocked}
                    isCritical={isCritical}
                    myBets={myBets}
                />
            </div>
            
            {/* Right Column (SPAN 4) -> Live 3-Column Feed */}
            <div className="lg:col-span-4 flex flex-col">
                <DoubleLiveFeed entries={entries} />
            </div>

        </div>

        {/* Layer 3: Analytics and Data Footer */}
        <div className="w-full">
             <DoubleAnalyticsFooter history={history} entries={entries} />
        </div>

      </main>
    </div>
  );
}
