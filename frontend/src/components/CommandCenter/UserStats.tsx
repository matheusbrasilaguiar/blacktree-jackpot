"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { JACKPOT_CONTRACT_ADDRESS } from "@/hooks/useJackpotReactivity";
import { formatEther } from "viem";
import { ChartLine, Trophy, Flame } from "lucide-react";

// The ABI for JackpotWon is needed to fetch past events
const JACKPOT_WON_ABI = [
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "uint256", name: "roundId", type: "uint256" },
            { indexed: false, internalType: "address", name: "first", type: "address" },
            { indexed: false, internalType: "address", name: "second", type: "address" },
            { indexed: false, internalType: "address", name: "third", type: "address" },
            { indexed: false, internalType: "uint256", name: "totalPrize", type: "uint256" },
        ],
        name: "JackpotWon",
        type: "event",
    }
] as const;

export default function UserStats() {
    const { address: userAddress } = useAccount();
    const [totalWon, setTotalWon] = useState(0);
    const [luckyRounds, setLuckyRounds] = useState(0);

    useEffect(() => {
        if (!userAddress) return;

        const fetchStats = async () => {
            try {
                // Fetch stats directly from our new off-chain Indexer API
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/stats?address=${userAddress}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch from Indexer API');
                }
                const data = await response.json();

                setTotalWon(data.totalPaidOut || 0);
                setLuckyRounds(data.totalGames || 0);

            } catch (error) {
                console.error("Error fetching user stats from API:", error);
            }
        };

        fetchStats();
    }, [userAddress]); // Dependency array for useEffect

    return (
        <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col p-4 rounded-xl bg-linear-to-br from-white/5 to-transparent border border-white/5 backdrop-blur-sm">
                <span className="font-mono text-[10px] text-muted-foreground uppercase flex items-center gap-1.5 mb-1">
                    <ChartLine className="w-3 h-3" />
                    Total Won
                </span>
                <span className="font-display text-2xl text-silver-bright">
                    {Number(totalWon).toLocaleString(undefined, { maximumFractionDigits: 2 })} STT
                </span>
            </div>

            <div className="flex flex-col p-4 rounded-xl bg-linear-to-br from-white/5 to-transparent border border-white/5 backdrop-blur-sm">
                <span className="font-mono text-[10px] text-muted-foreground uppercase flex items-center gap-1.5 mb-1">
                    <Flame className="w-3 h-3 text-orange-400" />
                    Lucky Rounds
                </span>
                <span className="font-display text-2xl text-white">
                    {luckyRounds} <span className="text-sm text-muted-foreground">wins</span>
                </span>
            </div>
        </div>
    );
}
