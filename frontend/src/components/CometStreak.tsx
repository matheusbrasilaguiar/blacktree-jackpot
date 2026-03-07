"use client";

import { useEffect, useState } from "react";

export default function CometStreak() {
    const [visible, setVisible] = useState(false);
    const [top, setTop] = useState(30);

    useEffect(() => {
        const schedule = () => {
            const delay = Math.random() * 6000 + 12000; // 12-18s
            return setTimeout(() => {
                setTop(Math.random() * 70 + 10);
                setVisible(true);
                setTimeout(() => setVisible(false), 2500);
                schedule();
            }, delay);
        };
        const t = schedule();
        return () => clearTimeout(t);
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
            <div
                className="absolute h-[1px] w-[50vw]"
                style={{
                    top: `${top}%`,
                    background: "linear-gradient(90deg, transparent, hsla(0,0%,80%,0.25), transparent)",
                    animation: "comet-silver 2.5s linear forwards",
                }}
            />
        </div>
    );
}
