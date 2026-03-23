"use client";

import { useEffect, useRef, useState } from "react";

interface DoubleWheelProps {
    spinToNumber: number | null;
    isSpinning: boolean;
    timeLeft: number;
    lastWinner?: { number?: number; color: number } | null;
}

const PATTERN = [1, 14, 2, 13, 3, 12, 4, 0, 11, 5, 10, 6, 9, 7, 8];

const getColorClass = (num: number) => {
    if (num === 0) return "bg-white text-black border border-black";
    if (num >= 1 && num <= 7) return "bg-[#CC1111] border border-white/20 text-white";
    return "bg-[#0A0A0F] border border-white/20 text-white"; 
};

export default function DoubleWheel({ spinToNumber, isSpinning, timeLeft, lastWinner }: DoubleWheelProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState(0);
    const [transition, setTransition] = useState("none");
    const [items, setItems] = useState<number[]>([]);

    useEffect(() => {
        const generatedPool = [];
        for (let i = 0; i < 5; i++) {
            generatedPool.push(...PATTERN);
        }
        setItems(generatedPool);
    }, []);

    useEffect(() => {
        if (!isSpinning && spinToNumber === null) {
            setTransition("none");
            setOffset(0);
        } else if (isSpinning && spinToNumber !== null && trackRef.current) {
            const baseIndex = PATTERN.length * 3; 
            const targetOffsetInPattern = PATTERN.indexOf(spinToNumber);
            const absoluteIndex = baseIndex + targetOffsetInPattern;

            const ITEM_WIDTH = 96 + 8; // w-24 handles 96px width + gap-2 handles 8px
            
            const trackCenter = trackRef.current.parentElement ? trackRef.current.parentElement.clientWidth / 2 : 500;
            const targetPos = (absoluteIndex * ITEM_WIDTH) + 48 - trackCenter;
            
            const rand = Math.random() * 50 - 25;

            setTransition("transform 5.5s cubic-bezier(0.15, 0.9, 0.25, 1)");
            setOffset(-(targetPos + rand));
        }
    }, [isSpinning, spinToNumber]);

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-6xl relative">
                {/* Laser Pointer */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[#F0F0F0] z-30 -translate-x-1/2 drop-shadow-[0_0_15px_#F0F0F0]">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-[#F0F0F0]"></div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-[#F0F0F0]"></div>
                </div>
                
                {/* The Slide Track */}
                <div 
                    className="flex overflow-hidden border-y border-white/10 py-4 bg-[#0A0A0F]/40 relative h-40 mask-linear-fade"
                    style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" }}
                >
                    <div 
                        ref={trackRef}
                        className="flex items-center absolute left-0 h-full"
                        style={{
                            transform: `translateX(${offset}px)`,
                            transition,
                            gap: "8px",
                            willChange: "transform"
                        }}
                    >
                        {items.map((num, i) => (
                            <div 
                                key={i} 
                                className={`shrink-0 flex items-center justify-center w-24 h-32 ${getColorClass(num)}`}
                            >
                                <span className="font-bebas-neue text-4xl tracking-widest leading-none drop-shadow-md">{num}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Draw Lock Down Timer Overlay */}
                {!isSpinning && timeLeft > 0 && timeLeft <= 15 && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40 transition-all">
                        <div className="flex flex-col items-center">
                            <span className="font-bebas-neue text-6xl text-[#CC1111] animate-pulse tracking-widest">{timeLeft}</span>
                            <span className="font-mono text-xs text-white/60 tracking-widest uppercase mt-2">ROLLING IN</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Previous Winner Display */}
            <div className="mt-4 text-center min-h-[70px]">
                {lastWinner && (
                    <div className="font-bebas-neue text-[60px] leading-none tracking-widest text-[#F0F0F0] opacity-80 transition-all fade-in">
                        {lastWinner.number !== undefined && (
                             <span className={lastWinner.color === 1 ? "text-[#CC1111]" : lastWinner.color === 3 ? "text-black drop-shadow-[0_0_10px_white]" : "text-white/40"}>
                                 {lastWinner.number}
                             </span>
                        )}
                        {" "}
                        {lastWinner.color === 1 ? "RED" : lastWinner.color === 3 ? "WHITE" : "BLACK"}
                        {" "}
                        <span className="text-white/20">{lastWinner.color === 3 ? "x14" : "x2"}</span>
                    </div>
                )}
                <div className="font-mono text-[9px] tracking-[0.4em] text-white/30 uppercase mt-1">Previous Winner</div>
            </div>
        </div>
    );
}
