"use client";

export interface DoubleBetEntry {
    id: string;
    player: string;
    amount: number;
    color: number;
    isNew: boolean;
    isYou?: boolean;
}

interface DoubleLiveFeedProps {
    entries: DoubleBetEntry[];
}

export default function DoubleLiveFeed({ entries }: DoubleLiveFeedProps) {
    const redBets = entries.filter(e => e.color === 1);
    const whiteBets = entries.filter(e => e.color === 3);
    const blackBets = entries.filter(e => e.color === 2);

    const totalRed = redBets.reduce((acc, curr) => acc + curr.amount, 0);
    const totalWhite = whiteBets.reduce((acc, curr) => acc + curr.amount, 0);
    const totalBlack = blackBets.reduce((acc, curr) => acc + curr.amount, 0);

    const activePlayers = entries.length;

    return (
        <div className="bg-[#0A0A0F]/80 backdrop-blur-md border border-[#F0F0F0]/10 rounded flex-1 flex flex-col overflow-hidden h-full">
            <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5 shrink-0">
                <span className="font-mono text-[10px] tracking-widest font-bold">LIVE BETS ENGINE v2.0</span>
                <span className="font-mono text-[10px] text-white/40 flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    {activePlayers} ACTIVE
                </span>
            </div>
            
            <div className="flex-1 grid grid-cols-3 divide-x divide-white/5 overflow-hidden">
                {/* Red Column */}
                <div className="flex flex-col min-w-0 h-full">
                    <div className="p-2 border-b border-[#CC1111]/20 bg-[#CC1111]/5 flex flex-col items-center shrink-0">
                        <span className="font-bebas-neue text-sm text-[#CC1111] tracking-widest">RED</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 no-scrollbar">
                        {redBets.map(entry => (
                            <div key={entry.id} className={`flex flex-col gap-0.5 ${entry.isNew ? "animate-pulse" : ""}`}>
                                <span className={`font-mono text-[9px] ${entry.isYou ? 'text-[#CC1111] drop-shadow-[0_0_5px_#CC1111]' : 'text-white/60'}`}>
                                    {entry.player}
                                </span>
                                <span className="font-mono text-[10px] font-bold text-[#CC1111]">
                                    {entry.amount.toFixed(2)} STT
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="p-2 border-t border-white/5 bg-[#CC1111]/5 mt-auto shrink-0">
                        <span className="font-mono text-[9px] text-white/40 block">TOTAL</span>
                        <span className="font-mono text-[10px] font-bold text-white/90">{totalRed.toLocaleString()}</span>
                    </div>
                </div>

                {/* White Column */}
                <div className="flex flex-col min-w-0 h-full">
                    <div className="p-2 border-b border-white/20 bg-white/5 flex flex-col items-center shrink-0">
                        <span className="font-bebas-neue text-sm text-[#F0F0F0] tracking-widest">WHITE</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 no-scrollbar">
                        {whiteBets.map(entry => (
                            <div key={entry.id} className={`flex flex-col gap-0.5 ${entry.isNew ? "animate-pulse" : ""}`}>
                                <span className={`font-mono text-[9px] ${entry.isYou ? 'text-[#F0F0F0] drop-shadow-[0_0_5px_#F0F0F0]' : 'text-white/60'}`}>
                                    {entry.player}
                                </span>
                                <span className="font-mono text-[10px] font-bold text-[#F0F0F0]">
                                    {entry.amount.toFixed(2)} STT
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="p-2 border-t border-white/5 bg-white/5 mt-auto shrink-0">
                        <span className="font-mono text-[9px] text-white/40 block">TOTAL</span>
                        <span className="font-mono text-[10px] font-bold text-white/90">{totalWhite.toLocaleString()}</span>
                    </div>
                </div>

                {/* Black Column */}
                <div className="flex flex-col min-w-0 h-full">
                    <div className="p-2 border-b border-white/10 bg-black/40 flex flex-col items-center shrink-0">
                        <span className="font-bebas-neue text-sm text-white/40 tracking-widest">BLACK</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 no-scrollbar">
                        {blackBets.map(entry => (
                            <div key={entry.id} className={`flex flex-col gap-0.5 ${entry.isNew ? "animate-pulse" : ""}`}>
                                <span className={`font-mono text-[9px] ${entry.isYou ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]' : 'text-white/60'}`}>
                                    {entry.player}
                                </span>
                                <span className="font-mono text-[10px] font-bold text-white/40">
                                    {entry.amount.toFixed(2)} STT
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="p-2 border-t border-white/5 bg-black/40 mt-auto shrink-0">
                        <span className="font-mono text-[9px] text-white/40 block">TOTAL</span>
                        <span className="font-mono text-[10px] font-bold text-white/60">{totalBlack.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
