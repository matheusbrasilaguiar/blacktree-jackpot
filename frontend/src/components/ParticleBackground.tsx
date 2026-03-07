"use client";

import { useEffect, useRef } from "react";

export default function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Dot grid
        const gridSpacing = 40;
        let converging = false;

        const animate = () => {
            time += 0.001;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Breathing dot grid
            const breatheOpacity = 0.03 + Math.sin(time * 0.8) * 0.02; // 0.01 to 0.05
            const cols = Math.ceil(canvas.width / gridSpacing);
            const rows = Math.ceil(canvas.height / gridSpacing);

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    let x = c * gridSpacing + gridSpacing / 2;
                    let y = r * gridSpacing + gridSpacing / 2;

                    if (converging) {
                        const cx = canvas.width / 2;
                        const cy = canvas.height / 2;
                        const dx = cx - x;
                        const dy = cy - y;
                        const pull = Math.min(time * 2, 0.3);
                        x += dx * pull;
                        y += dy * pull;
                    }

                    ctx.beginPath();
                    ctx.arc(x, y, 1, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(200, 200, 200, ${breatheOpacity})`;
                    ctx.fill();
                }
            }

            // Giant triangle watermark
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const triSize = Math.min(canvas.width, canvas.height) * 0.6;
            const rotation = time * 0.1; // very slow rotation

            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(rotation);
            ctx.beginPath();
            ctx.moveTo(0, -triSize * 0.55);
            ctx.lineTo(-triSize * 0.5, triSize * 0.35);
            ctx.lineTo(triSize * 0.5, triSize * 0.35);
            ctx.closePath();
            ctx.strokeStyle = `rgba(200, 200, 200, 0.04)`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.restore();

            animationId = requestAnimationFrame(animate);
        };

        animate();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__particleConverge = (val: boolean) => {
            converging = val;
        };

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", resize);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (window as any).__particleConverge;
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}
