"use client";

import { DoubleHistoryResult } from "./DoubleHistoryDots";
import { DoubleBetEntry } from "./DoubleLiveFeed";

interface DoubleAnalyticsFooterProps {
    history: DoubleHistoryResult[];
    entries: DoubleBetEntry[]; // Active bets in current round
}

export default function DoubleAnalyticsFooter({ history, entries }: DoubleAnalyticsFooterProps) {
    const getColorClass = (colorId: number) => {
        if (colorId === 1) return "bg-[#CC1111]";
        if (colorId === 3) return "bg-white";
        if (colorId === 2) return "bg-[#0A0A0F] border border-white/20";
        return "bg-transparent";
    };

    // Calculate Latest 100 Analytics
    const last100 = history.slice(-100);
    const redCount = last100.filter(h => h.color === 1).length;
    const whiteCount = last100.filter(h => h.color === 3).length;
    const blackCount = last100.filter(h => h.color === 2).length;
    const totalCount = last100.length || 1; // avoid division by zero
    
    const pctRed = Math.round((redCount / totalCount) * 100);
    const pctWhite = Math.round((whiteCount / totalCount) * 100);
    const pctBlack = Math.round((blackCount / totalCount) * 100);

    // Calculate Streak Analytics
    let streakCount = 0;
    let streakColorId = 0;
    if (history.length > 0) {
        streakColorId = history[history.length - 1].color;
        for (let i = history.length - 1; i >= 0; i--) {
            if (history[i].color === streakColorId) {
                streakCount++;
            } else {
                break;
            }
        }
    }
    
    let streakLabel = "NONE";
    let streakColorClass = "text-white/40";
    if (streakColorId === 1) { streakLabel = "RED"; streakColorClass = "text-[#CC1111]"; }
    if (streakColorId === 2) { streakLabel = "BLACK"; streakColorClass = "text-white/40"; }
    if (streakColorId === 3) { streakLabel = "WHITE"; streakColorClass = "text-[#F0F0F0]"; }

    // Calculate active Pool Distribution
    const totalRedSTT = entries.filter(e => e.color === 1).reduce((sum, curr) => sum + curr.amount, 0);
    const totalWhiteSTT = entries.filter(e => e.color === 3).reduce((sum, curr) => sum + curr.amount, 0);
    const totalBlackSTT = entries.filter(e => e.color === 2).reduce((sum, curr) => sum + curr.amount, 0);
    const totalLockedSTT = totalRedSTT + totalWhiteSTT + totalBlackSTT;

    const poolPctRed = totalLockedSTT === 0 ? 0 : (totalRedSTT / totalLockedSTT) * 100;
    const poolPctWhite = totalLockedSTT === 0 ? 0 : (totalWhiteSTT / totalLockedSTT) * 100;
    const poolPctBlack = totalLockedSTT === 0 ? 0 : (totalBlackSTT / totalLockedSTT) * 100;

    return (
        <div className="w-full grid grid-cols-12 gap-6 mt-4 z-40">
            {/* Round History Block */}
            <div className="col-span-8 bg-[#0A0A0F]/80 backdrop-blur-md border border-[#F0F0F0]/10 rounded p-4 flex items-center justify-between">
                <div className="flex flex-col gap-2 pr-6 border-r border-white/10 overflow-x-hidden min-w-[200px]">
                    <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest shrink-0">History</span>
                    <div className="flex gap-1.5 shrink-0">
                        {history.length === 0 ? (
                            <span className="font-mono text-xs text-white/20">Waiting...</span>
                        ) : (
                            history.slice(-15).map((res, i) => (
                                <div
                                    key={`${res.roundId}-${i}`}
                                    className={`size-4 rounded-full ${getColorClass(res.color)}`}
                                    title={`Round ${res.roundId}`}
                                />
                            ))
                        )}
                    </div>
                </div>
                
                <div className="flex gap-8 px-6 drop-shadow-md">
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Last 100</span>
                        <div className="flex items-baseline gap-3">
                            <span className="font-bebas-neue text-2xl text-[#CC1111]">{pctRed}%</span>
                            <span className="font-bebas-neue text-2xl text-[#F0F0F0]">{pctWhite}%</span>
                            <span className="font-bebas-neue text-2xl text-white/40">{pctBlack}%</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 border-l border-white/10 pl-8">
                        <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Current Streak</span>
                        <span className={`font-bebas-neue text-2xl ${streakColorClass}`}>{streakCount > 0 ? `${streakCount} ${streakLabel}` : 'NONE'}</span>
                    </div>
                </div>
            </div>

            {/* Pools Bar */}
            <div className="col-span-4 bg-[#0A0A0F]/80 backdrop-blur-md border border-[#F0F0F0]/10 rounded p-4 flex flex-col justify-center gap-2">
                <div className="flex justify-between font-mono text-[9px] uppercase tracking-widest">
                    <span className="text-white/60">Pool Distribution</span>
                    <span className="text-white/80">{totalLockedSTT.toLocaleString()} STT LOCKED</span>
                </div>
                
                {/* Horizontal Progress Bar */}
                <div className="w-full h-1.5 flex gap-0.5 overflow-hidden rounded-full bg-white/5 border border-white/10">
                    <div className="h-full bg-[#CC1111] transition-all duration-700 ease-out" style={{ width: `${poolPctRed}%` }} />
                    <div className="h-full bg-[#F0F0F0] transition-all duration-700 ease-out" style={{ width: `${poolPctWhite}%` }} />
                    <div className="h-full bg-white/20 transition-all duration-700 ease-out" style={{ width: `${poolPctBlack}%` }} />
                </div>
                
                <div className="flex justify-between font-mono text-[8px] text-white/40 uppercase mt-1">
                    <span>Red: {totalRedSTT.toLocaleString()}</span>
                    <span>White: {totalWhiteSTT.toLocaleString()}</span>
                    <span>Black: {totalBlackSTT.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
