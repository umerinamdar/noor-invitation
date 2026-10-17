import { useEffect, useRef, useState } from "react";

const THRESHOLD = 0.38;

export function ScratchCard({ onReveal, children }: { onReveal: () => void; children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cleared, setCleared] = useState(false);
  const [mounted, setMounted] = useState(true);
  const drawing = useRef(false);
  const done = useRef(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = c.getBoundingClientRect();
    c.width = rect.width * dpr;
    c.height = rect.height * dpr;
    const ctx = c.getContext("2d")!;
    ctx.scale(dpr, dpr);
    const css = getComputedStyle(document.documentElement);
    const foil = css.getPropertyValue("--scratch-foil").trim();
    const ink = css.getPropertyValue("--scratch-ink").trim();
    const hi = css.getPropertyValue("--highlight").trim();
    const g = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    g.addColorStop(0, ink); g.addColorStop(0.3, foil); g.addColorStop(0.5, hi); g.addColorStop(0.7, foil); g.addColorStop(1, ink);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, rect.width, rect.height);
    // foil grain + geometric emboss
    for (let i = 0; i < 1800; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? `${hi}55` : `${ink}44`;
      ctx.fillRect(Math.random() * rect.width, Math.random() * rect.height, 1, 1);
    }
    ctx.strokeStyle = `${hi}88`;
    ctx.lineWidth = 0.8;
    for (let x = 0; x < rect.width + 40; x += 28) for (let y = 0; y < rect.height + 40; y += 28) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.strokeRect(-6, -6, 12, 12); ctx.restore();
      ctx.strokeRect(x - 6, y - 6, 12, 12);
    }
    ctx.fillStyle = ink;
    ctx.font = `500 11px Jost, sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("R U B   T O   R E V E A L", rect.width / 2, rect.height / 2 + 4);
    ctx.globalCompositeOperation = "destination-out";
  }, []);

  const check = () => {
    const c = canvasRef.current; if (!c || done.current) return;
    const ctx = c.getContext("2d")!;
    const { data } = ctx.getImageData(0, 0, c.width, c.height);
    let clear = 0, total = 0;
    for (let i = 3; i < data.length; i += 64) { total++; if (data[i] === 0) clear++; }
    if (clear / total >= THRESHOLD) reveal();
  };

  const reveal = () => {
    if (done.current) return;
    done.current = true;
    setCleared(true);
    onReveal();
    setTimeout(() => setMounted(false), 900);
  };

  const scratch = (e: React.PointerEvent) => {
    const c = canvasRef.current; if (!c) return;
    const r = c.getBoundingClientRect();
    const ctx = c.getContext("2d")!;
    ctx.beginPath();
    ctx.arc(e.clientX - r.left, e.clientY - r.top, 22, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div className="relative">
      {children}
      {mounted && (
        <canvas
          ref={canvasRef}
          tabIndex={0}
          role="button"
          aria-label="Gold foil covering the date. Rub to reveal, or press Enter to reveal."
          className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] cursor-grab touch-none rounded-sm outline-none transition-opacity duration-700 focus-visible:ring-2 focus-visible:ring-gold"
          style={{ opacity: cleared ? 0 : 1 }}
          onPointerDown={(e) => { drawing.current = true; (e.target as HTMLElement).setPointerCapture(e.pointerId); scratch(e); }}
          onPointerMove={(e) => drawing.current && scratch(e)}
          onPointerUp={() => { drawing.current = false; check(); }}
          onPointerLeave={() => { if (drawing.current) check(); }}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); reveal(); } }}
        />
      )}
    </div>
  );
}
