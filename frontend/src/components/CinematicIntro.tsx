"use client";

import { useEffect, useState } from "react";
import BlackTreeLogo from "./BlackTreeLogo";

interface CinematicIntroProps {
    onComplete: () => void;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
    const [phase, setPhase] = useState<"black" | "logo" | "subtitle" | "exit">("black");

    useEffect(() => {
        const t0 = setTimeout(() => setPhase("logo"), 300);
        const t1 = setTimeout(() => setPhase("subtitle"), 1200);
        const t2 = setTimeout(() => setPhase("exit"), 2200);
        const t3 = setTimeout(() => onComplete(), 2900);
        return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }, [onComplete]); // Run only once on mount, but include onComplete in dependencies

    return (
        <div
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background transition-opacity duration-600"
            style={{ opacity: phase === "exit" ? 0 : 1 }}
        >
            <div
                className="transition-all duration-700"
                style={{
                    opacity: phase === "black" ? 0 : 1,
                    transform: phase === "black" ? "scale(0.8)" : "scale(1)",
                }}
            >
                <BlackTreeLogo size="large" bright />
            </div>

            <div
                className="font-mono text-[11px] tracking-[0.4em] text-muted-foreground uppercase mt-8 transition-all duration-500"
                style={{
                    opacity: ["subtitle", "exit"].includes(phase) ? 1 : 0,
                }}
            >
                THE ONCHAIN JACKPOT
            </div>
        </div>
    );
}
