import type { ReactNode } from "react";

/** Carved gold corner flourish, mirrored via CSS transforms. */
export function Corner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={`pointer-events-none absolute h-12 w-12 text-gold sm:h-16 sm:w-16 ${className}`} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.1">
        <path d="M4 76 V20 Q4 4 20 4 H76" />
        <path d="M10 76 V24 Q10 10 24 10 H76" opacity=".6" />
        <path d="M16 40 Q16 16 40 16" />
        <path d="M22 22 q8 -2 10 6 q-8 2 -10 -6z" fill="currentColor" opacity=".8" />
        <path d="M30 14 q6 6 0 12 M14 30 q6 6 12 0" />
        <circle cx="4" cy="76" r="2" fill="currentColor" />
        <circle cx="76" cy="4" r="2" fill="currentColor" />
        <path d="M40 4 l3 3 -3 3 -3 -3z M4 40 l3 3 -3 3 -3 -3z" fill="currentColor" />
      </g>
    </svg>
  );
}

export function Corners() {
  return (
    <>
      <Corner className="left-1 top-1" />
      <Corner className="right-1 top-1 -scale-x-100" />
      <Corner className="bottom-1 left-1 -scale-y-100" />
      <Corner className="bottom-1 right-1 -scale-100" />
    </>
  );
}

/** Ornamental divider with an eight-point star. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto flex w-full max-w-md items-center gap-3 text-gold ${className}`} aria-hidden>
      <span className="gold-rule flex-1" />
      <svg viewBox="0 0 120 24" className="h-6 w-28">
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M0 12 H40 M80 12 H120" />
          <path d="M40 12 q6 -8 12 0 q-6 8 -12 0z M80 12 q-6 -8 -12 0 q6 8 12 0z" fill="currentColor" opacity=".5" />
          <g transform="translate(60 12)">
            <rect x="-7" y="-7" width="14" height="14" fill="currentColor" />
            <rect x="-7" y="-7" width="14" height="14" transform="rotate(45)" fill="currentColor" />
            <circle r="3" fill="var(--paper-light)" />
          </g>
        </g>
      </svg>
      <span className="gold-rule flex-1" />
    </div>
  );
}

/** Scalloped arch-topped section divider band. */
export function ArchBand() {
  return (
    <div className="relative h-14 overflow-hidden text-gold" aria-hidden>
      <svg viewBox="0 0 400 56" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d="M0 28 H400" stroke="currentColor" strokeWidth=".8" opacity=".6" />
        {Array.from({ length: 20 }).map((_, i) => (
          <path key={i} d={`M${i * 20} 28 q10 -16 20 0`} fill="none" stroke="currentColor" strokeWidth=".8" />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <circle key={i} cx={i * 20 + 10} cy="18" r="1.4" fill="currentColor" />
        ))}
      </svg>
      <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-gold bg-surface" />
    </div>
  );
}

export function SectionHeading({ eyebrow, title, dark }: { eyebrow: string; title: ReactNode; dark?: boolean }) {
  return (
    <header className="mb-10 text-center">
      <p className={`eyebrow ${dark ? "text-gold-soft" : "text-gold"}`}>{eyebrow}</p>
      <div className="mx-auto mt-3 flex max-w-xs items-center gap-3">
        <span className="gold-rule flex-1" />
        <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
        <span className="gold-rule flex-1" />
      </div>
      <h2 className={`mt-4 font-display text-4xl font-light italic sm:text-5xl ${dark ? "text-paper-light" : "text-tint"}`}>{title}</h2>
    </header>
  );
}
