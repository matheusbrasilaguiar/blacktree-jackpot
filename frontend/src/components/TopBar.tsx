"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BlackTreeLogo from "./BlackTreeLogo";
import CountdownTimer from "./CountdownTimer";
import ConnectWalletButton from "./ConnectWalletButton";
import { UserCommandCenter } from "./CommandCenter/UserCommandCenter";
import HeaderBalance from "./HeaderBalance";
import { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard, History, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UserStats from "./CommandCenter/UserStats";
import WinHistoryList from "./CommandCenter/WinHistoryList";
import DoubleUserStats from "./CommandCenter/DoubleUserStats";
import DoubleWinHistoryList from "./CommandCenter/DoubleWinHistoryList";

interface TopBarProps {
    timeLeft: number;
    totalTime: number;
    round: number;
    isUrgent: boolean;
    isCritical: boolean;
}

export default function TopBar({ timeLeft, totalTime, round, isUrgent, isCritical }: TopBarProps) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuTab, setMenuTab] = useState<'jackpot' | 'double'>('jackpot');

    // Sync tab with current page on mount or when menu opens
    useEffect(() => {
        if (pathname === '/double') {
            setMenuTab('double');
        } else {
            setMenuTab('jackpot');
        }
    }, [pathname, isMenuOpen]);

    return (
        <>
            <div
                className="fixed top-0 left-0 right-0 h-[64px] z-50 flex items-center justify-between lg:px-6 px-4 bg-black/60 backdrop-blur-md"
                style={{
                    borderBottom: isCritical
                        ? "1px solid hsl(var(--color-danger) / 0.4)"
                        : "1px solid hsl(0 0% 15% / 0.2)",
                    animation: isCritical ? "breathe-fast 1s ease-in-out infinite" : undefined,
                }}
            >
                {/* Logo Section */}
                <div className="flex items-center gap-2 lg:gap-6">
                    <Link href="/">
                        <div className="lg:block hidden">
                            <BlackTreeLogo size="medium" showTagline={false} />
                        </div>
                        <div className="lg:hidden block">
                            <BlackTreeLogo size="small" showTagline={false} onlyIcon />
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center p-0.5 bg-black/40 backdrop-blur-xl rounded-full border border-white/5 shadow-inner">
                        <Link 
                            href="/" 
                            className={`px-5 py-1.5 rounded-full font-mono text-[11px] tracking-widest transition-all duration-300 ${pathname === '/' ? 'bg-white/10 text-white border border-white/10' : 'text-white/30 hover:text-white/60'}`}
                        >
                            JACKPOT
                        </Link>
                        <Link 
                            href="/double" 
                            className={`px-5 py-1.5 rounded-full font-mono text-[11px] tracking-widest transition-all duration-300 ${pathname === '/double' ? 'bg-white/10 text-white border border-white/10' : 'text-white/30 hover:text-white/60'}`}
                        >
                            DOUBLE
                        </Link>
                    </nav>
                </div>

                {/* Status/Timer Section */}
                <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
                    {/* Timer - Always Visible */}
                    <div className="flex items-center gap-1.5 sm:gap-2 scale-90 sm:scale-100">
                        <div className="hidden xs:flex items-center gap-1.5 opacity-50">
                            <span className="font-mono text-[8px] tracking-widest text-muted-foreground uppercase">RD</span>
                            <span className="font-display text-sm text-silver-bright">#{round}</span>
                        </div>
                        <div className="w-px h-4 bg-white/10 hidden xs:block" />
                        <CountdownTimer
                            timeLeft={timeLeft}
                            totalTime={totalTime}
                            isCritical={isCritical}
                            isUrgent={isUrgent}
                        />
                    </div>

                    {/* Balance - Always Visible */}
                    <HeaderBalance />

                    {/* Desktop-Only Wallet & Command Center */}
                    <div className="hidden md:flex items-center gap-2">
                        <UserCommandCenter />
                        <ConnectWalletButton />
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-silver-bright/70 hover:text-white transition-colors"
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer (Integrated Command Center) */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm md:hidden"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full sm:w-[400px] z-70 bg-void-dark border-l border-white/10 shadow-2xl md:hidden flex flex-col pt-[64px]"
                        >
                            {/* Drawer Header */}
                            <div className="px-6 flex items-center justify-between mb-2">
                                <div className="flex flex-col">
                                    <span className="font-display text-2xl tracking-wide text-silver-bright uppercase">COMMAND CENTER</span>
                                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Live Performance</span>
                                </div>
                                <button 
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto px-6 space-y-8 pb-10 custom-scrollbar mt-4">
                                
                                {/* Segmented Tab Controller (Matching Desktop Exactly) */}
                                <div className="flex p-1 mb-6 rounded-xl bg-void border border-white/5 relative">
                                    <button 
                                        onClick={() => setMenuTab('jackpot')}
                                        className={`flex-1 py-2 text-sm font-bebas-neue tracking-widest relative z-10 transition-colors ${menuTab === 'jackpot' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                                    >
                                        JACKPOT
                                        {menuTab === 'jackpot' && (
                                            <motion.div layoutId="activeTabPill" className="absolute inset-0 bg-white/10 rounded-lg -z-10 shadow-[0_0_10px_rgba(255,255,255,0.05)] border border-white/10" />
                                        )}
                                    </button>
                                    <button 
                                        onClick={() => setMenuTab('double')}
                                        className={`flex-1 py-2 text-sm font-bebas-neue tracking-widest relative z-10 transition-colors ${menuTab === 'double' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                                    >
                                        DOUBLE
                                        {menuTab === 'double' && (
                                            <motion.div layoutId="activeTabPill" className="absolute inset-0 bg-white/10 rounded-lg -z-10 shadow-[0_0_10px_rgba(255,255,255,0.05)] border border-white/10" />
                                        )}
                                    </button>
                                </div>

                                {/* Active Stats & History */}
                                <div className="space-y-6">
                                    {menuTab === 'jackpot' ? (
                                        <>
                                            <UserStats />
                                            <div className="h-px bg-white/5" />
                                            <WinHistoryList />
                                        </>
                                    ) : (
                                        <>
                                            <DoubleUserStats />
                                            <div className="h-px bg-white/5" />
                                            <DoubleWinHistoryList />
                                        </>
                                    )}
                                </div>

                                {/* Account Section at Bottom */}
                                <div className="pt-6 border-t border-white/5 space-y-4">
                                    <Link 
                                        href="/" 
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${pathname === "/" ? "bg-[#CC1111]/10 border-[#CC1111]/30 text-[#CC1111]" : "border-white/5 text-white/40"}`}
                                    >
                                        <Trophy className="w-4 h-4" />
                                        <span className="font-bebas-neue tracking-widest text-lg">PLAY JACKPOT</span>
                                    </Link>
                                    <Link 
                                        href="/double" 
                                        onClick={() => setIsMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${pathname === "/double" ? "bg-[#D4A843]/10 border-[#D4A843]/30 text-[#D4A843]" : "border-white/5 text-white/40"}`}
                                    >
                                        <History className="w-4 h-4" />
                                        <span className="font-bebas-neue tracking-widest text-lg">PLAY DOUBLE</span>
                                    </Link>
                                    
                                    <div className="mt-8 p-1 bg-white/5 rounded-2xl border border-white/5">
                                        <ConnectWalletButton />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
