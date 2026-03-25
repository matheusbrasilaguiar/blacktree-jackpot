"use client";

import { useEffect, useState } from "react";
import LandingHero from "@/components/Landing/LandingHero";
import LandingHeader from "@/components/Landing/LandingHeader";
import LandingFeatures from "@/components/Landing/LandingFeatures";
import LandingGameShowcase from "@/components/Landing/LandingGameShowcase";
import LandingProtocol from "@/components/Landing/LandingProtocol";
import LandingFooter from "@/components/Landing/LandingFooter";
import ParticleBackground from "@/components/ParticleBackground";
import CometStreak from "@/components/CometStreak";

export default function LandingPage() {
    const [assembled, setAssembled] = useState(false);

    useEffect(() => {
        // Smooth entrance reveal
        setTimeout(() => setAssembled(true), 100);
    }, []);

    const [isGameSelectorOpen, setIsGameSelectorOpen] = useState(false);

    return (
        <div className="relative w-full bg-[#050505] selection:bg-[#CC1111]/40 font-sans">
            {/* Global Cinematic Elements */}
            <div className="fixed inset-0 pointer-events-none opacity-5 mix-blend-overlay noise-bg z-100"></div>
            <ParticleBackground />
            <CometStreak />

            <LandingHeader 
                isModalOpen={isGameSelectorOpen} 
                setIsModalOpen={setIsGameSelectorOpen} 
            />

            {/* Content Container */}
            <main 
                className="relative z-10 transition-all duration-1000 ease-out"
                style={{
                    opacity: assembled ? 1 : 0,
                    transform: assembled ? "translateY(0)" : "translateY(20px)",
                }}
            >
                <LandingHero />
                <LandingFeatures />
                <LandingGameShowcase onOpenModal={() => setIsGameSelectorOpen(true)} />
                <LandingProtocol onOpenModal={() => setIsGameSelectorOpen(true)} />
                <LandingFooter />
            </main>

            {/* Subtle Vignette */}
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-50"></div>
        </div>
    );
}
