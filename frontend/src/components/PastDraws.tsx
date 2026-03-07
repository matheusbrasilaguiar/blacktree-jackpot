"use client";

import { useState } from "react";

export interface PastDraw {
    round: number;
    winners: { address: string; amount: number; place: string }[];
    totalPot: number;
    participants: number;
    timeAgo: string;
}

interface PastDrawsProps {
    draws: PastDraw[];
}

export default function PastDraws({ draws }: PastDrawsProps) {
    const [expanded, setExpanded] = useState<number | null>(null);

    return (
        <div className="flex flex-col h-full">
            <h3 className="font-mono text-[10px] tracking-[0.25em] uppercase text-silver mb-3 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-[#f8c210]/60 rounded-full" />
                PAST DRAWS
            </h3>

            <div className="flex-1 overflow-y-auto relative space-y-1 pr-2 pb-12">
                {draws.map((draw) => (
                    <div
                        key={draw.round}
                        className="group border border-border bg-void hover:border-silver-bright/30 transition-all duration-300 cursor-pointer"
                        onClick={() => setExpanded(expanded === draw.round ? null : draw.round)}
                    >
                        {/* Header row */}
                        <div className="flex items-center justify-between px-3 py-2">
                            <div className="flex items-center gap-2">
                                <span className="font-display text-sm text-muted-foreground">
                                    #{draw.round}
                                </span>
                                <span className="font-mono text-[9px] text-muted-foreground/60">
                                    {draw.timeAgo}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-display text-sm text-[#f8c210]">
                                    {draw.totalPot.toLocaleString("en-US", { minimumFractionDigits: 0 })} STT
                                </span>
                                <span className="font-mono text-[8px] text-muted-foreground">
                                    {draw.participants} players
                                </span>
                            </div>
                        </div>

                        {/* Expanded details */}
                        {expanded === draw.round && (
                            <div
                                className="px-3 pb-3 space-y-1.5 border-t border-border/50"
                                style={{ animation: "fade-in 0.2s ease-out" }}
                            >
                                {draw.winners.map((w, i) => (
                                    <div key={i} className="flex items-center justify-between py-1">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`font-display text-[10px] tracking-wider ${i === 0 ? "text-[#f8c210]" : "text-muted-foreground"
                                                    }`}
                                            >
                                                {w.place}
                                            </span>
                                            <span className="font-mono text-[10px] text-silver">
                                                {w.address}
                                            </span>
                                        </div>
                                        <span
                                            className={`font-display text-sm ${i === 0 ? "text-[#f8c210] glow-gold-accent" : "text-silver"
                                                }`}
                                        >
                                            +{w.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} STT
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
