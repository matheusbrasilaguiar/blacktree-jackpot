"use client";

import { useEffect, useState } from "react";

interface JackpotDisplayProps {
    amount: number;
    isPulsing?: boolean;
    isShaking?: boolean;
    flash?: boolean;
}

const SlotDigit = ({ digit, rolling }: { digit: string; rolling: boolean }) => {
    const [displayDigit, setDisplayDigit] = useState(digit);
    const [isRolling, setIsRolling] = useState(false);

    useEffect(() => {
        if (digit !== displayDigit && rolling) {
            setIsRolling(true);
            const timeout = setTimeout(() => {
                setDisplayDigit(digit);
                setIsRolling(false);
            }, 200);
            return () => clearTimeout(timeout);
        } else {
            setDisplayDigit(digit);
            setIsRolling(false);
        }
    }, [digit, rolling, displayDigit]);

    if (digit === "," || digit === "." || digit === " ") {
        return <span className="inline-block">{digit}</span>;
    }

    return (
        <span className="inline-block overflow-hidden relative" style={{ width: "0.62em" }}>
            <span
                className="inline-block transition-transform duration-200 ease-out"
                style={{
                    transform: isRolling ? "translateY(-100%)" : "translateY(0)",
                    opacity: isRolling ? 0 : 1,
                }}
            >
                {displayDigit}
            </span>
        </span>
    );
};

export default function JackpotDisplay({ amount, isPulsing = false, isShaking = false, flash = false }: JackpotDisplayProps) {
    const formatted = amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const chars = formatted.split("");

    return (
        <div className="relative flex flex-col items-start justify-center w-full">
            {/* Flash */}
            {flash && (
                <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                        background: "radial-gradient(circle, hsla(0,0%,100%,0.06) 0%, transparent 70%)",
                        animation: "fade-in 0.08s ease-out",
                    }}
                />
            )}

            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-silver mb-3">
                CURRENT JACKPOT
            </span>

            <div
                className={`font-display leading-none text-silver-bright select-none whitespace-nowrap flex items-baseline ${isPulsing ? "animate-glow-pulse" : ""
                    } ${isShaking ? "animate-shake" : ""}`}
                style={{
                    fontSize: "clamp(60px, 9vw, 140px)",
                    filter: !isPulsing ? "drop-shadow(0 0 15px hsla(0,0%,94%,0.2))" : undefined,
                }}
                title="Updates live · no page refresh needed"
            >
                {chars.map((c, i) => (
                    <SlotDigit key={`${chars.length}-${i}`} digit={c} rolling={!isShaking} />
                ))}
                <span className="text-[0.45em] ml-4 md:ml-6 text-silver/80 tracking-normal mb-[0.1em]">STT</span>
            </div>
        </div>
    );
}
