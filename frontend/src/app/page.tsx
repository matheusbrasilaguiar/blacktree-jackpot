"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ParticleBackground from "@/components/ParticleBackground";
import TopBar from "@/components/TopBar";
import JackpotDisplay from "@/components/JackpotDisplay";
import PrizeBreakdown from "@/components/PrizeBreakdown";
import EnterButton from "@/components/EnterButton";
import ParticipantsFeed, { ParticipantEntry } from "@/components/ParticipantsFeed";
import StatsCards from "@/components/StatsCards";
import DrawOverlay from "@/components/DrawOverlay";
import CometStreak from "@/components/CometStreak";
import CinematicIntro from "@/components/CinematicIntro";
import PastDraws, { PastDraw } from "@/components/PastDraws";
import { useJackpotReactivity, JACKPOT_CONTRACT_ADDRESS } from "@/hooks/useJackpotReactivity";
import { formatEther, parseAbi } from "viem";
import { useReadContracts, useAccount } from "wagmi";

const blackTreeAbi = parseAbi([
  "function currentJackpot() view returns (uint256)",
  "function roundId() view returns (uint256)",
  "function getParticipants() view returns (address[])",
  "function drawTargetTimestamp() view returns (uint256)",
  "function ticketPrice() view returns (uint256)"
]);

const TICKET_PRICE = 1;
const DRAW_DURATION = 300; // 5 minutes

const INITIAL_PAST_DRAWS: PastDraw[] = [];

type DrawPhase = "idle" | "lockdown" | "selection" | "reveal" | "celebration" | "reset";

export default function Home() {
  const { address: userAddress } = useAccount();

  // Wagmi Read Initial State
  const { data: contractData, refetch: refetchState } = useReadContracts({
    contracts: [
      { address: JACKPOT_CONTRACT_ADDRESS, abi: blackTreeAbi, functionName: "currentJackpot" },
      { address: JACKPOT_CONTRACT_ADDRESS, abi: blackTreeAbi, functionName: "roundId" },
      { address: JACKPOT_CONTRACT_ADDRESS, abi: blackTreeAbi, functionName: "getParticipants" },
      { address: JACKPOT_CONTRACT_ADDRESS, abi: blackTreeAbi, functionName: "drawTargetTimestamp" },
    ],
    query: {
      refetchInterval: 3000, // Poll every 3s as a fallback to Reactivity
    }
  });

  const [showIntro, setShowIntro] = useState(true);
  const [assembled, setAssembled] = useState(false);

  // React State connected to onchain
  const [jackpot, setJackpot] = useState(0);
  const [participants, setParticipants] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);

  const [entries, setEntries] = useState<ParticipantEntry[]>([]);
  const [flash, setFlash] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);
  const [drawPhase, setDrawPhase] = useState<DrawPhase>("idle");
  const [hasEntered, setHasEntered] = useState(false);
  const [winners, setWinners] = useState<{ address: string; amount: number; place: string }[]>([]);
  const [pastDraws, setPastDraws] = useState<PastDraw[]>(INITIAL_PAST_DRAWS);
  const [rightTab, setRightTab] = useState<"feed" | "history">("feed");
  const feedPaused = useRef(false);
  const entryCounter = useRef(0);
  const prevRoundRef = useRef(round);

  // Reset per-round state when a new round starts
  useEffect(() => {
    if (round > prevRoundRef.current) {
      prevRoundRef.current = round;
      setHasEntered(false);
      setEntries([]);
      setParticipants(0);
    }
  }, [round]);

  // Sync initial React state with Wagmi read contract
  useEffect(() => {
    if (contractData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (contractData[0]?.result !== undefined) setJackpot(Number(formatEther(contractData[0].result as bigint)));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (contractData[1]?.result !== undefined) setRound(Number(contractData[1].result as bigint));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (contractData[2]?.result !== undefined) {
        const pList = contractData[2].result as string[];
        setParticipants(pList.length);

        // Populate Who's In from chain state
        const initialEntries: ParticipantEntry[] = pList.map((addr, idx) => {
          const isYou = userAddress?.toLowerCase() === addr.toLowerCase();
          return {
            id: `init-${idx}`,
            address: isYou ? "YOU" : `${addr.slice(0, 6)}...${addr.slice(-4)}`,
            amount: TICKET_PRICE,
            timeAgo: "Joined",
            isNew: false,
            isYou,
          };
        }).reverse().slice(0, 12);

        // If user is already in this round's participant list, reflect it immediately
        const alreadyIn = pList.some((addr) => userAddress?.toLowerCase() === addr.toLowerCase());
        if (alreadyIn) setHasEntered(true);

        setEntries(initialEntries);
      }
    }
  }, [contractData, userAddress]);

  // Sync Countdown based on contract timestamp
  useEffect(() => {
    if (contractData && contractData[3]?.result !== undefined) {
      const targetTimestamp = Number(contractData[3].result as bigint);

      if (targetTimestamp === 0) {
        // Draw not triggered yet (room has 0 or 1 players)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTimeLeft(DRAW_DURATION);
        return;
      }

      const nowSeconds = Math.floor(Date.now() / 1000);
      const secondsLeft = targetTimestamp - nowSeconds;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimeLeft(secondsLeft > 0 ? secondsLeft : 0);
    } else if (contractData && contractData[3]?.result === BigInt(0)) {
      // Catch-all
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimeLeft(DRAW_DURATION);
    }
  }, [contractData]); // Removed blockNumber dependency since we use local clock sync

  // Somnia Reactivity Integration
  useJackpotReactivity({
    onTicketPurchased: (participant, newJackpot, eventRoundId) => {
      if (Number(eventRoundId) !== round) return; // Ignore old events

      const sttAmount = Number(formatEther(newJackpot));
      console.log(`[Reactivity] Real Ticket Bought! new jackpot: ${sttAmount} STT`);

      setJackpot(sttAmount);
      setParticipants((p) => p + 1);

      // Update our other smart contract views (like target block for countdown!)
      refetchState();

      const isYou = userAddress?.toLowerCase() === participant.toLowerCase();
      if (isYou) setHasEntered(true);

      if (!feedPaused.current) {
        const newEntry: ParticipantEntry = {
          id: `entry-${entryCounter.current++}`,
          address: isYou ? "YOU" : `${participant.slice(0, 6)}...${participant.slice(-4)}`,
          amount: TICKET_PRICE,
          timeAgo: "just now",
          isNew: true,
          isYou,
        };
        setEntries((prev) => {
          const updated = prev.map((e) => ({ ...e, isNew: false }));
          return [newEntry, ...updated].slice(0, 12);
        });
        setFlash(true);
        setTimeout(() => setFlash(false), 80);
      }
    },
    onJackpotWon: (eventRoundId, first, second, third, totalPrize) => {
      console.log(`[Reactivity] Real Jackpot Won! Round: ${eventRoundId}`);

      const totalStt = Number(formatEther(totalPrize));
      const winnersList = [];
      const fee = totalStt * 0.05;

      // Apply our smart contract fractions dynamically on the UI side as well
      if (second === "0x0000000000000000000000000000000000000000") {
        // 1 player rollover (handled by contract, this event shouldn't emit, but if it does we skip)
        // Actually event doesn't emit for < 2 players.
      } else if (third === "0x0000000000000000000000000000000000000000") {
        // 2 players
        winnersList.push({ address: first, amount: totalStt * 0.75, place: "1ST PLACE" });
        winnersList.push({ address: second, amount: totalStt - fee - (totalStt * 0.75), place: "2ND PLACE" });
      } else {
        // 3+ players
        winnersList.push({ address: first, amount: totalStt * 0.70, place: "1ST PLACE" });
        winnersList.push({ address: second, amount: totalStt * 0.20, place: "2ND PLACE" });
        winnersList.push({ address: third, amount: totalStt - fee - (totalStt * 0.70) - (totalStt * 0.20), place: "3RD PLACE" });
      }

      setWinners(winnersList);
      // We no longer rely on timeLeft=0 to trigger. The `useEffect` below will trigger automatically
      // when `winners` is populated and `drawPhase === "idle"`.
    },
  });

  const isUrgent = timeLeft <= 120 && timeLeft > 60;
  const isCritical = timeLeft <= 60 && timeLeft > 0;

  // Staggered assembly after intro
  useEffect(() => {
    if (!showIntro) {
      setTimeout(() => setAssembled(true), 100);
    }
  }, [showIntro]);

  // Countdown interval bridging the updates with Absolute Time (Browser tab sleep proof)
  useEffect(() => {
    if (showIntro || drawPhase !== "idle" || !contractData || contractData[3]?.result === undefined) return;

    const targetTimestamp = Number(contractData[3].result as bigint);

    const interval = setInterval(() => {
      // If timer hasn't started yet (target is 0), keep it at DRAW_DURATION
      if (targetTimestamp === 0) {
        setTimeLeft(DRAW_DURATION);
        return;
      }

      const nowSeconds = Math.floor(Date.now() / 1000);
      const secondsLeft = targetTimestamp - nowSeconds;

      setTimeLeft(secondsLeft > 0 ? secondsLeft : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [showIntro, drawPhase, contractData]);

  // Update time ago
  useEffect(() => {
    const interval = setInterval(() => {
      setEntries((prev) =>
        prev.map((e) => {
          if (e.timeAgo === "just now") return { ...e, timeAgo: "1s ago" };
          const match = e.timeAgo.match(/(\d+)s/);
          if (match) return { ...e, timeAgo: `${parseInt(match[1]) + 1}s ago` };
          return e;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Draw sequence cinematic (Triggered when we have winners populated!)
  useEffect(() => {
    if (showIntro || winners.length === 0 || drawPhase !== "idle") return;

    const runDraw = async () => {
      feedPaused.current = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__particleConverge?.(true);

      // Lockdown
      setDrawPhase("lockdown");
      setIsPulsing(false);
      await sleep(3000);

      // Selection
      setDrawPhase("selection");
      await sleep(4500);

      // Flash white
      const wFlash = document.createElement("div");
      wFlash.style.cssText = "position:fixed;inset:0;background:white;z-index:9999;pointer-events:none;transition:opacity 0.3s";
      document.body.appendChild(wFlash);
      setTimeout(() => { wFlash.style.opacity = "0"; }, 50);
      setTimeout(() => wFlash.remove(), 400);

      // Reveal (winners state is already populated by the Reactivity Hook!)
      setDrawPhase("reveal");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__particleConverge?.(false);
      await sleep(5500);

      // Celebration
      setDrawPhase("celebration");
      await sleep(4000);

      // Save to past draws
      const newPastDraw: PastDraw = {
        round,
        totalPot: jackpot,
        participants,
        timeAgo: "just now",
        winners: winners.map((wi) => ({ address: wi.address, amount: wi.amount, place: wi.place.replace(" PLACE", "") })),
      };
      setPastDraws((prev) => [newPastDraw, ...prev].slice(0, 10));

      // Reset
      setDrawPhase("reset");
      setJackpot(0);
      setParticipants(0);
      setRound((r) => r + 1);

      // Refetch onchain state to guarantee sync
      refetchState();
      await sleep(5000);

      // Back to normal
      setDrawPhase("idle");
      setWinners([]);
      setIsPulsing(true);
      feedPaused.current = false;
      setHasEntered(false);
      setEntries([]);
    };

    runDraw();
  }, [showIntro, winners, drawPhase, round, jackpot, participants, refetchState]);

  const handleEnter = useCallback(() => {
    // Left empty, because the Wagmi transaction success will now trigger onTicketPurchased
    // Reactivity takes over and syncs the UI visually when it actually hits the chain!
  }, []);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  if (showIntro) {
    return <CinematicIntro onComplete={handleIntroComplete} />;
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-background">
      <div className="noise-overlay" />
      <ParticleBackground />
      <CometStreak />

      <TopBar
        timeLeft={timeLeft}
        totalTime={DRAW_DURATION}
        round={round}
        isUrgent={isUrgent}
        isCritical={isCritical}
      />

      {/* Main content */}
      <div className="relative z-20 flex flex-col h-screen pt-[72px] pb-[44px]">
        <div className="flex flex-col lg:flex-row flex-1 min-h-0 w-full max-w-[1600px] mx-auto px-4 lg:px-8 xl:px-12">
          {/* LEFT — Jackpot Hero (60%) */}
          <div
            className="w-full lg:w-[60%] flex flex-col justify-center lg:pr-12 xl:pr-20 py-10 transition-all duration-700"
            style={{
              opacity: assembled ? 1 : 0,
              transform: assembled ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <JackpotDisplay
              amount={jackpot}
              isPulsing={isPulsing}
              isShaking={drawPhase === "lockdown"}
              flash={flash}
            />

            <PrizeBreakdown jackpot={jackpot} participantsCount={participants} />

            <EnterButton onEnter={handleEnter} disabled={drawPhase !== "idle"} isCritical={isCritical} hasEntered={hasEntered} />
          </div>

          {/* RIGHT — Feed + History (40%) */}
          <div
            className="w-full lg:w-[40%] flex flex-col lg:pl-12 xl:pl-16 py-8 lg:py-10 gap-6 transition-all duration-700 mt-8 lg:mt-0 lg:border-l lg:border-border/30"
            style={{
              opacity: assembled ? 1 : 0,
              transform: assembled ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "200ms",
            }}
          >
            {/* Tab switcher */}
            <div className="flex gap-0 border-b border-border">
              <button
                onClick={() => setRightTab("feed")}
                className={`font-mono text-[10px] tracking-[0.2em] uppercase px-4 py-2 transition-all duration-300 border-b-2 ${rightTab === "feed"
                  ? "text-silver-bright border-silver-bright"
                  : "text-muted-foreground border-transparent hover:text-silver"
                  }`}
              >
                WHO&apos;S IN
              </button>
              <button
                onClick={() => setRightTab("history")}
                className={`font-mono text-[10px] tracking-[0.2em] uppercase px-4 py-2 transition-all duration-300 border-b-2 ${rightTab === "history"
                  ? "text-silver-bright border-silver-bright"
                  : "text-muted-foreground border-transparent hover:text-silver"
                  }`}
              >
                PAST DRAWS
              </button>
            </div>

            {/* Tab content */}
            <div className="flex-1 min-h-0 overflow-hidden">
              {rightTab === "feed" ? (
                <ParticipantsFeed entries={entries} participantCount={participants} />
              ) : (
                <PastDraws draws={pastDraws} />
              )}
            </div>

            <StatsCards
              participants={participants}
              ticketPrice={TICKET_PRICE}
              timeLeft={timeLeft}
              isCritical={isCritical}
              isUrgent={isUrgent}
            />
          </div>
        </div>
      </div>


      <DrawOverlay
        phase={drawPhase}
        winners={winners}
        round={round}
        jackpot={jackpot}
        missedAmount={winners[0]?.amount}
        hasEntered={hasEntered}
      />
    </div>
  );
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
