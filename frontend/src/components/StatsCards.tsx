"use client";

interface StatsCardsProps {
    participants: number;
    ticketPrice: number;
    timeLeft: number;
    isCritical: boolean;
    isUrgent: boolean;
}

export default function StatsCards({ participants, ticketPrice, timeLeft, isCritical, isUrgent }: StatsCardsProps) {
    const fmt = (n: number) => String(n).padStart(2, "0");
    const h = Math.floor(timeLeft / 3600);
    const m = Math.floor((timeLeft % 3600) / 60);
    const s = timeLeft % 60;

    const cards = [
        { label: "TICKET PRICE", value: `${ticketPrice} STT` },
        { label: "PARTICIPANTS", value: participants.toLocaleString() },
        {
            label: "DRAW IN",
            value: `${fmt(h)}:${fmt(m)}:${fmt(s)}`,
            danger: isCritical,
            warning: isUrgent,
        },
    ];

    return (
        <div className="flex flex-col gap-2">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="bg-void border border-border shimmer border-animated px-4 py-3 flex items-center justify-between transition-all duration-300"
                >
                    <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground">
                        {card.label}
                    </span>
                    <span
                        className={`font-display text-2xl ${card.danger ? "text-[#e62208]" : card.warning ? "text-silver-bright" : "text-silver-bright"
                            }`}
                    >
                        {card.value}
                    </span>
                </div>
            ))}
        </div>
    );
}
