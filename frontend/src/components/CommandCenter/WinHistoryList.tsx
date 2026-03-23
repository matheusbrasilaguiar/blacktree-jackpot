"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { JACKPOT_CONTRACT_ADDRESS } from "@/hooks/useJackpotReactivity";
import { formatEther } from "viem";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal } from "lucide-react";

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

interface WinRecord {
    id: string;
    position: 1 | 2 | 3;
    amount: string;
    timestamp: number;
}

export default function WinHistoryList() {
    const { address: userAddress } = useAccount();
    const [wins, setWins] = useState<WinRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!userAddress) return;

            setIsLoading(true);
            try {
                // Fetch directly from our fast new local indexer API 
                const response = await fetch('http://localhost:3001/api/v1/wins');
                if (!response.ok) {
                    throw new Error('Failed to fetch from Indexer API');
                }
                const data = await response.json();

                const historyItems: WinRecord[] = []; // Changed type to WinRecord[]
                const addr = userAddress.toLowerCase();

                for (const draw of data) {
                    if (draw.winner1.toLowerCase() === addr) {
                        historyItems.push({
                            id: draw.roundId.toString() + "-1",
                            amount: draw.winner1Prize,
                            position: 1,
                            timestamp: draw.timestamp,
                        });
                    }
                    if (draw.winner2 && draw.winner2.toLowerCase() === addr) {
                        historyItems.push({
                            id: draw.roundId.toString() + "-2",
                            amount: draw.winner2Prize,
                            position: 2,
                            timestamp: draw.timestamp,
                        });
                    }
                    if (draw.winner3 && draw.winner3.toLowerCase() === addr) {
                        historyItems.push({
                            id: draw.roundId.toString() + "-3",
                            amount: draw.winner3Prize,
                            position: 3,
                            timestamp: draw.timestamp,
                        });
                    }
                } // Ends the for loop

                // Enforce strict descending order to ensure the newest round is always at the top
                historyItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                setWins(historyItems);
            } catch (error) {
                console.error("Error fetching win history from API:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [userAddress]);

    if (!userAddress) return null;

    return (
        <div className="flex flex-col gap-4 mt-6">
            <h3 className="font-mono text-sm uppercase tracking-widest text-silver-bright flex items-center gap-2">
                <Medal className="w-4 h-4 text-green-500" />
                Your Glory
            </h3>

            {!userAddress ? (
                <div className="p-6 border border-white/5 rounded-lg bg-void-dark text-center">
                    <p className="font-mono text-xs text-muted-foreground uppercase">Connect wallet to view history</p>
                </div>
            ) : isLoading ? (
                <div className="flex flex-col gap-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 rounded-md bg-white/5 animate-pulse" />
                    ))}
                </div>
            ) : wins.length === 0 ? (
                <div className="p-6 border border-dashed border-white/10 rounded-lg bg-void-dark/50 text-center flex flex-col items-center gap-2">
                    <Trophy className="w-8 h-8 text-silver/20 mb-2" />
                    <p className="font-mono text-sm text-silver/60">No victories yet.</p>
                    <p className="font-mono text-xs text-muted-foreground">The tree awaits your offering.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    <AnimatePresence>
                        {wins.map((win, idx) => {
                            const colors =
                                win.position === 1
                                    ? {
                                        bg: "from-yellow-500/10 to-transparent",
                                        border: "border-yellow-500/20",
                                        iconBg: "bg-yellow-500/20",
                                        iconColor: "text-yellow-500",
                                        text: "text-yellow-400",
                                    }
                                    : win.position === 2
                                        ? {
                                            bg: "from-zinc-300/10 to-transparent",
                                            border: "border-zinc-300/20",
                                            iconBg: "bg-zinc-300/20",
                                            iconColor: "text-zinc-300",
                                            text: "text-zinc-200",
                                        }
                                        : {
                                            bg: "from-orange-700/10 to-transparent",
                                            border: "border-orange-700/20",
                                            iconBg: "bg-orange-700/20",
                                            iconColor: "text-orange-700",
                                            text: "text-orange-600",
                                        };
                            return (
                                <motion.div
                                    key={win.id}
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className={`flex items-center justify-between p-4 border rounded-xl bg-linear-to-br backdrop-blur-sm ${colors.bg} ${colors.border} transform transition-all hover:scale-[1.02] duration-300`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-full ${colors.iconBg} ${colors.iconColor} shadow-inner`}>
                                            <Medal className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`font-mono text-sm font-bold tracking-wider uppercase ${colors.text}`}>
                                                {win.position === 1 ? "1st" : win.position === 2 ? "2nd" : "3rd"} Place
                                            </span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="font-mono text-xs text-muted-foreground">Round {win.id.split('-')[0]}</span>
                                                <span className="w-1 h-1 rounded-full bg-border"></span>
                                                <span className="font-mono text-[10px] text-muted-foreground/50">
                                                    {win.timestamp ? new Date(win.timestamp).toLocaleDateString() : 'Recent'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className={`font-display text-xl sm:text-2xl ${colors.text}`}>
                                            +{Number(win.amount).toFixed(2)} <span className="text-sm">STT</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
