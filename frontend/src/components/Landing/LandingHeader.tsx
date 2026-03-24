"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import BlackTreeLogo from "../BlackTreeLogo";
import { ChevronDown, LayoutGrid, Trophy, Disc, Menu, X } from "lucide-react";

interface LandingHeaderProps {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
}

export default function LandingHeader({ isModalOpen, setIsModalOpen }: LandingHeaderProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Scroll Lock & Esc Key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsModalOpen(false);
                setIsMobileMenuOpen(false);
            }
        };

        if (isModalOpen || isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleEsc);
        } else {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleEsc);
        }
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isModalOpen, isMobileMenuOpen]);

    const navLinks = [
        { name: "Why us", href: "#features" },
        { name: "How it works", href: "#protocol" },
    ];

    const games = [
        {
            name: "Jackpot",
            description: "Onchain prize draws",
            href: "/jackpot",
            icon: <Trophy className="w-4 h-4 text-white" />
        },
        {
            name: "Double",
            description: "Roulette multiplier",
            href: "/double",
            icon: <Disc className="w-4 h-4 text-[#CC1111]" />
        },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-100 transition-all duration-500 ${isScrolled ? "py-4 bg-black/60 backdrop-blur-xl border-b border-white/5" : "py-8 bg-transparent"
                    }`}
            >
                <div className="max-w-[1400px] mx-auto px-6 md:px-8 flex items-center justify-between">

                    {/* Logo & Section HUD */}
                    <div className="flex items-center gap-12">
                        <Link href="/" className="group flex items-center transition-transform hover:scale-105" onClick={() => setIsMobileMenuOpen(false)}>
                            <div className="hidden md:block">
                                <BlackTreeLogo svgWidth={90} />
                            </div>
                            <div className="md:hidden">
                                <BlackTreeLogo svgWidth={65} />
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-8">
                            <div
                                className="relative"
                                onMouseEnter={() => setIsDropdownOpen(true)}
                                onMouseLeave={() => setIsDropdownOpen(false)}
                            >
                                <button className="flex items-center gap-2 text-[10px] tracking-[0.4em] uppercase text-white/40 hover:text-white transition-colors py-2 group">
                                    Games
                                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-[#CC1111]' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {isDropdownOpen && !isModalOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 w-[280px] pt-4"
                                        >
                                            <div className="bg-[#0a0a0a] border border-white/10 p-5 shadow-2xl backdrop-blur-2xl">
                                                <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                                                    <span className="text-[8px] tracking-[0.3em] text-white/20 uppercase font-mono">Select Module</span>
                                                    <LayoutGrid className="w-3 h-3 text-[#CC1111]/40" />
                                                </div>

                                                <div className="grid gap-2">
                                                    {games.map((game) => (
                                                        <Link
                                                            key={game.name}
                                                            href={game.href}
                                                            className="group/game flex items-center gap-4 p-3 hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                                                        >
                                                            <div className="shrink-0 w-8 h-8 border border-white/10 flex items-center justify-center group-hover/game:border-[#CC1111]/40 transition-colors">
                                                                {game.icon}
                                                            </div>
                                                            <div>
                                                                <div className="text-[11px] tracking-widest uppercase text-white group-hover/game:text-[#CC1111] transition-colors">
                                                                    {game.name}
                                                                </div>
                                                                <div className="text-[9px] text-white/30 font-mono mt-0.5">
                                                                    {game.description}
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-[10px] tracking-[0.4em] uppercase text-white/40 hover:text-white transition-colors"
                                    style={{ fontFamily: "'Space Mono', monospace" }}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* System Controls */}
                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Live Badge - Hidden on very small screens */}
                        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 border border-white/10 bg-white/3 rounded-sm">
                            <span className="relative flex h-1 w-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-1 w-1 bg-green-400" />
                            </span>
                            <span className="text-[8px] tracking-[0.2em] text-white/40 uppercase font-mono">
                                Somnia Testnet
                            </span>
                        </div>

                        {/* Select Game Button - Desktop only */}
                        <button
                            onClick={() => {
                                setIsModalOpen(true);
                                setIsDropdownOpen(false);
                                setIsMobileMenuOpen(false);
                            }}
                            className="hidden lg:block group relative"
                        >
                            <div className="h-10 border border-white/20 group-hover:border-[#CC1111] bg-white/5 px-6 flex items-center transition-all duration-300">
                                <span className="text-[10px] text-white tracking-[0.3em] uppercase font-bold"
                                    style={{ fontFamily: "'Space Mono', monospace" }}>
                                    Select Game
                                </span>
                                <div className="w-1.5 h-1.5 ml-3 rounded-full bg-[#CC1111] animate-pulse" />
                            </div>
                        </button>

                        {/* Mobile Toggle HUD */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden w-10 h-10 border border-white/10 bg-white/5 flex items-center justify-center hover:border-[#CC1111] transition-colors"
                        >
                            {isMobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay - Outside Header to avoid Stacking Context issues */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-[#050505] z-[2000] flex flex-col lg:hidden"
                    >
                        {/* HUD Top Bar */}
                        <div className="flex items-center justify-between px-6 pt-8 pb-4 border-b border-white/5">
                            <BlackTreeLogo svgWidth={65} />
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-10 h-10 border border-white/10 bg-white/5 flex items-center justify-center hover:border-[#CC1111] transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* HUD Background Decoration */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden translate-z-0">
                            <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#CC1111]/[0.03] rounded-full blur-[100px]" />
                            <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-white/[0.02] rounded-full blur-[80px]" />
                        </div>

                        <div className="flex-1 overflow-y-auto px-8 py-10 relative z-10 flex flex-col">
                            <nav className="flex flex-col gap-12">
                                <div className="flex flex-col gap-6">
                                    <span className="text-[10px] tracking-[0.5em] text-[#CC1111] uppercase font-mono block opacity-60">Control Panel // Nav</span>
                                    <div className="flex flex-col gap-4">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="text-[13px] tracking-[0.4em] uppercase text-white/60 hover:text-white transition-all py-3 border-b border-white/5 flex justify-between items-center group"
                                                style={{ fontFamily: "'Space Mono', monospace" }}
                                            >
                                                {link.name}
                                                <div className="w-1 h-1 rounded-full bg-[#CC1111] opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-6">
                                    <span className="text-[10px] tracking-[0.5em] text-[#CC1111] uppercase font-mono block opacity-60">System // Modules</span>
                                    <div className="grid gap-3">
                                        {games.map((game) => (
                                            <Link
                                                key={game.name}
                                                href={game.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="group/m-game flex items-center justify-between p-6 border border-white/5 bg-white/[0.02] hover:border-[#CC1111]/40 hover:bg-[#CC1111]/5 transition-all"
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-12 border border-white/10 flex items-center justify-center group-hover/m-game:border-[#CC1111] transition-colors">
                                                        {game.icon}
                                                    </div>
                                                    <div>
                                                        <div className="text-[11px] font-bold tracking-[0.3em] text-white uppercase group-hover/m-game:text-[#CC1111] transition-colors">{game.name}</div>
                                                        <div className="text-[9px] text-white/30 font-mono tracking-wider mt-1">{game.description}</div>
                                                    </div>
                                                </div>
                                                <ChevronDown className="w-3 h-3 text-white/10 -rotate-90 group-hover/m-game:text-[#CC1111]" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Premium Game Choice Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[2000]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[2001] w-full max-w-2xl px-6"
                        >
                            <div className="bg-[#0a0a0a] border border-white/10 p-6 md:p-10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#CC1111]/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#CC1111]/40 to-transparent" />

                                <div className="flex justify-between items-center mb-8 md:mb-12">
                                    <div>
                                        <span className="text-[10px] tracking-[0.5em] text-[#CC1111] uppercase block mb-2 font-mono">Select Module</span>
                                        <h2 className="text-3xl md:text-4xl text-white uppercase tracking-tight" style={{ fontFamily: "'Brigadier', sans-serif" }}>Choose Game</h2>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-white/20 hover:text-white transition-colors uppercase text-[10px] tracking-widest font-mono border border-white/5 px-4 py-2 hover:bg-white/5"
                                    >
                                        Close
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    {games.map((game) => (
                                        <Link
                                            key={game.name}
                                            href={game.href}
                                            onClick={() => {
                                                setIsModalOpen(false);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="group/item relative bg-white/5 border border-white/5 p-6 md:p-8 transition-all hover:bg-[#CC1111]/5 hover:border-[#CC1111]/40"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-10 h-10 border border-white/10 flex items-center justify-center group-hover/item:border-[#CC1111] transition-colors">
                                                    {game.icon}
                                                </div>
                                                <ChevronDown className="w-4 h-4 text-white/10 group-hover/item:text-[#CC1111] -rotate-90 transition-all" />
                                            </div>
                                            <h3 className="text-xl text-white uppercase tracking-widest mb-2 font-bold">{game.name}</h3>
                                            <p className="text-[11px] text-white/40 font-mono leading-relaxed">{game.description}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
