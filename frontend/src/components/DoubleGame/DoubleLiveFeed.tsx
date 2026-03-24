"use client";

import { useEffect, useRef } from "react";
import { formatEther } from "viem";

export interface DoubleBetEntry {
  id: string; // unique string for rendering key
  player: string; // address or 'YOU'
  amount: number; // raw number for easy summing
  color: number;
  isNew: boolean;
  isYou: boolean;
}

export default function DoubleLiveFeed({ entries }: { entries: DoubleBetEntry[] }) {
  const scrollRefRed = useRef<HTMLDivElement>(null);
  const scrollRefWhite = useRef<HTMLDivElement>(null);
  const scrollRefBlack = useRef<HTMLDivElement>(null);

  const entriesRed = entries.filter((e) => e.color === 1);
  const entriesWhite = entries.filter((e) => e.color === 3);
  const entriesBlack = entries.filter((e) => e.color === 2);

  const totalRed = entriesRed.reduce((acc, curr) => acc + curr.amount, 0);
  const totalWhite = entriesWhite.reduce((acc, curr) => acc + curr.amount, 0);
  const totalBlack = entriesBlack.reduce((acc, curr) => acc + curr.amount, 0);
  const totalLocked = totalRed + totalWhite + totalBlack;

  const pctRed = totalLocked === 0 ? 0 : Math.round((totalRed / totalLocked) * 100);
  const pctWhite = totalLocked === 0 ? 0 : Math.round((totalWhite / totalLocked) * 100);
  const pctBlack = totalLocked === 0 ? 0 : Math.round((totalBlack / totalLocked) * 100);

  return (
    <div className="bg-[#050505]/90 backdrop-blur-xl border border-white/5 rounded-xl flex-1 flex flex-col overflow-hidden h-[420px] shadow-2xl">
        {/* Header Ribbon */}
        <div className="bg-black/80 lg:px-4 px-3 py-3 flex justify-between items-center border-b border-white/5">
            <span className="font-bebas-neue text-xl tracking-widest text-[#F0F0F0]">LIVE BETS ENGINE v2.0</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-white/40"><span className="text-green-500 mr-1">●</span> {entries.length} ACTIVE</span>
        </div>

        {/* Pool Progress Bar */}
        <div className="w-full h-1 flex gap-px bg-black/40 border-b border-white/5">
            <div className="h-full bg-[#CC1111] transition-all duration-700 ease-out shadow-[0_0_10px_rgba(204,17,17,0.3)]" style={{ width: `${pctRed}%` }} />
            <div className="h-full bg-[#F0F0F0] transition-all duration-700 ease-out shadow-[0_0_10px_rgba(240,240,240,0.3)]" style={{ width: `${pctWhite}%` }} />
            <div className="h-full bg-white/10 transition-all duration-700 ease-out" style={{ width: `${pctBlack}%` }} />
        </div>

        {/* The 3 Columns */}
        <div className="flex-1 grid grid-cols-3 min-h-0">
            
            {/* RED COLUMN */}
            <div className="flex flex-col border-r border-white/5 bg-[#CC1111]/2">
                <div className="bg-[#110505] border-b border-[#CC1111]/20 py-3 flex flex-col justify-center items-center gap-0.5 shadow-md z-10">
                    <span className="font-bebas-neue lg:text-3xl text-xl tracking-widest text-[#CC1111] drop-shadow-[0_0_8px_rgba(204,17,17,0.4)]">RED</span>
                    <span className="font-mono text-[8px] text-[#CC1111]/40 tracking-widest uppercase">{pctRed}%</span>
                </div>
                <div ref={scrollRefRed} className="flex-1 overflow-y-auto p-2 space-y-2 thin-scrollbar">
                    {entriesRed.map(e => (
                         <BetRow key={e.id} entry={e} bg="bg-[#CC1111]/10" text="text-[#CC1111]" border="border-[#CC1111]/20" isYouColor="bg-[#CC1111]/40 border-[#CC1111]" />
                    ))}
                </div>
                <div className="bg-[#110505] border-t border-[#CC1111]/30 p-3 flex flex-col">
                    <span className="font-mono text-[9px] text-[#CC1111]/50 uppercase tracking-widest">TOTAL</span>
                    <span className="font-bebas-neue lg:text-2xl text-xl text-[#CC1111] leading-tight">{totalRed.toLocaleString()}</span>
                </div>
            </div>

            {/* WHITE COLUMN */}
            <div className="flex flex-col border-r border-white/5 bg-white/2">
                <div className="bg-[#050505] border-b border-white/10 py-3 flex flex-col justify-center items-center gap-0.5 shadow-md z-10">
                    <span className="font-bebas-neue lg:text-3xl text-xl tracking-widest text-silver-bright drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">WHITE</span>
                    <span className="font-mono text-[8px] text-white/30 tracking-widest uppercase">{pctWhite}%</span>
                </div>
                <div ref={scrollRefWhite} className="flex-1 overflow-y-auto p-2 space-y-2 thin-scrollbar">
                    {entriesWhite.map(e => (
                         <BetRow key={e.id} entry={e} bg="bg-white/5" text="text-white" border="border-white/10" isYouColor="bg-white/20 border-white text-[#F0F0F0]" />
                    ))}
                </div>
                <div className="bg-[#050505] border-t border-white/10 p-3 flex flex-col">
                    <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">TOTAL</span>
                    <span className="font-bebas-neue lg:text-2xl text-xl text-silver-bright leading-tight">{totalWhite.toLocaleString()}</span>
                </div>
            </div>

            {/* BLACK COLUMN */}
            <div className="flex flex-col bg-black/40">
                <div className="bg-[#111111] border-b border-white/10 py-3 flex flex-col justify-center items-center gap-0.5 shadow-md z-10">
                    <span className="font-bebas-neue lg:text-3xl text-xl tracking-widest text-silver-bright/60 drop-shadow-[0_0_5px_rgba(255,255,255,0.1)]">BLACK</span>
                    <span className="font-mono text-[8px] text-white/30 tracking-widest uppercase">{pctBlack}%</span>
                </div>
                <div ref={scrollRefBlack} className="flex-1 overflow-y-auto p-2 space-y-2 thin-scrollbar">
                    {entriesBlack.map(e => (
                         <BetRow key={e.id} entry={e} bg="bg-white/5" text="text-white/40" border="border-white/5" isYouColor="bg-silver-bright/10 border-silver-bright/40 text-silver-bright" />
                    ))}
                </div>
                <div className="bg-[#111111] border-t border-white/10 p-3 flex flex-col">
                    <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest">TOTAL</span>
                    <span className="font-bebas-neue lg:text-2xl text-xl text-silver-bright/40 leading-tight">{totalBlack.toLocaleString()}</span>
                </div>
            </div>

        </div>
    </div>
  );
}

function BetRow({ entry, bg, text, border, isYouColor }: { entry: DoubleBetEntry, bg: string, text: string, border: string, isYouColor: string }) {
    return (
        <div className={`
            px-3 py-2 flex items-center justify-between rounded border transition-all duration-500
            ${entry.isNew ? 'animate-new-bet' : ''}
            ${entry.isYou ? isYouColor : `${bg} ${border}`}
        `}>
            <span className={`font-mono text-[11px] ${entry.isYou ? 'text-white drop-shadow-md' : 'text-white/60'}`}>{entry.player}</span>
            <span className={`font-bebas-neue text-lg ${entry.isYou ? 'text-white drop-shadow-md' : text}`}>{entry.amount.toLocaleString()}</span>
        </div>
    );
}
