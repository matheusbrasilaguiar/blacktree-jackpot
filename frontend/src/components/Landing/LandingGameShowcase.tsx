"use client";

import { motion } from "framer-motion";
import BlackTreeLogo from "../BlackTreeLogo";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

// ── AUTHENTIC SLOT DIGIT ──
// ── AUTHENTIC JACKPOT COUNTER ──
const JackpotCounter = ({ value, isHovered }: { value: string; isHovered: boolean }) => {
    const [displayValue, setDisplayValue] = useState("0,000.00");
    const targetValue = parseFloat(value.replace(/,/g, ""));

    useEffect(() => {
        if (!isHovered) {
            setDisplayValue("0,000.00");
            return;
        }

        const duration = 1200; 
        const startTime = performance.now();

        const update = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const current = easedProgress * targetValue;
            
            setDisplayValue(current.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }));

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    }, [isHovered, targetValue]);

    const parts = displayValue.split(".");
    const integers = parts[0];
    const decimals = parts[1];

    return (
        <div className="flex items-baseline font-display text-7xl md:text-8xl text-white tracking-normal relative">
            <span className="drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">{integers}</span>
            <span className="text-[0.5em] opacity-40 ml-1">.{decimals}</span>
            <span className="text-[0.35em] ml-6 text-white/20 tracking-[0.2em] font-mono uppercase">STT</span>
        </div>
    );
};

// ─────────────────────────────────────────
// LandingGameShowcase.tsx
// Copy: game cards from Website Copy v4.0
// Colors: white + red only. No gold.
// ─────────────────────────────────────────

interface LandingGameShowcaseProps {
    onOpenModal: () => void;
}

export default function LandingGameShowcase({ onOpenModal }: LandingGameShowcaseProps) {
    const [jackpotHovered, setJackpotHovered] = useState(false);
    const [doubleHovered, setDoubleHovered] = useState(false);

    const jackpotValue = "2,450.00";

    return (
        <section id="games" className="relative py-32 px-6 flex flex-col items-center bg-[#050505]">

            {/* Section Title — Massive Cinematic */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="mb-32 text-center"
            >
                <span className="text-[12px] tracking-[0.6em] text-[#CC1111] uppercase mb-6 block font-mono">
                    Premium Selections
                </span>
                <h2 className="text-6xl md:text-8xl 2xl:text-9xl text-white uppercase tracking-tight leading-[0.85]"
                    style={{ fontFamily: "'Brigadier', sans-serif" }}>
                    The<br />Games
                </h2>
                <div className="mt-12 h-px w-24 bg-white/20 mx-auto" />
            </motion.div>

            {/* Game cards */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/6 border border-white/6"
            >

                {/* ── JACKPOT ── */}
                <div
                    onMouseEnter={() => setJackpotHovered(true)}
                    onMouseLeave={() => setJackpotHovered(false)}
                    className="group relative flex flex-col min-h-[700px] overflow-hidden bg-[#050505] transition-all duration-1000 border-r border-white/5 cursor-default"
                >
                    {/* Subtle Scanline Backdrop */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%] pointer-events-none opacity-20" />

                    {/* Micro-Visual Stage (JACKPOT) */}
                    <div className="relative h-[320px] flex items-center justify-center pt-8">
                        {/* Background Prize Pulse */}
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#CC1111]/5 blur-[80px] rounded-full transition-all duration-1000 ${jackpotHovered ? 'bg-[#CC1111]/15 scale-125' : ''}`} />

                        <div className="relative z-10 flex flex-col items-center">
                            {/* Premium Mechanical Chamber */}
                            <div className="relative group/chamber">
                                {/* Technical Corner Accents */}
                                <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-[#CC1111]/40" />
                                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-[#CC1111]/40" />
                                
                                <div className={`relative px-12 py-10 transition-all duration-700 backdrop-blur-xl border border-white/10 overflow-hidden ${jackpotHovered ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10'}`}>
                                    {/* Glass Reflection Overlay */}
                                    <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
                                    
                                    {/* HUD Scanline (Local) */}
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,white_2px,white_4px)]" />

                                    <JackpotCounter value={jackpotValue} isHovered={jackpotHovered} />
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mt-10">
                                <div className="flex gap-1.5">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${jackpotHovered ? 'bg-[#CC1111] animate-pulse' : 'bg-white/10'}`} style={{ animationDelay: `${i * 150}ms` }} />
                                    ))}
                                </div>
                                <span className="text-[10px] text-white/40 tracking-[0.6em] font-mono uppercase">AUTHENTICATED DRAW</span>
                                <div className="flex gap-1.5">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${jackpotHovered ? 'bg-[#CC1111] animate-pulse' : 'bg-white/10'}`} style={{ animationDelay: `${i * 150}ms` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Body (JACKPOT) */}
                    <div className="flex-1 p-12 flex flex-col justify-between relative z-10">
                        <div>
                            <div className="mb-6">
                                <span className="text-[10px] tracking-[0.5em] text-[#CC1111] uppercase mb-3 block font-bold" 
                                    style={{ fontFamily: "'Space Mono', monospace" }}>SYSTEM // DRAW</span>
                                <h3 className="text-7xl font-display text-white leading-none tracking-normal"
                                    style={{ fontFamily: "'Brigadier', sans-serif" }}>Jackpot</h3>
                            </div>

                            <p className="text-[15px] leading-relaxed text-white/80 max-w-sm mb-8"
                                style={{ fontFamily: "'Space Mono', monospace" }}>
                                Pick a ticket. Watch the prize grow. Three winners. One draw. Runs automatically onchain — no one controls the outcome.
                            </p>
                        </div>

                        <div className="flex flex-col gap-8">
                            {/* Breakdown HUD */}
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-4">
                                    {[
                                        { r: "1ST", v: "70%" },
                                        { r: "2ND", v: "20%" },
                                        { r: "3RD", v: "5%" },
                                    ].map((item) => (
                                        <div key={item.r} className="bg-white/2 border border-white/5 py-2 px-5 group-hover:border-white/10 transition-colors">
                                            <span className="text-[9px] text-white/30 block tracking-widest uppercase mb-1">{item.r}</span>
                                            <span className="text-sm text-white font-mono font-bold tracking-tighter">{item.v}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 px-1">
                                    <div className="w-1 h-1 rounded-full bg-[#CC1111]" />
                                    <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] font-mono">5% Platform Fee applied per draw</span>
                                </div>
                            </div>

                            {/* Direct Link to Jackpot */}
                            <Link 
                                href="/jackpot"
                                className="relative inline-flex items-center group/btn cursor-pointer w-fit"
                            >
                                <div className="h-14 border border-white/20 group-hover/btn:border-white/50 bg-white/5 px-10 flex items-center transition-all duration-500 overflow-hidden relative">
                                    <span className="text-[11px] text-white tracking-[0.4em] uppercase font-bold relative z-10"
                                        style={{ fontFamily: "'Space Mono', monospace" }}>
                                        Play Now
                                    </span>
                                    <div className="absolute inset-0 w-[40%] h-full bg-linear-to-r from-transparent via-white/10 to-transparent -skew-x-25 -translate-x-[400%] group-hover/btn:translate-x-[600%] transition-transform duration-1000 ease-in-out" />
                                </div>
                                <div className="flex items-center justify-center w-14 h-14 border-t border-r border-b border-white/20 group-hover/btn:border-white/50 transition-colors">
                                    <ChevronRight className="w-4 h-4 text-white/40 group-hover/btn:text-white transition-colors" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── DOUBLE ── */}
                <div
                    onMouseEnter={() => setDoubleHovered(true)}
                    onMouseLeave={() => setDoubleHovered(false)}
                    className="group relative flex flex-col min-h-[700px] overflow-hidden bg-[#050505] transition-all duration-1000 cursor-default"
                >
                    {/* Subtle Scanline Backdrop */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%] pointer-events-none opacity-20" />

                    {/* Micro-Visual Stage (DOUBLE) */}
                    <div className="relative h-[320px] flex flex-col items-center justify-center pt-8 overflow-hidden">
                        {/* Branded Wheel Track — Spinning on Hover */}
                        <div className="relative w-full flex items-center justify-center">
                            {/* Technical Corner Accents (Matching Jackpot) */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#CC1111]/40 z-10" />
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#CC1111]/40 z-10" />

                            {/* Masking container */}
                            <div className="w-full h-24 overflow-hidden relative flex items-center justify-center">
                                <motion.div 
                                    animate={doubleHovered ? { x: -448 * 2 } : { x: 0 }}
                                    transition={{ 
                                        duration: doubleHovered ? 8 : 1.2, 
                                        repeat: doubleHovered ? Infinity : 0, 
                                        ease: doubleHovered ? "linear" : [0.16, 1, 0.3, 1] 
                                    }}
                                    className="flex gap-2 shrink-0 absolute"
                                    style={{ width: '1792px', left: 'calc(50% - 220px)' }} // Offset to align a cell with center
                                >
                                    {[...Array(4)].map((_, setIdx) => (
                                        <div key={setIdx} className="flex gap-2 shrink-0" style={{ width: '440px' }}>
                                            {[
                                                { c: "#CC1111", n: 1 },
                                                { c: "#0a0a0a", n: 14 },
                                                { c: "#CC1111", n: 2 },
                                                { c: "#FFFFFF", n: 0 },
                                                { c: "#0a0a0a", n: 13 },
                                                { c: "#CC1111", n: 3 },
                                                { c: "#0a0a0a", n: 12 },
                                            ].map((cell, i) => (
                                                <div
                                                    key={i}
                                                    className="relative w-14 h-20 border border-white/5 flex items-center justify-center shadow-inner overflow-hidden shrink-0"
                                                    style={{ backgroundColor: cell.c }}
                                                >
                                                    <BlackTreeLogo 
                                                        onlyIcon 
                                                        svgWidth={22} 
                                                        color={cell.c === "#FFFFFF" ? "#050505" : "rgba(255,255,255,0.85)"} 
                                                    />
                                                    <span className={`absolute bottom-1 right-1 text-[7px] font-mono font-bold ${cell.c === "#FFFFFF" ? "text-black/30" : "text-white/20"}`}>
                                                        {cell.n}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </motion.div>
                            </div>

                            {/* Precision 1px Laser Indicator */}
                            <div className="absolute top-0 bottom-0 w-px bg-white z-20 shadow-[0_0_20px_white] pointer-events-none">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-white/20" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full transition-transform duration-500 scale-125" />
                            </div>
                        </div>

                        {/* Minimalist Data Strip (History) */}
                        <div className={`absolute bottom-12 flex items-center gap-6 bg-white/2 border border-white/5 px-8 py-2.5 backdrop-blur-md transition-all duration-700 ${doubleHovered ? 'opacity-100 border-white/20' : 'opacity-40 border-white/5'}`}>
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`w-1 h-1 rounded-full ${doubleHovered ? 'bg-[#CC1111] animate-pulse' : 'bg-white/10'}`} style={{ animationDelay: `${i * 150}ms` }} />
                                ))}
                            </div>
                            <span className="text-[10px] text-white/40 tracking-[0.4em] font-mono uppercase">LIVE FEED</span>
                        </div>
                    </div>

                    {/* Content Body (DOUBLE) */}
                    <div className="flex-1 p-12 flex flex-col justify-between relative z-10">
                        <div>
                            <div className="mb-6">
                                <span className="text-[10px] tracking-[0.5em] text-[#CC1111] uppercase mb-3 block font-bold" 
                                    style={{ fontFamily: "'Space Mono', monospace" }}>SYSTEM // MULTIPLY</span>
                                <h3 className="text-7xl font-display text-white leading-none tracking-normal"
                                    style={{ fontFamily: "'Brigadier', sans-serif" }}>Double</h3>
                            </div>

                            <p className="text-[15px] leading-relaxed text-white/80 max-w-sm mb-8"
                                style={{ fontFamily: "'Space Mono', monospace" }}>
                                Red. Black. White. Choose your color. 60 seconds. Watch every bet happen live. The blockchain decides the rest.
                            </p>
                        </div>

                        <div className="flex flex-col gap-8">
                            {/* Odds HUD */}
                            <div className="flex gap-4">
                                {[
                                    { c: "#CC1111", x: "x2" },
                                    { c: "#111", x: "x2" },
                                    { c: "#f0f0f0", x: "x14" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2.5 bg-white/2 border border-white/5 py-2 px-5 group-hover:border-white/10 transition-colors">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.c }} />
                                        <span className="text-sm text-white font-mono font-bold tracking-tighter">{item.x}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Direct Link to Double */}
                            <Link 
                                href="/double"
                                className="relative inline-flex items-center group/btn cursor-pointer w-fit"
                            >
                                <div className="h-14 border border-white/20 group-hover/btn:border-white/50 bg-white/5 px-10 flex items-center transition-all duration-500 overflow-hidden relative">
                                    <span className="text-[11px] text-white tracking-[0.4em] uppercase font-bold relative z-10"
                                        style={{ fontFamily: "'Space Mono', monospace" }}>
                                        Play Now
                                    </span>
                                    <div className="absolute inset-0 w-[40%] h-full bg-linear-to-r from-transparent via-white/10 to-transparent -skew-x-25 -translate-x-[400%] group-hover/btn:translate-x-[600%] transition-transform duration-1000 ease-in-out" />
                                </div>
                                <div className="flex items-center justify-center w-14 h-14 border-t border-r border-b border-white/20 group-hover/btn:border-white/50 transition-colors">
                                    <ChevronRight className="w-4 h-4 text-white/40 group-hover/btn:text-white transition-colors" />
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}