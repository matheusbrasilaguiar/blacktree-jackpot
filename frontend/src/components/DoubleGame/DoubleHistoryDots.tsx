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
        <div className="w-full flex items-center bg-black/40 border border-white/5 rounded-lg px-4 py-3 pb-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-3">
                <History size={14} className="text-muted-foreground/60 shrink-0" />
                <div className="w-px h-4 bg-white/10 shrink-0" />
                <div className="flex items-center gap-2">
                    {/* Render dots from older to newest (assuming array is older to newest) */}
                    {results.length === 0 && (
                        <span className="text-xs font-mono text-muted-foreground">Waiting for rounds...</span>
                    )}
                    {results.map((res, i) => (
                        <div
                            key={`${res.roundId}-${i}`}
                            className={`w-5 h-5 rounded-full shrink-0 transition-all duration-500 hover:scale-125 cursor-pointer ${getColorClass(res.color)}`}
                            title={`Round ${res.roundId}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
