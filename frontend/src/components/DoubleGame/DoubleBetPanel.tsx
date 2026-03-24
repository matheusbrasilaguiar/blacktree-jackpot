"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Target } from "lucide-react";

interface DoubleBetPanelProps {
  onPlaceBet: (color: number, amountStt: string) => Promise<any>;
  isBetting: boolean;
  disabled: boolean;
  isCritical: boolean;
  myBets: Array<{ color: number; amount: string }>; 
}

export default function DoubleBetPanel({ onPlaceBet, isBetting, disabled, isCritical, myBets }: DoubleBetPanelProps) {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [amount, setAmount] = useState<string>("10.00");
  const [selectedColor, setSelectedColor] = useState<number | null>(null);

  const colors = [
    { 
        id: 1, 
        name: "WIN 2x", 
        label: "RED", 
        bg: "bg-[#CC1111]/20", 
        border: "border-[#CC1111]", 
        dot: "bg-[#CC1111] shadow-[0_0_10px_#CC1111]",
        text: "text-[#CC1111]"
    },
    { 
        id: 3, 
        name: "WIN 14x", 
        label: "WHITE", 
        bg: "bg-white/10", 
        border: "border-white", 
        dot: "bg-white shadow-[0_0_10px_white]",
        text: "text-white"
    },
    { 
        id: 2, 
        name: "WIN 2x", 
        label: "BLACK", 
        bg: "bg-white/10", 
        border: "border-white/40", 
        dot: "bg-[#111111] ring-1 ring-white/30 shadow-[0_0_10px_rgba(255,255,255,0.1)]",
        text: "text-silver-bright/60"
    }
  ];

  const submitBet = async () => {
    if (selectedColor === null) return;
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) return;
    
    try {
        await onPlaceBet(selectedColor, amount);
        setSelectedColor(null);
    } catch(e) {
        console.error("Bet failed", e);
    }
  };

  const setFixedAmount = (val: number) => {
      setAmount(val.toFixed(2));
  };

  return (
    <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex flex-col gap-5 shadow-2xl relative overflow-hidden h-full">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] mask-[radial-gradient(ellipse_60%_60%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

        <div className="flex justify-between items-center border-b border-white/5 pb-3 relative z-10">
            <h2 className="font-bebas-neue text-xl tracking-widest text-[#F0F0F0] flex items-center gap-2">
                <Target size={18} className="text-[#CC1111]" />
                BET CONSOLE
            </h2>
            <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <span className={`size-1.5 rounded-full ${disabled ? 'bg-white/20' : 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]'}`}></span> 
                {disabled ? 'LOCKED' : 'ACTIVE'}
            </span>
        </div>

        <div className="flex flex-col gap-5 relative z-10">
            {/* Color Select */}
            <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest pl-1">Target Color</label>
                <div className="grid grid-cols-3 gap-2 bg-black/40 p-1.5 rounded-lg border border-white/5">
                    {colors.map(c => {
                        const hasBet = myBets.some(b => b.color === c.id);
                        const isSelected = selectedColor === c.id;
                        return (
                            <button
                                key={c.id}
                                onClick={() => setSelectedColor(c.id)}
                                disabled={disabled || isBetting || hasBet}
                                className={`
                                    relative flex flex-col items-center justify-center gap-1 py-3 lg:py-4 rounded-md transition-all border group
                                    ${disabled || hasBet ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                                    ${isSelected ? `${c.bg} ${c.border}` : 'bg-white/2 border-white/5 hover:bg-white/5'}
                                `}
                            >
                                <div className={`size-2.5 rounded-full transition-transform group-hover:scale-110 ${c.dot}`}></div>
                                <div className="flex flex-col items-center gap-0">
                                    <span className={`font-bebas-neue text-xl leading-none mt-1 ${isSelected ? 'text-white' : c.text}`}>
                                        {hasBet ? 'PLACED' : c.name}
                                    </span>
                                    <span className={`font-mono text-[8px] uppercase tracking-[0.2em] font-bold ${isSelected ? 'text-white/80' : 'text-white/20'}`}>
                                        {c.label}
                                    </span>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest pl-1">Bet Amount (STT)</label>
                <div className="relative">
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={disabled || isBetting}
                        className="w-full bg-black/60 border border-white/10 rounded-lg py-4 pl-4 pr-[110px] font-bebas-neue text-2xl lg:text-3xl outline-none focus:border-[#D4A843]/50 transition-colors text-white" 
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1.5">
                        <button onClick={() => setFixedAmount(10)} className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 rounded font-mono text-[9px] text-white/60 transition-colors">10</button>
                        <button onClick={() => setFixedAmount(100)} className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 rounded font-mono text-[9px] text-white/60 transition-colors">100</button>
                    </div>
                </div>
            </div>

            {/* Submit */}
            <button 
                onClick={submitBet}
                disabled={disabled || isBetting || selectedColor === null || myBets.length > 0}
                className={`
                    w-full py-4 lg:py-5 font-bebas-neue text-2xl lg:text-3xl tracking-widest rounded-lg transition-all border border-transparent
                    ${disabled || selectedColor === null || myBets.length > 0 
                        ? 'bg-white/5 text-white/20 border-white/5 cursor-not-allowed' 
                        : 'bg-[#F0F0F0] text-[#050505] hover:bg-[#D4A843] shadow-[0_0_25px_rgba(240,240,240,0.2)] cursor-pointer'
                    }
                `}
            >
                {isBetting ? 'SIGNING...' : 'CONFIRM BET'}
            </button>
        </div>
    </div>
  );
}
