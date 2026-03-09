"use client";

import { useAccount, useBalance } from "wagmi";
import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { motion, useSpring, useTransform } from "framer-motion";

export default function BalanceCounter() {
    const { address } = useAccount();
    const { data: balance } = useBalance({
        address,
        query: {
            refetchInterval: 5000, // Refetch every 5 seconds to show changes
        }
    });

    const [mounted, setMounted] = useState(false);

    // Provide a default value natively if undefined
    const numericBalance = balance ? parseFloat(formatUnits(balance.value, balance.decimals)) : 0;

    // Use a spring for smooth, cinematic number rolling
    const springValue = useSpring(numericBalance, {
        stiffness: 50,
        damping: 15,
        mass: 1,
    });

    // When balance updates, animate the spring to the new target
    useEffect(() => {
        if (mounted && balance) {
            springValue.set(numericBalance);
        }
    }, [numericBalance, mounted, springValue, balance]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    // Transform the raw spring float into a formatted string (e.g. 1,234.56)
    const displayBalance = useTransform(springValue, (latest) => {
        return latest.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
        });
    });

    if (!mounted) return <div className="h-10 animate-pulse bg-white/5 rounded-md" />;

    return (
        <div className="flex flex-col gap-1 p-4 rounded-xl border border-silver/10 bg-void-dark/80 backdrop-blur-md relative overflow-hidden group">
            {/* Subtle background glow effect */}
            <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                Available Balance
            </span>

            <div className="flex items-baseline gap-2">
                <motion.span
                    className="text-4xl font-display text-silver-bright tracking-tight"
                >
                    {address ? displayBalance : "0.00"}
                </motion.span>
                <span className="text-sm font-mono text-silver/60 font-bold">
                    {balance?.symbol || "SOMNIA"}
                </span>
            </div>

            {!address && (
                <div className="absolute inset-0 z-10 bg-void/80 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-sm font-mono text-muted-foreground uppercase tracking-widest">
                        Wallet Disconnected
                    </span>
                </div>
            )}
        </div>
    );
}
