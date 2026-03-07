"use client";

import { useState, useEffect, useRef } from "react";

interface Winner {
    address: string;
    amount: number;
    place: string;
}

interface DrawOverlayProps {
    phase: "idle" | "lockdown" | "selection" | "reveal" | "celebration" | "reset";
    winners: Winner[];
    round: number;
    jackpot: number;
    missedAmount?: number;
    hasEntered: boolean;
}

const randomAddr = () => {
    const hex = "0123456789abcdef";
    const s = Array.from({ length: 4 }, () => hex[Math.floor(Math.random() * 16)]).join("");
    const e = Array.from({ length: 4 }, () => hex[Math.floor(Math.random() * 16)]).join("");
    return `0x${s}...${e}`;
};

// Heartbeat visual effect
const Heartbeat = () => (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
            className="w-[300px] h-[300px] rounded-full border border-silver/10"
            style={{ animation: "heartbeat-ring 1.5s ease-out infinite" }}
        />
        <div
            className="absolute w-[200px] h-[200px] rounded-full border border-silver/15"
            style={{ animation: "heartbeat-ring 1.5s ease-out 0.3s infinite" }}
        />
    </div>
);

// Scanning lines effect
const ScanLines = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
            <div
                key={i}
                className="absolute left-0 right-0 h-px bg-silver/20"
                style={{
                    animation: `scan-line 2s linear ${i * 0.4}s infinite`,
                }}
            />
        ))}
    </div>
);

// Glitch text effect
const GlitchText = ({ text, className = "" }: { text: string; className?: string }) => {
    const [glitched, setGlitched] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setGlitched(true);
            setTimeout(() => setGlitched(false), 100);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <span className={`relative inline-block ${className}`}>
            <span className="relative z-10">{text}</span>
            {glitched && (
                <>
                    <span
                        className="absolute inset-0 text-danger/60 z-20"
                        style={{ transform: "translate(-2px, 1px)", clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)" }}
                    >
                        {text}
                    </span>
                    <span
                        className="absolute inset-0 text-silver/40 z-20"
                        style={{ transform: "translate(2px, -1px)", clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)" }}
                    >
                        {text}
                    </span>
                </>
            )}
        </span>
    );
};

// Data stream effect during selection
const DataStream = () => {
    const [addresses, setAddresses] = useState<string[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setAddresses(Array.from({ length: 12 }, () => randomAddr()));
        }, 60);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
            <div className="flex gap-8 opacity-20">
                {[0, 1, 2].map((col) => (
                    <div key={col} className="flex flex-col gap-1">
                        {addresses.slice(col * 4, col * 4 + 4).map((addr, i) => (
                            <span
                                key={`${col}-${i}`}
                                className="font-mono text-[10px] text-silver/60 block"
                                style={{ animation: "shake 0.06s infinite" }}
                            >
                                {addr}
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Winner reveal card
const WinnerCard = ({ winner, rank, show }: { winner: Winner; rank: number; show: boolean }) => {
    const isFirst = rank === 0;
    const isSecond = rank === 1;

    return (
        <div
            className="flex flex-col items-center transition-all duration-700"
            style={{
                opacity: show ? 1 : 0,
                transform: show
                    ? "translateY(0) scale(1)"
                    : "translateY(40px) scale(0.8)",
                transitionDelay: show ? "0ms" : "0ms",
            }}
        >
            {/* Place label */}
            <span
                className={`font-mono tracking-[0.4em] uppercase mb-2 ${isFirst ? "text-[11px] text-[#f8c210]" : "text-[9px] text-muted-foreground"
                    }`}
            >
                {winner.place}
            </span>

            {/* Address */}
            <span
                className={`font-display tracking-wider ${isFirst
                    ? "text-5xl text-silver-bright glow-silver-intense"
                    : isSecond
                        ? "text-3xl text-silver"
                        : "text-2xl text-silver/70"
                    }`}
                style={isFirst ? { animation: "winner-glow 2s ease-in-out infinite" } : undefined}
            >
                {winner.address}
            </span>

            {/* Amount */}
            <div className="relative mt-2">
                <span
                    className={`font-display ${isFirst
                        ? "text-6xl text-[#f8c210] glow-gold-accent"
                        : isSecond
                            ? "text-3xl text-[#f8c210]/80"
                            : "text-2xl text-[#f8c210]/60"
                        }`}
                    style={isFirst ? { fontSize: "clamp(48px, 8vw, 80px)" } : undefined}
                >
                    +{winner.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} STT
                </span>

                {/* Expanding glow ring on 1st place */}
                {isFirst && show && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                            className="w-full h-full rounded-full"
                            style={{
                                boxShadow: "0 0 60px hsl(40 55% 55% / 0.3), 0 0 120px hsl(40 55% 55% / 0.15)",
                                animation: "winner-bloom 3s ease-out forwards",
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default function DrawOverlay({ phase, winners, round, missedAmount, hasEntered }: DrawOverlayProps) {
    const [flashAddresses, setFlashAddresses] = useState<string[]>([]);
    const [revealIndex, setRevealIndex] = useState(-1);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showFomo, setShowFomo] = useState(false);
    const [lockdownText, setLockdownText] = useState("");
    const [selectionProgress, setSelectionProgress] = useState(0);
    const confettiRef = useRef<HTMLCanvasElement>(null);

    // Lockdown letter-by-letter reveal
    useEffect(() => {
        if (phase === "lockdown") {
            const text = "DRAW EXECUTING";
            let i = 0;
            setLockdownText("");
            const interval = setInterval(() => {
                if (i <= text.length) {
                    setLockdownText(text.slice(0, i));
                    i++;
                } else {
                    clearInterval(interval);
                }
            }, 80);
            return () => clearInterval(interval);
        }
    }, [phase]);

    // Selection address flicker + progress
    useEffect(() => {
        if (phase === "selection") {
            const interval = setInterval(() => {
                setFlashAddresses(Array.from({ length: 8 }, () => randomAddr()));
            }, 60);

            // Progress bar
            const startTime = Date.now();
            const duration = 4000;
            const progressInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                setSelectionProgress(Math.min(elapsed / duration, 1));
            }, 30);

            return () => {
                clearInterval(interval);
                clearInterval(progressInterval);
            };
        } else {
            setSelectionProgress(0);
        }
    }, [phase]);

    // Reveal sequence: 3rd → 2nd → 1st with longer pauses (or 2nd → 1st)
    useEffect(() => {
        if (phase === "reveal") {
            setRevealIndex(-1);
            if (winners.length === 2) {
                const t1 = setTimeout(() => setRevealIndex(1), 500);   // 2nd
                const t2 = setTimeout(() => setRevealIndex(0), 2000);  // 1st
                return () => { clearTimeout(t1); clearTimeout(t2); };
            } else {
                const t1 = setTimeout(() => setRevealIndex(2), 500);   // 3rd
                const t2 = setTimeout(() => setRevealIndex(1), 2000);  // 2nd
                const t3 = setTimeout(() => setRevealIndex(0), 3500);  // 1st
                return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase]);

    // Celebration confetti with canvas
    useEffect(() => {
        if (phase === "celebration") {
            setShowConfetti(true);
            const canvas = confettiRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const particles: Array<{
                x: number; y: number; vx: number; vy: number;
                size: number; color: string; rotation: number; rotSpeed: number;
                opacity: number;
            }> = [];

            for (let i = 0; i < 300; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: -Math.random() * canvas.height * 0.5,
                    vx: (Math.random() - 0.5) * 4,
                    vy: Math.random() * 3 + 2,
                    size: Math.random() * 6 + 2,
                    color: [
                        "hsl(40, 55%, 55%)",
                        "hsl(0, 0%, 78%)",
                        "hsl(0, 0%, 94%)",
                        "hsl(40, 55%, 70%)",
                        "hsl(0, 0%, 50%)",
                    ][Math.floor(Math.random() * 5)],
                    rotation: Math.random() * 360,
                    rotSpeed: (Math.random() - 0.5) * 10,
                    opacity: 1,
                });
            }

            let animFrame: number;
            const animate = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                let alive = false;
                particles.forEach((p) => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.05;
                    p.vx *= 0.99;
                    p.rotation += p.rotSpeed;
                    if (p.y > canvas.height * 0.7) p.opacity -= 0.02;

                    if (p.opacity > 0 && p.y < canvas.height) {
                        alive = true;
                        ctx.save();
                        ctx.globalAlpha = Math.max(0, p.opacity);
                        ctx.translate(p.x, p.y);
                        ctx.rotate((p.rotation * Math.PI) / 180);
                        ctx.fillStyle = p.color;
                        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                        ctx.restore();
                    }
                });
                if (alive) animFrame = requestAnimationFrame(animate);
            };
            animate();

            const t = setTimeout(() => setShowConfetti(false), 4000);
            return () => {
                cancelAnimationFrame(animFrame);
                clearTimeout(t);
            };
        }
    }, [phase]);

    // FOMO banner after reset
    useEffect(() => {
        if (phase === "reset" && !hasEntered && missedAmount) {
            setShowFomo(true);
            const t = setTimeout(() => setShowFomo(false), 5000);
            return () => clearTimeout(t);
        }
    }, [phase, hasEntered, missedAmount]);

    if (phase === "idle") return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Dark overlay with vignette */}
            <div
                className="absolute inset-0 transition-all duration-500"
                style={{
                    background: phase === "celebration"
                        ? "radial-gradient(circle at center, hsl(0 0% 2% / 0.85) 0%, hsl(0 0% 0% / 0.95) 100%)"
                        : "radial-gradient(circle at center, hsl(0 0% 2% / 0.92) 0%, hsl(0 0% 0% / 0.98) 100%)",
                }}
            />

            {/* Scan lines during lockdown */}
            {phase === "lockdown" && <ScanLines />}

            {/* Heartbeat during lockdown */}
            {phase === "lockdown" && <Heartbeat />}

            {/* Data stream during selection */}
            {phase === "selection" && <DataStream />}

            {/* Red sweep line in lockdown */}
            {phase === "lockdown" && (
                <div
                    className="absolute left-0 right-0 h-[2px] z-20"
                    style={{
                        background: "linear-gradient(90deg, transparent, hsl(8, 100%, 40%), transparent)",
                        animation: "red-sweep 2s ease-in-out forwards",
                    }}
                />
            )}

            {/* Corner markers */}
            {(phase === "lockdown" || phase === "selection") && (
                <>
                    <div className="absolute top-8 left-8 w-8 h-8 border-l border-t border-silver/30 z-10" style={{ animation: "fade-in 0.5s ease-out" }} />
                    <div className="absolute top-8 right-8 w-8 h-8 border-r border-t border-silver/30 z-10" style={{ animation: "fade-in 0.5s ease-out" }} />
                    <div className="absolute bottom-8 left-8 w-8 h-8 border-l border-b border-silver/30 z-10" style={{ animation: "fade-in 0.5s ease-out" }} />
                    <div className="absolute bottom-8 right-8 w-8 h-8 border-r border-b border-silver/30 z-10" style={{ animation: "fade-in 0.5s ease-out" }} />
                </>
            )}

            <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-3xl px-8">
                {/* LOCKDOWN */}
                {phase === "lockdown" && (
                    <div style={{ animation: "fade-in 0.5s ease-out" }}>
                        <GlitchText
                            text={lockdownText}
                            className="font-display text-7xl text-silver-bright tracking-wider"
                        />
                        <div className="flex items-center gap-3 justify-center mt-4">
                            <div className="w-2 h-2 rounded-full bg-[#e62208]" style={{ animation: "breathe-fast 0.5s ease-in-out infinite" }} />
                            <p className="font-mono text-[10px] tracking-[0.2em] text-[#e62208] uppercase">
                                on-chain · block #4,847,291 · somnia testnet
                            </p>
                        </div>
                    </div>
                )}

                {/* SELECTION */}
                {phase === "selection" && (
                    <div className="flex flex-col items-center gap-4">
                        <p className="font-display text-5xl text-silver-bright mb-2 tracking-wider"
                            style={{ animation: "pulse-silver 1s ease-in-out infinite" }}
                        >
                            SELECTING WINNERS
                        </p>

                        {/* Spinning addresses */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                            {flashAddresses.map((addr, i) => (
                                <span
                                    key={i}
                                    className="font-mono text-silver text-sm opacity-40"
                                    style={{
                                        animation: "shake 0.06s infinite",
                                        animationDelay: `${i * 10}ms`,
                                    }}
                                >
                                    {addr}
                                </span>
                            ))}
                        </div>

                        {/* Progress bar */}
                        <div className="w-80 h-[3px] bg-void mt-4 overflow-hidden relative">
                            <div
                                className="h-full bg-silver-bright absolute inset-y-0 left-0"
                                style={{
                                    width: `${selectionProgress * 100}%`,
                                    boxShadow: "0 0 10px hsl(var(--color-silver-bright) / 0.5)",
                                    transition: "width 0.03s linear",
                                }}
                            />
                        </div>
                        <p className="font-mono text-[9px] text-muted-foreground tracking-[0.15em] uppercase">
                            VERIFYING ON-CHAIN RANDOMNESS
                        </p>
                    </div>
                )}

                {/* REVEAL */}
                {phase === "reveal" && (
                    <div className="flex flex-col items-center gap-10" style={{ animation: "fade-in 0.3s ease-out" }}>
                        {/* Reveal in reverse order: 3rd at bottom, 1st at top */}
                        {winners.map((w, i) => (
                            <WinnerCard
                                key={i}
                                winner={w}
                                rank={i}
                                show={revealIndex !== -1 && revealIndex <= i}
                            />
                        )).reverse()}
                    </div>
                )}

                {/* CELEBRATION */}
                {phase === "celebration" && (
                    <div style={{ animation: "fade-in 0.5s ease-out" }} className="relative">
                        <p
                            className="font-display text-7xl text-silver-bright tracking-wider glow-silver-intense md:text-8xl"
                            style={{ animation: "winner-glow 1.5s ease-in-out infinite" }}
                        >
                            CONGRATULATIONS
                        </p>
                        <p className="font-mono text-[11px] text-[#f8c210]/80 tracking-[0.2em] mt-4 uppercase">
                            PRIZES DISTRIBUTED ON-CHAIN
                        </p>
                    </div>
                )}

                {/* RESET */}
                {phase === "reset" && (
                    <div className="flex flex-col items-center gap-4">
                        <div
                            className="font-display text-4xl text-silver-bright tracking-wider px-10 py-5 border border-border relative overflow-hidden"
                            style={{ animation: "slide-right-in 0.5s ease-out" }}
                        >
                            <span className="relative z-10">ROUND #{round} — NOW OPEN</span>
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: "linear-gradient(90deg, transparent, hsl(0 0% 78% / 0.05), transparent)",
                                    animation: "shimmer-sweep 2s ease-in-out",
                                }}
                            />
                        </div>
                        {showFomo && missedAmount && (
                            <div
                                className="flex flex-col items-center gap-2"
                                style={{ animation: "fade-in-up 0.5s ease-out" }}
                            >
                                <p className="font-mono text-xs text-[#e62208] tracking-wider uppercase">
                                    ⚠ YOU MISSED THIS ROUND
                                </p>
                                <p className="font-display text-3xl text-[#f8c210] glow-gold-accent">
                                    YOU COULD HAVE WON {missedAmount.toLocaleString("en-US", { minimumFractionDigits: 0 })} STT
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Canvas confetti */}
            {showConfetti && (
                <canvas
                    ref={confettiRef}
                    className="absolute inset-0 pointer-events-none z-20"
                />
            )}
        </div>
    );
}
