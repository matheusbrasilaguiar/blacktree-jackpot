"use client";

import { useEffect, useState } from "react";
import BlackTreeLogo from "./BlackTreeLogo";

interface CinematicIntroProps {
    onComplete: () => void;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
    const [phase, setPhase] = useState<"black" | "logo" | "subtitle" | "exit">("black");
    const [logoWidth, setLogoWidth] = useState(240);

    useEffect(() => {
        const updateWidth = () => {
            setLogoWidth(window.innerWidth < 640 ? 220 : 320);
        };
        updateWidth();
        window.addEventListener("resize", updateWidth);

        const t0 = setTimeout(() => setPhase("logo"), 300);
        const t1 = setTimeout(() => setPhase("subtitle"), 1200);
        const t2 = setTimeout(() => setPhase("exit"), 2200);
        const t3 = setTimeout(() => onComplete(), 2900);
        return () => { 
            window.removeEventListener("resize", updateWidth);
            clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); 
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    return (
        <div
            className="fixed inset-0 z-200 flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-700"
            style={{ opacity: phase === "exit" ? 0 : 1 }}
        >
            <div
                className="transition-all duration-1000 flex flex-col items-center gap-6 px-6 text-center"
                style={{
                    opacity: phase === "black" ? 0 : 1,
                    transform: phase === "black" ? "scale(0.9) translateY(10px)" : "scale(1) translateY(0)",
                }}
            >
                <div className="relative">
                    <BlackTreeLogo svgWidth={logoWidth} />
                    <div className="absolute inset-0 bg-white/5 blur-[80px] rounded-full -z-10 animate-pulse"></div>
                </div>

                <div
                    className="font-mono text-[9px] sm:text-[11px] font-bold tracking-[0.2em] sm:tracking-[0.3em] text-silver/40 uppercase whitespace-nowrap transition-all duration-700 mt-2"
                    style={{
                        opacity: ["subtitle", "exit"].includes(phase) ? 1 : 0,
                        transform: ["subtitle", "exit"].includes(phase) ? "translateY(0)" : "translateY(5px)",
                    }}
                >
                    Your onchain iGaming Platform
                </div>
            </div>
        </div>
    );
}

