"use client";

import { History } from "lucide-react";

export interface DoubleHistoryResult {
    id: number;
    roundId: number;
    color: number;
}

interface DoubleHistoryDotsProps {
    results: DoubleHistoryResult[];
}

export default function DoubleHistoryDots({ results }: DoubleHistoryDotsProps) {
    const getColorClass = (colorId: number) => {
        if (colorId === 1) return "bg-[#e53935] shadow-[0_0_10px_#e5393560]";
        if (colorId === 3) return "bg-white shadow-[0_0_10px_#ffffff60]";
        if (colorId === 2) return "bg-[#252528] border border-white/20";
        return "bg-transparent";
    };

    return (
        <div className="w-full flex items-center bg-black/40 border border-white/5 rounded-lg px-4 py-3 no-scrollbar overflow-x-auto min-h-[64px]">
            <div className="flex items-center gap-3 w-full">
                <History size={14} className="text-muted-foreground/60 shrink-0" />
                <div className="w-px h-4 bg-white/10 shrink-0" />
                <div className="flex items-center overflow-visible">
                    {/* Render dots from older to newest (assuming array is older to newest) */}
                    {results.length === 0 && (
                        <span className="text-xs font-mono text-muted-foreground ml-3">Waiting for rounds...</span>
                    )}
                    <div className="flex items-center pt-2">
                        {results.slice().reverse().map((res, i) => {
                            const isLatest = i === 0;
                            return (
                                <div key={`${res.roundId}-${i}`} className="relative flex items-center justify-center p-2">
                                    {isLatest && (
                                        <>
                                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[5px] border-t-white/80 filter drop-shadow-[0_0_2px_rgba(255,255,255,0.4)] animate-bounce" />
                                            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 font-mono text-[6px] text-white/40 tracking-tighter">NOW</span>
                                        </>
                                    )}
                                    <div
                                        className={`w-4.5 h-4.5 rounded-full shrink-0 transition-all duration-500 hover:scale-125 cursor-pointer ${getColorClass(res.color)} ${isLatest ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#080808] z-10 animate-pulse-white' : ''}`}
                                        title={`Round ${res.roundId}`}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
