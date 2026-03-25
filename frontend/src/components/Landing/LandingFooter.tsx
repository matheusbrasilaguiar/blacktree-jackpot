"use client";

import BlackTreeLogo from "../BlackTreeLogo";

// ─────────────────────────────────────────
// LandingFooter.tsx
// Minimal, clean. No gold.
// ─────────────────────────────────────────

export default function LandingFooter() {
    return (
        <footer className="relative border-t border-white/[0.06] bg-[#050505] px-6 py-16">
            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-10">

                {/* Left — brand */}
                <div className="flex flex-col items-center md:items-start gap-5">
                    <BlackTreeLogo svgWidth={85} />
                    <p className="text-[11px] text-white/40 tracking-[0.25em] uppercase"
                        style={{ fontFamily: "'Space Mono', monospace" }}>
                        Your Onchain iGaming Platform
                    </p>
                </div>

                {/* Center — nav */}
                <div className="flex gap-10">
                    {[
                        { label: "Jackpot", href: "/jackpot" },
                        { label: "Double", href: "/double" },
                    ].map(({ label, href }) => (
                        <a key={label} href={href}
                            className="text-[12px] tracking-[0.3em] text-white/60 uppercase hover:text-white/90 transition-colors"
                            style={{ fontFamily: "'Space Mono', monospace" }}>
                            {label}
                        </a>
                    ))}
                </div>

                {/* Right — network badge */}
                <div className="flex items-center gap-2 px-4 py-2 border border-white/10">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
                    </span>
                    <span className="text-[10px] tracking-[0.25em] text-white/60 uppercase"
                        style={{ fontFamily: "'Space Mono', monospace" }}>
                        Built on Somnia
                    </span>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="max-w-[1400px] mx-auto mt-12 pt-6 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-3">
                <p className="text-[10px] tracking-[0.3em] text-white/50 uppercase"
                    style={{ fontFamily: "'Space Mono', monospace" }}>
                    © 2026 BlackTree
                </p>
                <p className="text-[10px] tracking-[0.3em] text-white/50 uppercase"
                    style={{ fontFamily: "'Space Mono', monospace" }}>
                    Fair. Live. Unstoppable.
                </p>
            </div>
        </footer>
    );
}