"use client";

import { useMemo } from "react";

interface LiveTickerProps {
    frozen?: boolean;
}

export default function LiveTicker({ frozen = false }: LiveTickerProps) {
    const items = useMemo(() => [
        "0x7f2b...a44c entered · 5 STT · 2s ago",
        "ROUND #46 WINNER: 0x3a1c...f44b · 1,940 STT",
        "0x9c4f...b22a entered · 5 STT · 8s ago",
        "847 participants this round · jackpot growing",
        "0x4f3a...c91b entered · 5 STT · 12s ago",
        "ROUND #45 WINNER: 0xb8e2...1f3c · 2,105 STT",
        "whale.eth entered · 5 STT · 15s ago",
        "0x1d8c...e44a entered · 5 STT · 19s ago",
        "ROUND #44 WINNER: 0x6a2f...d91e · 1,755 STT",
        "degen.eth entered · 5 STT · 22s ago",
    ], []);

    const separator = " ◈ ";
    const fullText = items.join(separator) + separator;

    return (
        <div
            className="fixed bottom-0 left-0 right-0 h-[44px] z-40 flex items-center overflow-hidden bg-background"
            style={{ borderTop: "1px solid hsl(0 0% 15% / 0.2)" }}
        >
            <div
                className="whitespace-nowrap font-mono text-[11px] text-silver tracking-wide"
                style={{
                    animation: frozen ? "none" : "ticker-scroll 40s linear infinite",
                }}
            >
                <span>{fullText}</span>
                <span>{fullText}</span>
            </div>
        </div>
    );
}
