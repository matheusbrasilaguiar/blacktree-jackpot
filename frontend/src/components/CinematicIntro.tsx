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
    }, [onComplete]);

    return (
        <div
            className="fixed inset-0 z-200 flex flex-col items-center justify-center bg-background transition-opacity duration-600"
            style={{ opacity: phase === "exit" ? 0 : 1 }}
        >
            <div
                className="transition-all duration-700 flex flex-col items-center gap-4"
                style={{
                    opacity: phase === "black" ? 0 : 1,
                    transform: phase === "black" ? "scale(0.8)" : "scale(1)",
                }}
            >
                <BlackTreeLogo svgWidth={300} />

                <div
                    className="font-mono text-[12px] font-bold tracking-[0.2em] text-muted-foreground uppercase whitespace-nowrap transition-all duration-500"
                    style={{
                        opacity: ["subtitle", "exit"].includes(phase) ? 1 : 0,
                    }}
                >
                    Your onchain iGaming Platform
                </div>
            </div>
        </div>
    );
}

