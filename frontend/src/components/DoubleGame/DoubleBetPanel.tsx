"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { CheckCircle2 } from "lucide-react";

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

  const colors = [
    { 
        id: 1, 
        name: "WIN 2.0x", 
        label: "SELECT RED", 
        symbol: "R",
        baseAttr: "border-b-[#CC1111] hover:bg-[#CC1111]/10",
        circle: "bg-[#CC1111] shadow-[0_0_20px_rgba(204,17,17,0.5)]",
        textCol: "text-white"
    },
    { 
        id: 3, 
        name: "WIN 14x", 
        label: "SELECT WHITE", 
        symbol: "W",
        baseAttr: "border-b-[#F0F0F0] hover:bg-[#F0F0F0]/10",
        circle: "bg-[#F0F0F0] shadow-[0_0_20px_rgba(240,240,240,0.5)]",
        textCol: "text-black"
    },
    { 
        id: 2, 
        name: "WIN 2.0x", 
        label: "SELECT BLACK", 
        symbol: "B",
        baseAttr: "border-b-white/20 hover:bg-white/5 border-t border-x border-white/5",
        circle: "bg-[#0A0A0F] border border-white/20 shadow-[0_0_20px_rgba(0,0,0,1)]",
        textCol: "text-white"
    }
  ];

  const handleBet = async (colorId: number) => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) return;
    
    try {
        await onPlaceBet(colorId, amount);
    } catch(e) {
        console.error("Bet failed", e);
    }
  };

  const setFixedAmount = (val: number) => {
      setAmount(val.toFixed(2));
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Color Cards */}
      <div className="grid grid-cols-3 gap-3">
        {colors.map((c) => {
          const hasBetOnThis = myBets.some(b => b.color === c.id);
          const isProcessing = isBetting;

          return (
              <button
                key={c.id}
                onClick={() => handleBet(c.id)}
                disabled={disabled || isProcessing || hasBetOnThis}
                className={`group bg-[#0A0A0F]/80 backdrop-blur-md rounded p-4 flex flex-col items-center gap-2 transition-all border-b-4 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed ${c.baseAttr}`}
              >
                <div className="absolute top-2 right-2 font-mono text-[10px] text-white/20">{c.name}</div>
                <div className={`size-12 rounded-full flex items-center justify-center ${c.circle}`}>
                    {hasBetOnThis ? (
                         <CheckCircle2 className={c.textCol} size={20} />
                    ) : (
                         <span className={`font-bebas-neue text-2xl ${c.textCol}`}>{c.symbol}</span>
                    )}
                </div>
                <div className="font-mono text-xs font-bold tracking-widest">{hasBetOnThis ? "BET PLACED" : c.label}</div>
              </button>
          );
        })}
      </div>

      {/* Bet Input Row */}
      <div className="bg-[#0A0A0F]/80 backdrop-blur-md p-4 rounded flex items-center justify-between gap-4 border border-[#F0F0F0]/10">
          <div className="flex-1 flex flex-col gap-1">
              <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Bet Amount</label>
              <div className="flex items-center gap-2">
                  <input 
                      type="number"
                      step="0.01"
                      min="1"
                      className="bg-transparent border-none text-3xl font-bebas-neue focus:ring-0 p-0 text-[#F0F0F0] w-full outline-none"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={disabled || isBetting}
                  />
                  <span className="font-bebas-neue text-xl text-white/20">STT</span>
              </div>
          </div>
          
          <div className="flex gap-1.5">
              <button onClick={() => setFixedAmount(5)} className="h-8 px-3 font-mono text-[9px] border border-white/10 hover:bg-white/5 transition-colors text-white/80">5</button>
              <button onClick={() => setFixedAmount(25)} className="h-8 px-3 font-mono text-[9px] border border-white/10 hover:bg-white/5 transition-colors text-white/80">25</button>
              <button onClick={() => setFixedAmount(100)} className="h-8 px-3 font-mono text-[9px] border border-white/10 hover:bg-white/5 transition-colors text-white/80">100</button>
              <button onClick={() => setFixedAmount(500)} className="h-8 px-3 font-mono text-[9px] border border-white/10 hover:bg-white/5 transition-colors text-white/80">500</button>
              <button onClick={() => setFixedAmount(1000)} className="h-8 px-3 font-mono text-[9px] border border-[#D4A843]/30 hover:bg-[#D4A843]/10 transition-colors text-[#D4A843]">MAX</button>
          </div>
          
          <button 
              onClick={() => {
              }}
              disabled={disabled || isBetting || myBets.length > 0}
              className={`h-16 w-48 ${disabled ? 'bg-white/20 text-white/40 cursor-not-allowed' : 'bg-[#F0F0F0] text-[#050505] hover:bg-[#D4A843] cursor-pointer shadow-[0_0_30px_rgba(240,240,240,0.2)]'} font-bebas-neue text-2xl tracking-widest transition-all  ${!disabled && !isBetting ? 'animate-pulse' : ''}`}
          >
              {isBetting ? 'SIGNING...' : 'PLACE BET'}
          </button>
      </div>
    </div>
  );
}
