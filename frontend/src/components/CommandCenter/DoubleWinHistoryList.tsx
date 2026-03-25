"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { CircleDotDashed } from "lucide-react";

interface DoubleHistoryItem {
    roundId: number;
    betAmount: number;
    betColor: number;
    resultColor: number;
    timestamp: string;
    status: 'WON' | 'LOST' | 'PENDING';
    payout: number;
}

export default function DoubleWinHistoryList() {
    const { address: userAddress } = useAccount();
    const [history, setHistory] = useState<DoubleHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchHistory = async () => {
        if (!userAddress) return;
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/double/player-history?address=${userAddress}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch from API');
            const data = await response.json();
            setHistory(data);
        } catch (error) {
            console.error("Error fetching double history:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
        
        // Setup polling every 8s for live update feel
        const interval = setInterval(fetchHistory, 8000);
        return () => clearInterval(interval);
    }, [userAddress]);

    const getColorName = (c: number) => {
        if (c === 1) return "RED";
        if (c === 2) return "BLACK";
        if (c === 3) return "WHITE";
        return "UNKNOWN";
    };

    const getColorDot = (c: number) => {
        if (c === 1) return "bg-[#CC1111]";
        if (c === 2) return "bg-[#0a0a0a] ring-1 ring-white/10";
        if (c === 3) return "bg-white";
        return "bg-transparent ring-1 ring-white/20 border-dashed"; // Pending
    };

    if (!userAddress) {
        return (
            <div className="flex flex-col items-center justify-center py-8 opacity-50">
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest text-center mt-4">
                    Connect wallet to see<br/>Double history
                </span>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-3">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest px-2">RECENT DOUBLE BETS</span>
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-[72px] rounded-lg bg-white/5 animate-pulse" />
                ))}
            </div>
        );
    }

    if (history.length === 0) {
         return (
             <div className="flex flex-col items-center justify-center py-8 opacity-50 border border-dashed border-white/10 rounded-xl mt-4">
                 <CircleDotDashed className="w-8 h-8 text-silver/40 mb-3" />
                 <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest text-center">
                     No Double Bets<br/>found for this wallet
                 </span>
             </div>
         );
    }

    return (
        <div className="mt-8 flex flex-col gap-4">
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest px-2 flex items-center justify-between">
                <span>RECENT DOUBLE BETS</span>
                <span className="bg-white/10 px-2 py-0.5 rounded-full text-[9px]">{history.length}</span>
            </span>

            <div className="flex flex-col gap-3">
                {history.map((item, idx) => {
                    const isWin = item.status === 'WON';
                    const isPending = item.status === 'PENDING';
                    
                    return (
                        <div 
                            key={`${item.roundId}-${idx}`}
                            className={`flex justify-between items-center p-4 rounded-xl border relative overflow-hidden transition-colors ${
                                isWin ? 'bg-green-500/10 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.05)]' : 
                                isPending ? 'bg-white/5 border-white/10' :
                                'bg-white/5 border-white/5'
                            }`}
                        >
                            {/* Inner glow for wins */}
                            {isWin && <div className="absolute inset-0 bg-green-500/5 blur-xl block" />}

                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getColorDot(item.betColor)}`}>
                                   {/* If White, we want an inner visual maybe */}
                                </div>
                                
                                <div className="flex flex-col">
                                    <span className="font-display text-lg tracking-wide text-silver-bright">
                                        Round #{item.roundId}
                                    </span>
                                    <span className="font-mono text-[10px] text-muted-foreground mt-0.5">
                                        {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end relative z-10">
                                {isPending ? (
                                    <span className="font-bebas-neue text-xl text-yellow-400/80 drop-shadow-md">
                                        PENDING
                                    </span>
                                ) : isWin ? (
                                    <span className="font-bebas-neue text-2xl text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">
                                        +{item.payout.toLocaleString(undefined, { maximumFractionDigits: 2 })} STT
                                    </span>
                                ) : (
                                    <span className="font-bebas-neue text-xl text-silver/40">
                                        -{item.betAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} STT
                                    </span>
                                )}
                                <span className={`font-mono text-[9px] uppercase tracking-widest ${isWin ? 'text-green-500/60' : 'text-muted-foreground'}`}>
                                    BET ON {getColorName(item.betColor)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
