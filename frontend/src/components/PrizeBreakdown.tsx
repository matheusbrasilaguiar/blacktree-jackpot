"use client";

import { useEffect, useState } from "react";

interface PrizeBreakdownProps {
    jackpot: number;
    participantsCount: number;
}

const SlotAmount = ({ amount }: { amount: number }) => {
    const [display, setDisplay] = useState(amount);

    useEffect(() => {
        const start = display;
        const diff = amount - start;
        if (Math.abs(diff) < 0.01) return;
        const steps = 12;
        let step = 0;
        const interval = setInterval(() => {
            step++;
            setDisplay(start + diff * (step / steps));
            if (step >= steps) clearInterval(interval);
        }, 30);
        return () => clearInterval(interval);
    }, [amount, display]);

    return (
        <span>
            {display.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} STT
        </span>
    );
};

export default function PrizeBreakdown({ jackpot, participantsCount }: PrizeBreakdownProps) {
    let prizes = [];

    if (participantsCount === 1) {
        prizes = [
            { label: "ROLLOVER", pct: 100, amount: jackpot, rank: 1 },
        ];
    } else if (participantsCount === 2) {
        prizes = [
            { label: "1ST", pct: 75, amount: jackpot * 0.75, rank: 1 },
            { label: "2ND", pct: 20, amount: jackpot * 0.20, rank: 2 },
        ];
    } else {
        prizes = [
            { label: "1ST", pct: 70, amount: jackpot * 0.70, rank: 1 },
            { label: "2ND", pct: 20, amount: jackpot * 0.20, rank: 2 },
            { label: "3RD", pct: 5, amount: jackpot * 0.05, rank: 3 },
        ];
    }

    return (
        <div className="flex gap-[2px] mt-5 w-full">
            {prizes.map((p) => (
                <div
                    key={p.label}
                    className="relative bg-void border border-border px-3 py-3 text-center transition-all duration-500 overflow-hidden group hover:border-silver-bright"
                    style={{ flex: p.rank === 1 ? 2.5 : p.rank === 2 ? 1.5 : 1 }}
                >
                    {/* Rank badge */}
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                        <span
                            className={`font-display text-xs tracking-[0.15em] uppercase ${p.rank === 1 ? "text-gold-accent text-[#f8c210]" : "text-muted-foreground"
                                }`}
                        >
                            {p.label}
                        </span>
                        <span className="font-mono text-[8px] text-muted-foreground/60">
                            {p.pct}%
                        </span>
                    </div>

                    {/* Amount - animated */}
                    <span
                        className={`font-display block transition-all duration-300 ${p.rank === 1
                            ? "text-xl text-silver-bright glow-silver"
                            : p.rank === 2
                                ? "text-lg text-silver"
                                : "text-base text-silver/80"
                            }`}
                    >
                        <SlotAmount amount={p.amount} />
                    </span>

                    {/* Fill bar showing relative size */}
                    <div className="mt-2 h-[2px] w-full bg-border overflow-hidden">
                        <div
                            className={`h-full transition-all duration-700 ${p.rank === 1 ? "bg-gold-accent bg-[#f8c210]" : "bg-silver/30"
                                }`}
                            style={{ width: `${p.pct}%` }}
                        />
                    </div>

                    {/* Shimmer on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                            background: "linear-gradient(110deg, transparent 30%, hsl(var(--color-silver) / 0.08) 50%, transparent 70%)",
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
