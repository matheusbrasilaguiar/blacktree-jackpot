"use client";

import { useEffect, useRef } from "react";

export default function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

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

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", handleMouseMove);

        // Dot grid & Stars
        const gridSpacing = 48;
        let converging = false;

        // Create random stars for the background
        const stars = Array.from({ length: 80 }, () => ({
            x: Math.random(),
            y: Math.random(),
            size: Math.random() * 1.5 + 0.5,
            blinkSpeed: Math.random() * 0.02 + 0.01,
            phase: Math.random() * Math.PI * 2
        }));

        const animate = () => {
            time += 0.001;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. Draw Starfield (Twinkling)
            stars.forEach(star => {
                const x = star.x * canvas.width;
                const y = star.y * canvas.height;
                const opacity = (Math.sin(time * 100 * star.blinkSpeed + star.phase) + 1) / 2 * 0.15;
                
                ctx.beginPath();
                ctx.arc(x, y, star.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.fill();
            });

            // 2. Breathing dot grid with parallax and mouse reaction
            const breatheOpacity = 0.02 + Math.sin(time * 0.8) * 0.015;
            const cols = Math.ceil(canvas.width / gridSpacing) + 2;
            const rows = Math.ceil(canvas.height / gridSpacing) + 2;

            for (let r = -1; r < rows; r++) {
                for (let c = -1; c < cols; c++) {
                    let baseX = c * gridSpacing + gridSpacing / 2;
                    let baseY = r * gridSpacing + gridSpacing / 2;

                    // Parallax shift based on mouse
                    const moveX = (mouseRef.current.x - canvas.width / 2) * 0.01;
                    const moveY = (mouseRef.current.y - canvas.height / 2) * 0.01;
                    
                    let x = baseX - moveX;
                    let y = baseY - moveY;

                    // Mouse Interaction (Subtle Repel/Pull)
                    const dx = x - mouseRef.current.x;
                    const dy = y - mouseRef.current.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        const force = (150 - dist) / 150;
                        x += dx * force * 0.2;
                        y += dy * force * 0.2;
                    }

                    if (converging) {
                        const cx = canvas.width / 2;
                        const cy = canvas.height / 2;
                        const cdx = cx - x;
                        const cdy = cy - y;
                        const pull = Math.min(time * 2, 0.3);
                        x += cdx * pull;
                        y += cdy * pull;
                    }

                    ctx.beginPath();
                    ctx.arc(x, y, 0.8, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${breatheOpacity})`;
                    ctx.fill();
                }
            }

            // 3. Cinematic Triangles (The BlackTree Totem)
            const drawTri = (size: number, rotSpeed: number, opacity: number) => {
                const cx = canvas.width / 2;
                const cy = canvas.height / 2;
                const rotation = time * rotSpeed;
                
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(rotation);
                ctx.beginPath();
                ctx.moveTo(0, -size * 0.55);
                ctx.lineTo(-size * 0.5, size * 0.35);
                ctx.lineTo(size * 0.5, size * 0.35);
                ctx.closePath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.restore();
            };

            const triBase = Math.min(canvas.width, canvas.height) * 0.5;
            drawTri(triBase, 0.05, 0.03);
            drawTri(triBase * 1.2, -0.03, 0.01);

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
            window.removeEventListener("mousemove", handleMouseMove);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (window as any).__particleConverge;
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}
