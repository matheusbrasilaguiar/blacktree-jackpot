"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, LayoutDashboard } from "lucide-react";
import UserStats from "./UserStats";
import WinHistoryList from "./WinHistoryList";
import DoubleUserStats from "./DoubleUserStats";
import DoubleWinHistoryList from "./DoubleWinHistoryList";
import { useAccount } from "wagmi";

export function UserCommandCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'jackpot' | 'double'>('jackpot');
    const { address } = useAccount();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    // If not mounted, don't show the button to prevent hydration mismatch
    if (!mounted) {
        return <div className="w-10 h-10 border border-transparent" />;
    }

    return (
        <>
            {/* Toggle Button in TopBar */}
            <button
                onClick={() => setIsOpen(true)}
                className="relative group p-2.5 rounded-lg border border-white/5 bg-void transition-all hover:bg-white/5 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                title="Open Command Center"
            >
                <LayoutDashboard className="w-5 h-5 text-silver-bright/70 group-hover:text-silver-bright transition-colors" />

                {/* Notification Blip (Simulated for UX, could tie to actual new wins) */}
                {address && (
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                )}
            </button>

            {/* Backdrop and Sidebar Overlay */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-60 bg-void/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full sm:w-[400px] z-70 bg-void-dark border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col pt-8 pb-4"
                        >
                            {/* Drawer Header */}
                            <div className="px-6 flex items-center justify-between mb-8">
                                <h2 className="font-display text-2xl tracking-wide text-silver-bright">
                                    COMMAND CENTER
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-full hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto px-6 custom-scrollbar pb-10">
                                
                                {/* Segmented Tab Controller */}
                                <div className="flex p-1 mb-6 rounded-xl bg-void border border-white/5 relative">
                                    <button 
                                        onClick={() => setActiveTab('jackpot')}
                                        className={`flex-1 py-2 text-sm font-bebas-neue tracking-widest relative z-10 transition-colors ${activeTab === 'jackpot' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                                    >
                                        JACKPOT
                                        {activeTab === 'jackpot' && (
                                            <motion.div layoutId="activeTabPill" className="absolute inset-0 bg-white/10 rounded-lg -z-10 shadow-[0_0_10px_rgba(255,255,255,0.05)] border border-white/10" />
                                        )}
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('double')}
                                        className={`flex-1 py-2 text-sm font-bebas-neue tracking-widest relative z-10 transition-colors ${activeTab === 'double' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                                    >
                                        DOUBLE
                                        {activeTab === 'double' && (
                                            <motion.div layoutId="activeTabPill" className="absolute inset-0 bg-white/10 rounded-lg -z-10 shadow-[0_0_10px_rgba(255,255,255,0.05)] border border-white/10" />
                                        )}
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Main Widgets */}
                                    {activeTab === 'jackpot' ? <UserStats /> : <DoubleUserStats />}

                                    <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-4" />

                                    {activeTab === 'jackpot' ? <WinHistoryList /> : <DoubleWinHistoryList />}
                                </div>
                            </div>

                            {/* Decorative bottom fade */}
                            <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-void-dark to-transparent pointer-events-none" />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>,
            document.body
        )}
        </>
    );
}

// In the next step we will add UserCommandCenter to the TopBar.tsx
