"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { ChartLine, Target, Flame } from "lucide-react";

export default function DoubleUserStats() {
    const { address: userAddress } = useAccount();
    const [totalWon, setTotalWon] = useState(0);
    const [totalGames, setTotalGames] = useState(0);
    const [winRate, setWinRate] = useState(0);

    useEffect(() => {
        if (!userAddress) return;

        const fetchStats = async () => {
            try {
                // Fetch stats directly from our structured Double API
                const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/double/player-stats?address=${userAddress}`;
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch from Indexer API');
                }
                const data = await response.json();

                setTotalWon(data.totalPaidOut || 0);
                setTotalGames(data.totalGames || 0);
                setWinRate(data.winRate || 0);

            } catch (error) {
                console.error("Error fetching double user stats from API:", error);
            }
        };

        fetchStats();
    }, [userAddress]);

    return (
        <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col p-4 rounded-xl bg-linear-to-br from-white/5 to-transparent border border-white/5 backdrop-blur-sm">
                <span className="font-mono text-[10px] text-muted-foreground uppercase flex items-center gap-1.5 mb-1">
                    <ChartLine className="w-3 h-3" />
                    Double Won
                </span>
                <span className="font-display text-2xl text-silver-bright">
                    {Number(totalWon).toLocaleString(undefined, { maximumFractionDigits: 2 })} STT
                </span>
            </div>

            <div className="flex flex-col p-4 rounded-xl bg-linear-to-br from-white/5 to-transparent border border-white/5 backdrop-blur-sm">
                <span className="font-mono text-[10px] text-muted-foreground uppercase flex items-center gap-1.5 mb-1">
                    <Target className="w-3 h-3 text-green-400" />
                    Win Rate
                </span>
                <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl text-white">
                        {winRate}%
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                        ({totalGames} games)
                    </span>
                </div>
            </div>
        </div>
    );
}
