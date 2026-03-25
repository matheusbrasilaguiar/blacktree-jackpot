"use client";

import { useEffect, useRef, useState } from "react";
import BlackTreeLogo from "../BlackTreeLogo";

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
    return "bg-[#0a0a0a] border border-white/20 text-white"; 
};

export default function DoubleWheel({ spinToNumber, isSpinning, timeLeft, lastWinner }: DoubleWheelProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [offset, setOffset] = useState(0);
    const [transition, setTransition] = useState("none");
    const [items, setItems] = useState<number[]>([]);
    
    const lastResultRef = useRef<number | null>(null);
    const teleportTimerRef = useRef<NodeJS.Timeout | null>(null);
    
    // Pattern parameters
    const ITEM_WIDTH = 84; // 76px width + 8px gap
    const BUFFER_PATTERNS = 80; // Total 1200 items - massive safety
    
    // Helper to get consistent center
    const getTrackCenter = () => {
        if (trackRef.current?.parentElement) {
            return trackRef.current.parentElement.clientWidth / 2;
        }
        return 500; // Fallback
    };

    // 1. Initialize items array
    useEffect(() => {
        const pool = [];
        for (let i = 0; i < BUFFER_PATTERNS; i++) pool.push(...PATTERN);
        setItems(pool);
    }, []);

    // 2. Initial landing: Center on last winner OR 12 (if no history yet)
    // This effect ensures that when the page loads, the wheel is already at the correct position.
    useEffect(() => {
        if (!isInitialized && items.length > 0) {
            // We prioritize the last winner from history. 
            // If it's still null (loading history), we wait a bit or fallback.
            const targetNum = lastWinner?.number !== undefined ? lastWinner.number : 12;
            
            // If we don't have history yet and it's null, we might want to wait.
            // But if it's explicitly null, 12 is the "default" start.
            
            const center = getTrackCenter();
            const startIdx = (PATTERN.length * 10) + PATTERN.indexOf(targetNum);
            
            // Apply initial offset immediately without transition
            setTransition("none");
            setOffset(-(startIdx * ITEM_WIDTH + (ITEM_WIDTH / 2) - center));
            
            // If history is loaded, we mark as initialized.
            if (lastWinner !== null) {
                setIsInitialized(true);
            }
        }
    }, [lastWinner, items, isInitialized]);

    // 3. Handle the SPIN animation
    useEffect(() => {
        if (isSpinning && spinToNumber !== null && transition === "none") {
            // Store the result for the upcoming teleport
            lastResultRef.current = spinToNumber;
            
            // We use the functional update form of setOffset to avoid dependency on 'offset'
            setOffset(prevOffset => {
                const currentAbs = Math.abs(prevOffset);
                const patternsConsumed = Math.floor(currentAbs / (PATTERN.length * ITEM_WIDTH));
                
                // Move forward at least 15 patterns to ensure a long cinematic spin
                const targetPatternSegment = patternsConsumed + 15;
                const targetIdx = (targetPatternSegment * PATTERN.length) + PATTERN.indexOf(spinToNumber);
                
                const center = getTrackCenter();
                const targetPos = (targetIdx * ITEM_WIDTH) + (ITEM_WIDTH / 2) - center;
                const rand = Math.random() * 30 - 15;

                // We side-effect the transition change here
                setTransition("transform 5.5s cubic-bezier(0.12, 0.8, 0.15, 1)");
                return -(targetPos + rand);
            });
        }
    }, [isSpinning, spinToNumber, transition]); // offset removed, size remains constant

    // 4. Handle Teleportation (Keep it in a safe segment without user noticing)
    useEffect(() => {
        if (!isSpinning && lastResultRef.current !== null && transition !== "none") {
            if (teleportTimerRef.current) clearTimeout(teleportTimerRef.current);

            teleportTimerRef.current = setTimeout(() => {
                const targetNum = lastResultRef.current;
                if (targetNum === null) return;

                const center = getTrackCenter();
                const targetIdxInPattern = PATTERN.indexOf(targetNum);
                // Reset to segment 10 (same number, different segment, perfectly continuous)
                const homeIndex = (PATTERN.length * 10) + targetIdxInPattern;
                const homeOffset = -(homeIndex * ITEM_WIDTH + (ITEM_WIDTH / 2) - center);

                setTransition("none");
                setOffset(homeOffset);
                lastResultRef.current = null; 
            }, 6000); 
        }

        return () => {};
    }, [isSpinning]); 

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
                    className="flex overflow-hidden border-y border-white/10 py-2 bg-[#0a0a0a]/40 relative h-24"
                    style={{ 
                        maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                        WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
                    }}
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
                        {items.length > 0 && items.map((num, i) => (
                            <div 
                                key={`${i}-${num}`} 
                                className={`shrink-0 flex items-center justify-center w-[76px] h-20 ${getColorClass(num)} transition-colors duration-500 rounded-sm shadow-inner`}
                            >
                                <BlackTreeLogo 
                                    onlyIcon 
                                    svgWidth={28} 
                                    color={num === 0 ? "#050505" : "#E0E0DF"} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Phase Indicator & Global Timer - Fixed Height to Prevent Layout Shift */}
            <div className="mt-4 flex flex-col items-center justify-center w-full max-w-md mx-auto relative z-40 min-h-[70px]">
                {!isSpinning && timeLeft > 15 && (
                    <div className="w-full">
                        <div className="flex justify-between items-end w-full mb-2 px-1">
                            <span className="font-bebas-neue text-xl tracking-widest text-[#F0F0F0]">ACCEPTING BETS</span>
                            <span className="font-mono text-[10px] tracking-widest text-[#F0F0F0]"><span className="text-green-500 mr-1.5 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]">●</span>{timeLeft - 15}s TO CLOSE</span>
                        </div>
                        <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(34,197,94,0.4)]" style={{ width: `${Math.max(0, Math.min(100, ((timeLeft - 15) / 45) * 100))}%` }}></div>
                        </div>
                    </div>
                )}
                {!isSpinning && timeLeft <= 15 && timeLeft > 0 && (
                    <div className="w-full">
                        <div className="flex justify-between items-end w-full mb-2 px-1 animate-pulse">
                            <span className="font-bebas-neue text-xl tracking-widest text-[#CC1111] drop-shadow-[0_0_8px_rgba(204,17,17,0.5)]">BETS CLOSED</span>
                            <span className="font-mono text-[10px] tracking-widest text-white/50"><span className="text-[#CC1111] mr-1.5">●</span>ROLLING IN {timeLeft}s</span>
                        </div>
                        <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-[#CC1111] transition-all duration-1000 ease-linear shadow-[0_0_8px_rgba(204,17,17,0.4)]" style={{ width: `${Math.max(0, Math.min(100, (timeLeft / 15) * 100))}%` }}></div>
                        </div>
                    </div>
                )}
                {isSpinning && (
                    <div className="flex flex-col items-center animate-pulse pt-1">
                        <span className="font-bebas-neue text-xl tracking-widest text-[#D4A843] drop-shadow-[0_0_8px_rgba(212,168,67,0.5)]">VERIFYING HASH ONCHAIN...</span>
                        <div className="mt-3 w-48 h-px bg-linear-to-r from-transparent via-[#D4A843]/40 to-transparent" />
                    </div>
                )}
            </div>
        </div>
    );
}
