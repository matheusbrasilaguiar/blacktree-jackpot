"use client";

interface CountdownTimerProps {
    timeLeft: number;
    totalTime: number;
    isCritical: boolean;
    isUrgent: boolean;
}

export default function CountdownTimer({ timeLeft, totalTime, isCritical, isUrgent }: CountdownTimerProps) {
    const progress = timeLeft / totalTime;
    const radius = 18;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    const fmt = (n: number) => String(n).padStart(2, "0");
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    const timeStr = `${fmt(m)}:${fmt(s)}`;

    const strokeColor = isCritical
        ? "hsl(var(--color-danger))"
        : isUrgent
            ? "hsl(var(--color-silver-bright))"
            : "hsl(var(--color-silver) / 0.5)";

    const trailColor = isCritical
        ? "hsl(var(--color-danger) / 0.15)"
        : "hsl(var(--color-silver) / 0.08)";

    return (
        <div className="flex items-center gap-3">
            {/* Circular loader */}
            <div className="relative w-[44px] h-[44px]">
                <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 44 44"
                >
                    {/* Trail */}
                    <circle
                        cx="22"
                        cy="22"
                        r={radius}
                        fill="none"
                        stroke={trailColor}
                        strokeWidth="2"
                    />
                    {/* Progress */}
                    <circle
                        cx="22"
                        cy="22"
                        r={radius}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-linear"
                        style={{
                            filter: isCritical
                                ? "drop-shadow(0 0 6px hsl(var(--color-danger) / 0.6))"
                                : "drop-shadow(0 0 4px hsl(var(--color-silver) / 0.2))",
                        }}
                    />
                </svg>

                {/* Pulsing center dot when critical */}
                {isCritical && (
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div
                            className="w-1.5 h-1.5 rounded-full bg-danger"
                            style={{ animation: "breathe-fast 0.5s ease-in-out infinite" }}
                        />
                    </div>
                )}
            </div>

            {/* Time digits */}
            <div className="flex items-center gap-[3px]">
                {timeStr.split("").map((d, i) => (
                    <span
                        key={i}
                        className={`inline-flex items-center justify-center font-mono text-sm font-bold transition-colors duration-300 ${d === ":"
                                ? `w-2 bg-transparent ${isCritical ? "text-[#e62208]" : "text-silver"}`
                                : `w-5 h-7 rounded-sm border bg-void ${isCritical
                                    ? "text-[#e62208] border-[#e62208]/40 animate-shake"
                                    : isUrgent
                                        ? "text-silver-bright border-silver-bright/30"
                                        : "text-silver border-silver/20"
                                }`
                            }`}
                    >
                        {d}
                    </span>
                ))}
            </div>
        </div>
    );
}
