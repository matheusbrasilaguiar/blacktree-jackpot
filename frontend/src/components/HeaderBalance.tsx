"use client";

import { useAccount, useBalance } from "wagmi";
import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { Wallet } from "lucide-react";

export default function HeaderBalance() {
    const { address } = useAccount();
    const { data: balance } = useBalance({
        address,
        query: {
            refetchInterval: 5000, // Refetch every 5 seconds to show changes
        }
    });

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !address) return null;

    // Use raw numeric readout and basic formatting
    const numericBalance = balance ? parseFloat(formatUnits(balance.value, balance.decimals)) : 0;
    const displayBalance = numericBalance.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2, // Fixed 2-decimal length to avoid layout jitter
    });

    return (
        <div className="flex items-center gap-1.5 sm:gap-2.5 px-2 sm:px-4 py-1.5 rounded-lg border border-silver/10 bg-void/60 backdrop-blur-md relative overflow-hidden transition-all cursor-default">
            <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-silver/70 shrink-0" />

            {/* Value */}
            <div className="flex items-baseline gap-1 sm:gap-1.5 tabular-nums justify-end">
                <span className="text-sm sm:text-base font-display text-silver-bright tracking-wide drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]">
                    {displayBalance}
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono text-silver/50 font-bold uppercase tracking-widest mt-0.5 hidden xs:inline">
                    {balance?.symbol || "STT"}
                </span>
            </div>
        </div>
    );
}
