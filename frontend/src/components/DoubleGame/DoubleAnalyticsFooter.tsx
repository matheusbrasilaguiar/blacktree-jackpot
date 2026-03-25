"use client";

import { DoubleHistoryResult } from "./DoubleHistoryDots"; // We'll just define it or import the interface

interface DoubleAnalyticsFooterProps {
    history: DoubleHistoryResult[];
}

export default function DoubleAnalyticsFooter({ history }: DoubleAnalyticsFooterProps) {
    const getColorClass = (colorId: number) => {
        if (colorId === 1) return "bg-[#CC1111]";
        if (colorId === 3) return "bg-white";
        if (colorId === 2) return "bg-[#0a0a0a] border border-white/20";
        return "bg-transparent";
    };

    // Calculate Latest 100 Analytics
    const last100 = history.slice(-100);
    const redCount = last100.filter(h => h.color === 1).length;
    const whiteCount = last100.filter(h => h.color === 3).length;
    const blackCount = last100.filter(h => h.color === 2).length;
    const totalCount = last100.length || 1; 
    
    const pctRed = Math.round((redCount / totalCount) * 100);
    const pctWhite = Math.round((whiteCount / totalCount) * 100);
    const pctBlack = Math.round((blackCount / totalCount) * 100);

    // Calculate Streak Analytics
    let streakCount = 0;
    let streakColorId = 0;
    if (history.length > 0) {
        streakColorId = history[history.length - 1].color;
        for (let i = history.length - 1; i >= 0; i--) {
            if (history[i].color === streakColorId) {
                streakCount++;
            } else {
                break;
            }
        }
    }
    
    let streakLabel = "NONE";
    let streakColorClass = "text-white/40";
    if (streakColorId === 1) { streakLabel = "RED"; streakColorClass = "text-[#CC1111]"; }
    if (streakColorId === 2) { streakLabel = "BLACK"; streakColorClass = "text-white/40"; }
    if (streakColorId === 3) { streakLabel = "WHITE"; streakColorClass = "text-[#F0F0F0]"; }

    return (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-8 py-7 px-4 lg:px-10 bg-[#0a0a0a]/60 backdrop-blur-md rounded-xl border border-white/5 relative z-10 w-full overflow-hidden shadow-2xl">
            {/* Left: History dots */}
            <div className="flex items-center gap-4 lg:gap-6 flex-1 min-w-0 w-full lg:w-auto">
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em] shrink-0 border-r border-white/10 pr-6">HISTORY</span>
                
                <div className="flex gap-3 shrink-0 items-center no-scrollbar overflow-x-auto pt-2 pb-1 px-2 min-h-[50px] flex-1 min-w-0">
                    {history.length === 0 ? (
                        <span className="font-mono text-[10px] text-white/20">Awaiting draws...</span>
                    ) : (
                        history.slice(-15).reverse().map((res, i) => {
                            const isLatest = i === 0;
                            return (
                                <div key={res.roundId} className="relative flex items-center justify-center p-2">
                                    {isLatest && (
                                        <>
                                            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-white filter drop-shadow-[0_0_5px_rgba(255,255,255,0.6)] animate-bounce" />
                                            <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 font-mono text-[7px] text-white/60 tracking-tighter">NOW</span>
                                        </>
                                    )}
                                    <div className={`
                                        size-4 lg:size-4.5 rounded-full transition-all duration-300
                                        ${res.color === 3 ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 
                                          res.color === 1 ? 'bg-[#ff1a1a] shadow-[0_0_15px_rgba(255,26,26,0.5)]' : 
                                          'bg-[#121212] ring-1 ring-inset ring-white/20 shadow-inner'}
                                        ${isLatest ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-[#080808] z-10 animate-pulse-white' : ''}
                                    `} />
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Right side: Stats */}
            <div className="flex items-center justify-between lg:justify-end gap-6 lg:gap-10 shrink-0 w-full lg:w-auto border-t border-white/5 pt-6 lg:border-t-0 lg:pt-0">
                {/* Last 100 Pct */}
                <div className="flex items-center gap-4">
                    <span className="font-mono text-[9px] text-white/30 uppercase tracking-widest mr-1 hidden sm:inline">LAST {totalCount}</span>
                    <div className="flex items-center gap-3.5 lg:border-r lg:border-white/10 lg:pr-6">
                        <span className="font-bebas-neue text-lg text-[#CC1111]">{pctRed}%</span>
                        <span className="font-bebas-neue text-lg text-[#F0F0F0]">{pctWhite}%</span>
                        <span className="font-bebas-neue text-lg text-white/50">{pctBlack}%</span>
                    </div>
                </div>
                
                {/* Current Streak */}
                <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest hidden xs:inline">TREND</span>
                    <span className={`font-bebas-neue text-lg lg:text-xl tracking-widest ${streakColorClass}`}>
                        {streakCount > 0 ? `${streakCount} ${streakLabel}` : 'NONE'}
                    </span>
                </div>
            </div>

        </div>
    );
}
