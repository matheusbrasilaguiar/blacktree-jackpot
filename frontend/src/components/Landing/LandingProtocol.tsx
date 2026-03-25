"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// ─────────────────────────────────────────
// LandingProtocol.tsx
// "How to play" + CTA closer sections
// Copy: Website Copy v4.0
// Colors: white + red only. No gold.
// ─────────────────────────────────────────

const STEPS = [
    {
        number: "01",
        title: "Connect",
        description: "Open your Web3 wallet. Hit connect. That's your account. No email. No password. No KYC.",
    },
    {
        number: "02",
        title: "Choose",
        description: "Jackpot or Double. Both live. Both onchain. Both paying out right now.",
    },
    {
        number: "03",
        title: "Bet",
        description: "Pick your ticket or color. Watch the action unfold live on your screen in real time.",
    },
    {
        number: "04",
        title: "Win",
        description: "Results execute automatically onchain. Winnings go straight to your wallet. No forms. No delays.",
    },
];

interface LandingProtocolProps {
    onOpenModal: () => void;
}

export default function LandingProtocol({ onOpenModal }: LandingProtocolProps) {
    return (
        <>
            {/* ── HOW TO PLAY ── */}
            <section id="protocol" className="relative py-32 px-6 flex flex-col items-center bg-[#050505]">

                {/* Section Title — Massive Cinematic */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="mb-32 text-center"
                >
                    <span className="text-[12px] tracking-[0.6em] text-[#CC1111] uppercase mb-6 block font-mono">
                        Instant Onboarding
                    </span>
                    <h2 className="text-6xl md:text-8xl 2xl:text-9xl text-white uppercase tracking-tight leading-[0.85]"
                        style={{ fontFamily: "'Brigadier', sans-serif" }}>
                        How it<br />works
                    </h2>
                    <div className="mt-12 h-px w-24 bg-white/20 mx-auto" />
                </motion.div>

                {/* Steps */}
                <div className="max-w-[1400px] w-full grid grid-cols-1 md:grid-cols-4 gap-px bg-white/[0.06] border border-white/[0.06]">
                    {STEPS.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.9 }}
                            className="group relative flex flex-col p-10 bg-[#050505] hover:bg-[#0a0505] transition-colors duration-700"
                        >
                            {/* Step number — large, ghost */}
                            <div className="mb-8">
                                <span className="text-[11px] tracking-[0.4em] text-white/35 uppercase"
                                    style={{ fontFamily: "'Space Mono', monospace" }}>
                                    {step.number}
                                </span>
                                {/* Thin red accent line below number on hover */}
                                <div className="mt-2 h-px w-0 bg-[#CC1111] group-hover:w-8 transition-all duration-500" />
                            </div>

                            {/* Title */}
                            <h3 className="text-3xl text-white uppercase tracking-wide mb-5"
                                style={{ fontFamily: "'Brigadier', sans-serif" }}>
                                {step.title}
                            </h3>

                            {/* Description */}
                            <p className="text-[13px] text-white/75 leading-relaxed tracking-wide"
                                style={{ fontFamily: "'Space Mono', monospace" }}>
                                {step.description}
                            </p>

                            {/* Status dot */}
                            <div className="absolute top-8 right-8 w-1 h-1 rounded-full bg-white/10 group-hover:bg-[#CC1111] transition-colors duration-500" />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── FOMO CLOSER ── */}
            <section className="relative py-40 px-6 flex flex-col items-center overflow-hidden bg-[#050505]">

                {/* Atmosphere — crimson center bleed */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{
                        width: "800px", height: "500px",
                        background: "radial-gradient(ellipse, rgba(204,17,17,0.08) 0%, transparent 65%)",
                    }} />
                </div>

                {/* Film grain */}
                <div className="absolute inset-0 pointer-events-none" style={{
                    opacity: 0.025,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundSize: "180px",
                }} />

                <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">

                    {/* Main message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="mb-16"
                    >
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1, duration: 0.8 }}
                            className="text-[13px] tracking-[0.4em] text-white/60 uppercase mb-8"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                            Right now
                        </motion.p>

                        <motion.h2
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                            className="uppercase leading-[0.9] mb-6"
                            style={{ fontFamily: "'Brigadier', sans-serif" }}
                        >
                            <span className="block text-white" style={{ fontSize: "clamp(40px, 7vw, 100px)" }}>
                                The game is live.
                            </span>
                            <span className="block text-white/50 mt-2" style={{ fontSize: "clamp(28px, 5vw, 72px)" }}>
                                The round is open.
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-[13px] tracking-[0.3em] text-white/60 uppercase"
                            style={{ fontFamily: "'Space Mono', monospace" }}
                        >
                            The blockchain doesn&apos;t wait.
                        </motion.p>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, duration: 0.9 }}
                        className="flex flex-col items-center gap-5 w-full max-w-sm"
                    >
                        <button
                            onClick={onOpenModal}
                            className="group relative w-full overflow-hidden bg-white py-6 px-12 flex items-center justify-center gap-3 transition-all duration-500 hover:bg-white active:scale-[0.98] hover:scale-[1.02]"
                        >
                            <span className="relative z-10 text-black text-[12px] tracking-[0.5em] uppercase font-bold"
                                style={{ fontFamily: "'Space Mono', monospace" }}>
                                Start Playing Now
                            </span>
                            
                            {/* High-speed Shine Flare */}
                            <div className="absolute inset-0 w-[45%] h-full bg-linear-to-r from-transparent via-black/8 to-transparent -skew-x-25 -translate-x-[350%] group-hover:translate-x-[600%] transition-transform duration-1000 ease-in-out" />
                        </button>

                        <p className="text-[9px] tracking-[0.3em] text-white/35 uppercase"
                            style={{ fontFamily: "'Space Mono', monospace" }}>
                            Free to join · Instant payouts · Onchain forever
                        </p>
                    </motion.div>
                </div>
            </section>
        </>
    );
}