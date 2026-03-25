"use client";

import { motion } from "framer-motion";

// ─────────────────────────────────────────
// LandingFeatures.tsx
// Copy: "TWO GAMES. ALWAYS LIVE." section
// Colors: white + red only. No gold.
// ─────────────────────────────────────────

const FEATURES = [
    {
        number: "01",
        title: "Fair by Design",
        description:
            "Results aren't decided by us. They're decided by the blockchain — in public, in real time, in front of everyone.",
        specs: ["No Rigged Logic", "Onchain RNG", "Publicly Auditable"],
    },
    {
        number: "02",
        title: "Live, Not Simulated",
        description:
            "Watch every bet, every player, every move happen live on your screen — as it hits the blockchain. This isn't a replay.",
        specs: ["Real-time Push", "Zero Polling", "Somnia Reactivity"],
    },
    {
        number: "03",
        title: "Instant Payouts",
        description:
            "Win and the money is in your wallet before you blink. No withdrawal forms. No 3-5 business days. No excuses.",
        specs: ["Direct to Wallet", "Same Block", "No Intermediaries"],
    },
];

export default function LandingFeatures() {
    return (
        <section id="features" className="relative py-32 px-6 flex flex-col items-center bg-[#050505]">

            {/* Section Title — Massive Cinematic */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="mb-32 text-center"
            >
                <span className="text-[12px] tracking-[0.6em] text-[#CC1111] uppercase mb-6 block font-mono">
                    Protocol Advantage
                </span>
                <h2 className="text-6xl md:text-8xl 2xl:text-9xl text-white uppercase tracking-tight leading-[0.85]"
                    style={{ fontFamily: "'Brigadier', sans-serif" }}>
                    Why<br />BlackTree
                </h2>
                <div className="mt-12 h-px w-24 bg-white/20 mx-auto" />
            </motion.div>

            {/* Cards grid */}
            <div className="max-w-[1400px] w-full grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.06] border border-white/[0.06]">
                {FEATURES.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.12, duration: 0.9 }}
                        className="group relative flex flex-col p-12 bg-[#050505] hover:bg-[#0a0505] transition-colors duration-700 overflow-hidden"
                    >
                        {/* Status dot */}
                        <div className="absolute top-8 right-8 w-1 h-1 bg-white/15 rounded-full group-hover:bg-[#CC1111] transition-colors duration-500" />

                        {/* Number */}
                        <span className="text-[11px] tracking-[0.4em] text-white/40 uppercase mb-8 block"
                            style={{ fontFamily: "'Space Mono', monospace" }}>
                            {feature.number}
                        </span>

                        {/* Title */}
                        <h3 className="text-3xl text-white uppercase tracking-[0.15em] mb-6 leading-tight"
                            style={{ fontFamily: "'Brigadier', sans-serif" }}>
                            {feature.title}
                        </h3>

                        {/* Description */}
                        <p className="text-[13px] text-white/70 leading-relaxed tracking-wide mb-12 max-w-[280px]"
                            style={{ fontFamily: "'Space Mono', monospace" }}>
                            {feature.description}
                        </p>

                        {/* Specs */}
                        <div className="mt-auto flex flex-col gap-3">
                            {feature.specs.map((spec, sidx) => (
                                <div key={sidx} className="flex items-center gap-3 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="w-2 h-px bg-white" />
                                    <span className="text-[10px] uppercase tracking-[0.3em] text-white"
                                        style={{ fontFamily: "'Space Mono', monospace" }}>
                                        {spec}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Corner decoration */}
                        <div className="absolute bottom-0 right-0 w-10 h-10 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                            <div className="absolute right-4 bottom-4 w-4 h-px bg-[#CC1111]" />
                            <div className="absolute right-4 bottom-4 w-px h-4 bg-[#CC1111]" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}