"use client";

import { Flame, Users } from "lucide-react";

export interface ParticipantEntry {
    id: string;
    address: string;
    amount: number;
    timeAgo: string;
    isNew: boolean;
    isYou?: boolean;
}

interface ParticipantsFeedProps {
    entries: ParticipantEntry[];
    participantCount: number;
}

export default function ParticipantsFeed({ entries, participantCount }: ParticipantsFeedProps) {
    return (
        <div className="flex flex-col h-full">
            <h3 className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] uppercase text-silver mb-3">
                <Users size={12} strokeWidth={1.5} className="text-muted-foreground/60" />
                WHO&apos;S IN
            </h3>

            <div className="flex-1 overflow-hidden relative">
                <div className="space-y-0.5">
                    {entries.slice(0, 7).map((entry, i) => (
                        <div
                            key={entry.id}
                            className="flex items-center gap-3 font-mono text-[11px] py-1.5 px-2 transition-all duration-500"
                            style={{
                                opacity: 1 - i * 0.1,
                                animation: entry.isNew ? "slide-down-in 0.3s ease-out" : undefined,
                                borderLeft: entry.isNew
                                    ? "2px solid hsl(0 0% 94%)"
                                    : "2px solid transparent",
                                transition: "border-color 3s ease-out",
                            }}
                        >
                            <span className={entry.isYou ? "text-silver-bright font-bold" : "text-muted-foreground"}>
                                {entry.isYou ? "YOU" : entry.address}
                            </span>
                            <span className="text-silver ml-auto">{entry.amount.toFixed(0)} STT</span>
                            <span className="text-muted-foreground text-[9px]">{entry.timeAgo}</span>
                        </div>
                    ))}
                </div>

                {/* Fade at bottom */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
                    style={{ background: "linear-gradient(transparent, hsl(0 0% 2%))" }}
                />
            </div>

            {/* Social proof */}
            <div className="mt-3 pt-3 border-t border-border">
                <p className="flex items-center gap-2 font-mono text-[10px] text-silver tracking-wide">
                    <Flame size={12} className="text-[#f8c210]" />
                    <span>
                        <span className="text-silver-bright font-bold">{participantCount.toLocaleString()}</span> players joined this round
                    </span>
                </p>
            </div>
        </div>
    );
}
