"use client";

import { useEffect, useState } from "react";

interface BlackTreeLogoProps {
    size?: "small" | "large";
    bright?: boolean;
}

export default function BlackTreeLogo({ size = "small", bright = false }: BlackTreeLogoProps) {
    const [pulsePhase, setPulsePhase] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setPulsePhase(true);
            setTimeout(() => setPulsePhase(false), 1500);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-3">
            {/* Placeholder tree logo */}
            <div className={`flex items-center justify-center border border-white/50 ${size === "large" ? "w-12 h-12" : "w-8 h-8"}`}
                style={{
                    filter: bright
                        ? "brightness(2) drop-shadow(0 0 20px rgba(200,200,200,0.5))"
                        : pulsePhase
                            ? "brightness(1.3) drop-shadow(0 0 8px rgba(200,200,200,0.2))"
                            : "brightness(0.9)",
                }}
            >
                <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[16px] border-b-white relative">
                    <div className="absolute top-[6px] -left-[3px] w-1.5 h-0.5 bg-black"></div>
                </div>
            </div>
            <span className="font-display text-2xl tracking-widest text-silver-bright">BLACKTREE</span>
        </div>
    );
}
