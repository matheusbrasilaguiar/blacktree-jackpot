"use client";

import BlackTreeLogo from "./BlackTreeLogo";
import CountdownTimer from "./CountdownTimer";
import ConnectWalletButton from "./ConnectWalletButton";
import { UserCommandCenter } from "./CommandCenter/UserCommandCenter";

interface TopBarProps {
    timeLeft: number;
    totalTime: number;
    round: number;
    isUrgent: boolean;
    isCritical: boolean;
}

export default function TopBar({ timeLeft, totalTime, round, isUrgent, isCritical }: TopBarProps) {
    return (
        <div
            className="fixed top-0 left-0 right-0 h-[60px] z-40 flex items-center justify-between px-6"
            style={{
                borderBottom: isCritical
                    ? "1px solid hsl(var(--color-danger) / 0.4)"
                    : "1px solid hsl(0 0% 15% / 0.2)",
                animation: isCritical ? "breathe-fast 1s ease-in-out infinite" : undefined,
            }}
        >
            {/* Logo */}
            <BlackTreeLogo />

            {/* Live status */}
            <div className="max-md:hidden flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                <span className="relative flex h-[6px] w-[6px]">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-green-500" />
                </span>
                <span>LIVE</span>
                <span className="text-muted-foreground/40">·</span>
                <span>SOMNIA TESTNET</span>
            </div>

            {/* Round + Countdown */}
            <div className="flex items-center gap-4">
                <div className="max-sm:hidden flex items-center gap-2">
                    <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-muted-foreground">ROUND</span>
                    <span className="font-display text-xl text-silver-bright">#{round}</span>
                </div>

                <div className="w-px h-6 bg-border hidden sm:block" />

                <CountdownTimer
                    timeLeft={timeLeft}
                    totalTime={totalTime}
                    isCritical={isCritical}
                    isUrgent={isUrgent}
                />

                <div className="w-px h-6 bg-border hidden sm:block mx-2" />

                <UserCommandCenter />
                <ConnectWalletButton />
            </div>
        </div>
    );
}
