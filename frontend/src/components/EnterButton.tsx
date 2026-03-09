"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { parseEther } from "viem";
import { CheckCircle2, AlertTriangle, ShieldCheck, Scale, Zap } from "lucide-react";
import { JACKPOT_CONTRACT_ADDRESS } from "@/hooks/useJackpotReactivity";

const BLACKTREE_ABI = [
    {
        name: "enter",
        type: "function",
        stateMutability: "payable",
        inputs: [],
        outputs: [],
    },
] as const;

interface EnterButtonProps {
    onEnter: () => void;
    disabled: boolean;
    isCritical: boolean;
}

export default function EnterButton({ onEnter, disabled, isCritical }: EnterButtonProps) {
    const { isConnected } = useAccount();
    const { openConnectModal } = useConnectModal();
    const { writeContract, data: txHash, isPending: isWriting, reset: resetWrite } = useWriteContract();

    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        isError: isConfirmError
    } = useWaitForTransactionReceipt({ hash: txHash });

    const [hovered, setHovered] = useState(false);
    const [flickerText, setFlickerText] = useState(false);

    // Reset state if transaction failed or succeeded so user can try again
    useEffect(() => {
        if (isConfirmed) {
            onEnter();
            setTimeout(() => resetWrite(), 3000); // clear after 3s success state
        }
        if (isConfirmError) {
            console.error("[EnterButton] TX failed");
            resetWrite();
        }
    }, [isConfirmed, isConfirmError, onEnter, resetWrite]);

    const isProcessing = isWriting || isConfirming;

    // Flicker text on hover
    useEffect(() => {
        if (!hovered || isProcessing || isConfirmed) return;
        const t = setTimeout(() => {
            setFlickerText(true);
            setTimeout(() => setFlickerText(false), 300);
        }, 400);
        return () => clearTimeout(t);
    }, [hovered, isProcessing, isConfirmed]);

    const handleClick = () => {
        if (isProcessing || disabled) return;

        if (!isConnected) {
            openConnectModal?.();
            return;
        }

        // Call real smart contract function
        writeContract({
            address: JACKPOT_CONTRACT_ADDRESS,
            abi: BLACKTREE_ABI,
            functionName: "enter",
            value: parseEther("1"), // 1 STT defined as current rule
        });

        // Keep the cool visual effect for immediate feedback
        const flash = document.createElement("div");
        flash.style.cssText = "position:fixed;inset:0;background:white;z-index:9999;pointer-events:none;opacity:0.9;transition:opacity 0.15s";
        document.body.appendChild(flash);
        setTimeout(() => { flash.style.opacity = "0"; }, 50);
        setTimeout(() => { flash.remove(); }, 200);

        const line = document.createElement("div");
        line.style.cssText = "position:fixed;left:50%;top:0;width:2px;height:100vh;background:linear-gradient(to top,transparent,hsl(0 0% 78%),transparent);z-index:9998;pointer-events:none;transform-origin:bottom;animation:vertical-line 0.8s ease-out forwards";
        document.body.appendChild(line);
        setTimeout(() => line.remove(), 900);
    };

    const buttonText = (() => {
        if (!isConnected) return "CONNECT TO ENTER";
        if (isConfirmed) return (
            <span className="flex items-center justify-center gap-2">
                <CheckCircle2 size={18} />
                YOU&apos;RE IN · GOOD LUCK
            </span>
        );
        if (isWriting) return "SIGNING TX...";
        if (isConfirming) return "CONFIRMING on-chain...";
        if (flickerText) return "ARE YOU IN?";
        return "ENTER NOW — 1 STT";
    })();

    return (
        <div className="relative mt-4">
            <button
                onClick={handleClick}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => { setHovered(false); setFlickerText(false); }}
                disabled={disabled || isProcessing}
                className={`relative w-full py-5 px-8 font-display text-xl tracking-wider uppercase transition-all duration-300 ${!isProcessing && !isConfirmed
                    ? hovered
                        ? "bg-silver-bright text-void-deep border border-silver-bright"
                        : "bg-void text-silver-bright border border-silver/40"
                    : isProcessing
                        ? "bg-void text-silver scale-95 border border-silver"
                        : "bg-void text-green-400 border border-green-400/30"
                    } ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                style={{
                    animation: !isProcessing && !isConfirmed && !disabled && isConnected
                        ? isCritical ? "breathe-fast 1s ease-in-out infinite" : "breathe-cold 2.5s ease-in-out infinite"
                        : undefined,
                }}
            >
                {buttonText}
            </button>

            {isCritical && !isProcessing && !isConfirmed && !disabled && isConnected && (
                <p className="flex items-center justify-center gap-2 text-center font-mono text-[10px] tracking-[0.2em] text-danger mt-3 uppercase" style={{ animation: "fade-in 0.3s" }}>
                    <AlertTriangle size={12} />
                    LAST CHANCE — DRAW IMMINENT
                </p>
            )}

            <div className="flex items-center justify-center gap-0 mt-3 md:flex-row flex-col">
                {[
                    { text: "Trustless", icon: ShieldCheck },
                    { text: "Provably Fair", icon: Scale },
                    { text: "Powered by Somnia", icon: Zap },
                ].map((item, i) => (
                    <span key={item.text} className="flex items-center mt-1 md:mt-0">
                        {i > 0 && <span className="w-px h-3 bg-border mx-3 hidden md:block" />}
                        <item.icon size={10} className="text-muted-foreground/60 mr-1.5" />
                        <span className="font-mono text-[8px] tracking-[0.1em] text-muted-foreground uppercase">{item.text}</span>
                    </span>
                ))}
            </div>
        </div>
    );
}
