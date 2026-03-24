"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import BlackTreeLogo from "../BlackTreeLogo";

// ─────────────────────────────────────────
// PARTICLE CANVAS
// ─────────────────────────────────────────
function ParticleCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();

        const particles = Array.from({ length: 140 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.0 + 0.2,
            dx: (Math.random() - 0.5) * 0.25,
            dy: (Math.random() - 0.5) * 0.25,
            opacity: Math.random() * 0.3 + 0.06,
        }));

        let frame: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(200, 200, 200, ${p.opacity})`;
                ctx.fill();
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            });
            frame = requestAnimationFrame(animate);
        };
        animate();

        window.addEventListener("resize", resize);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />
    );
}

// ─────────────────────────────────────────
// HERO
// ─────────────────────────────────────────
export default function LandingHero() {
    const scrollToGames = () => {
        document.getElementById("games")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050505]">

            <ParticleCanvas />

            {/* Atmosphere layers */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{
                    width: "900px", height: "900px",
                    background: "radial-gradient(circle, rgba(20,5,5,0.65) 0%, transparent 65%)",
                    borderRadius: "50%",
                }} />
                <div className="absolute bottom-0 left-0" style={{
                    width: "650px", height: "420px",
                    background: "radial-gradient(ellipse at bottom left, rgba(180,10,10,0.12) 0%, transparent 70%)",
                }} />
                <div className="absolute bottom-0 right-0" style={{
                    width: "650px", height: "420px",
                    background: "radial-gradient(ellipse at bottom right, rgba(180,10,10,0.07) 0%, transparent 70%)",
                }} />
            </div>

            {/* Film grain */}
            <div className="absolute inset-0 z-0 pointer-events-none" style={{
                opacity: 0.028,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundSize: "180px",
            }} />

            {/* HUD corners */}
            <div className="absolute top-8 left-8 w-12 h-12 border-l border-t border-white/10 pointer-events-none z-10" />
            <div className="absolute top-8 right-8 w-12 h-12 border-r border-t border-white/10 pointer-events-none z-10" />
            <div className="absolute bottom-8 left-8 w-12 h-12 border-l border-b border-white/10 pointer-events-none z-10" />
            <div className="absolute bottom-8 right-8 w-12 h-12 border-r border-b border-white/10 pointer-events-none z-10" />


            {/* ── MAIN CONTENT ── */}
            <div className="relative z-10 flex flex-col items-center text-center px-6">

                {/* Redundant Logo Removed — Handle in Header */}

                {/* ── HEADLINE
                    Brigadier usada SOMENTE aqui.
                    3 linhas, hierarquia clara:
                    "Your Onchain"  → branco puro, máxima presença
                    "iGaming"       → branco recuado, respira
                    "Platform."     → vermelho #CC1111, a cor da marca
                ── */}
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center uppercase mt-20"
                    style={{ fontFamily: "'Brigadier', sans-serif", lineHeight: "0.9" }}
                >
                    <motion.span
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="block text-white"
                        style={{
                            fontSize: "clamp(50px, 9.5vw, 140px)",
                            letterSpacing: "-0.01em",
                            textShadow: "0 0 80px rgba(255,255,255,0.05)",
                        }}
                    >
                        Your Onchain
                    </motion.span>

                    <motion.span
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.68, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="block text-white/65"
                        style={{
                            fontSize: "clamp(34px, 6.2vw, 92px)",
                            letterSpacing: "0.1em",
                        }}
                    >
                        iGaming
                    </motion.span>

                    <motion.span
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.86, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="block"
                        style={{
                            fontSize: "clamp(50px, 9.5vw, 140px)",
                            color: "#CC1111",
                            letterSpacing: "-0.01em",
                            textShadow: "0 0 60px rgba(204,17,17,0.18), 0 0 120px rgba(204,17,17,0.06)",
                        }}
                    >
                        Platform.
                    </motion.span>
                </motion.h1>

                {/* Subline */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1, duration: 1 }}
                    className="mt-10 text-[11px] tracking-[0.28em] text-white/45 uppercase max-w-xs"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                >
                    Fair results · Instant payouts
                </motion.p>

                {/* CTA Buttons — V10 Premium Overhaul */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.35, duration: 0.9 }}
                    className="mt-16 flex flex-col sm:flex-row gap-5 w-full max-w-lg"
                >
                    {/* PRIMARY — Massive, high-speed shine */}
                    <button
                        onClick={scrollToGames}
                        className="group relative flex-1 h-16 bg-white overflow-hidden flex items-center justify-center gap-3 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span className="relative z-10 text-black text-[12px] tracking-[0.45em] uppercase font-bold"
                            style={{ fontFamily: "'Space Mono', monospace" }}>
                            Play Now
                        </span>
                        <ChevronRight className="relative z-10 w-4 h-4 text-black group-hover:translate-x-1 transition-transform duration-500" />

                        {/* High-speed Shine Flare */}
                        <div className="absolute inset-0 w-[45%] h-full bg-linear-to-r from-transparent via-black/12 to-transparent -skew-x-25 -translate-x-[350%] group-hover:translate-x-[600%] transition-transform duration-1000 ease-in-out" />
                    </button>

                    {/* SECONDARY — Premium Glassmorphism */}
                    <button
                        onClick={scrollToGames}
                        className="group relative flex-1 h-16 border border-white/20 bg-white/4 backdrop-blur-xl overflow-hidden flex items-center justify-center transition-all duration-500 hover:border-white/50 hover:bg-white/8 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span className="relative z-10 text-white text-[12px] tracking-[0.45em] uppercase font-bold"
                            style={{ fontFamily: "'Space Mono', monospace" }}>
                            How it works
                        </span>

                        {/* Intense subtle shine */}
                        <div className="absolute inset-0 w-[40%] h-full bg-linear-to-r from-transparent via-white/10 to-transparent -skew-x-25 -translate-x-[350%] group-hover:translate-x-[600%] transition-transform duration-1000 ease-in-out" />

                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-[#CC1111]/80" />
                        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-[#CC1111]/80" />
                    </button>
                </motion.div>

                {/* Trust micro-copy */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.6, duration: 1 }}
                    className="mt-5 text-[9px] tracking-[0.3em] text-white/35 uppercase"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                >
                    No account · No KYC · Just your wallet
                </motion.p>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />
        </section>
    );
}