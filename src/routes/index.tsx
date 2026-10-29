import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import confetti from "canvas-confetti";

import heroBackdrop from "@/assets/hero-backdrop.jpg";
import welcomeBackdrop from "@/assets/welcome-courtyard.jpg";
import paperTexture from "@/assets/paper-texture.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import { ScratchCard } from "@/components/invite/ScratchCard";
import { ArchBand, Corners, Divider, SectionHeading } from "@/components/invite/Ornaments";
import { OpeningBook, type OpeningPhase } from "@/components/invite/OpeningBook";
import { openingMilestones } from "@/components/invite/opening-timeline";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aarav & Anaya — Wedding Invitation · 14 February 2027" },
      { name: "description", content: "You are warmly invited to celebrate the wedding of Aarav & Anaya at The Grand Pavilion on 14 February 2027." },
      { property: "og:title", content: "Aarav & Anaya — Wedding Invitation" },
      { property: "og:description", content: "Open your invitation to the wedding of Aarav & Anaya, 14 February 2027, The Grand Pavilion." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Invitation,
});

/* ---------- Content (placeholders) ---------- */
const COUPLE = { a: "Aarav", b: "Anaya", initials: "A · A" };
const WEDDING_ISO = "2027-02-14T19:00:00+05:30";
const VENUE = { name: "The Grand Pavilion", address: "Marine Drive, Mumbai, Maharashtra", map: "https://www.google.com/maps/search/?api=1&query=The+Grand+Pavilion+Mumbai" };
const EVENTS = [
  { name: "Mehendi", date: "12 February 2027", time: "4:00 PM", iso: "2027-02-12T16:00:00+05:30", dress: "Emerald & marigold, festive casual", place: "The Rose Garden" },
  { name: "Nikah", date: "14 February 2027", time: "7:00 PM", iso: "2027-02-14T19:00:00+05:30", dress: "Ivory & gold, traditional formal", place: "The Marble Courtyard" },
  { name: "Walima", date: "15 February 2027", time: "1:00 PM", iso: "2027-02-15T13:00:00+05:30", dress: "Pastels, elegant daywear", place: "The Lantern Hall" },
  { name: "Reception", date: "15 February 2027", time: "8:00 PM", iso: "2027-02-15T20:00:00+05:30", dress: "Black tie, jewel tones", place: "The Grand Pavilion" },
];
const FAMILIES = [
  { side: "The Groom", name: COUPLE.a, parents: "Mr. Rehan & Mrs. Sana Kapoor", grand: "Late Mr. Iqbal & Mrs. Zarina Kapoor · Mr. Farhan & Mrs. Noor Malik" },
  { side: "The Bride", name: COUPLE.b, parents: "Mr. Imran & Mrs. Ayesha Mehta", grand: "Mr. Salim & Mrs. Rukhsana Mehta · Late Mr. Javed & Mrs. Shirin Khan" },
];

/* ---------- Hooks ---------- */
function useCountdown(iso: string) {
  const target = new Date(iso).getTime();
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const diff = now == null ? 0 : Math.max(0, target - now);
  return { days: Math.floor(diff / 864e5), hours: Math.floor(diff / 36e5) % 24, minutes: Math.floor(diff / 6e4) % 60, seconds: Math.floor(diff / 1e3) % 60, ready: now != null };
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { el.classList.add("is-visible"); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal-on-scroll ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Page ---------- */
function Invitation() {
  const [phase, setPhase] = useState<OpeningPhase>("sealed");
  const [lidGone, setLidGone] = useState(false);
  const [petals, setPetals] = useState(false);
  const sealAudio = useRef<HTMLAudioElement>(null);
  const music = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    document.body.classList.toggle("locked", phase !== "open");
    return () => document.body.classList.remove("locked");
  }, [phase]);

  const open = () => {
    if (phase !== "sealed") return;
    const rm = reducedMotion();
    setPhase("opening");
    const s = sealAudio.current;
    if (s) { s.volume = 0.8; s.play().catch(() => {}); }
    const m = music.current;
    if (m) {
      m.muted = true; m.volume = 0;
      m.play().then(() => {
        m.muted = false;
        const start = performance.now();
        const step = (t: number) => { const p = Math.max(0, Math.min(1, (t - start) / 8000)); m.volume = 0.6 * p; if (p < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      }).catch(() => {});
    }
    const timeline = openingMilestones(rm);
    if (!rm) setTimeout(() => setPhase("flash"), timeline.flashAt);
    setTimeout(() => setPhase("quote"), timeline.quoteAt);
    setTimeout(() => setPhase("open"), timeline.welcomeAt);
    setTimeout(() => setLidGone(true), timeline.removeAt);
  };

  const onDateReveal = () => {
    if (!reducedMotion()) {
      const css = getComputedStyle(document.documentElement);
      const colors = ["--accent", "--accent-soft", "--highlight", "--scratch-foil"].map((v) => css.getPropertyValue(v).trim());
      confetti({ particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors, scalar: 0.9 });
      confetti({ particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors, scalar: 0.9 });
      setTimeout(() => setPetals(true), 1200);
    }
  };

  const started = phase === "open";

  return (
    <div style={{ "--paper-img": `url(${paperTexture})` } as CSSProperties} className="relative bg-background">
      <audio ref={sealAudio} src="/audio/seal.mp3" preload="auto" />
      <audio ref={music} src="/audio/music.mp3" preload="auto" loop />

      {/* HERO (revealed under the lid) */}
      <section className="welcome-scene relative flex min-h-[94dvh] flex-col items-center justify-center overflow-hidden px-5 py-16 text-center">
        <img src={welcomeBackdrop} alt="" width={1536} height={1024} className={`welcome-art absolute inset-0 h-full w-full object-cover ${started ? "animate-settle" : "scale-[1.18] brightness-50"}`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--background)_55%,transparent),transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        {started && (
          <div className="relative z-10 flex w-full max-w-md flex-col items-center">
            <p className="eyebrow animate-fade-up text-gold-soft" style={{ animationDelay: "1.6s" }}>Bismillah · Together with their families</p>
            <h1 className="mt-5 font-display font-light italic leading-[0.95]">
              <span className="animate-fade-up block" style={{ animationDelay: "2.2s" }}><span className="text-gold animate-shimmer block pb-2 text-6xl sm:text-7xl">{COUPLE.a}</span></span>
              <span className="animate-fade-up my-2 block text-3xl text-gold-soft" style={{ animationDelay: "2.8s" }}>&amp;</span>
              <span className="animate-fade-up block" style={{ animationDelay: "3.2s" }}><span className="text-gold animate-shimmer block pb-2 text-6xl sm:text-7xl">{COUPLE.b}</span></span>
            </h1>
            <p className="eyebrow animate-fade-up mt-6 text-paper" style={{ animationDelay: "3.8s" }}>request the honour of your presence</p>
            <div className="animate-fade-up mt-8 w-full max-w-xs" style={{ animationDelay: "4.4s" }}>
              <ScratchCard onReveal={onDateReveal}>
                <div className="frame-card-dark px-6 py-7 backdrop-blur-sm">
                  <Corners />
                  <p className="eyebrow text-gold-soft">Sunday</p>
                  <p className="mt-2 font-display text-4xl text-paper-light">14 February 2027</p>
                  <div className="gold-rule mx-auto my-3 w-24" />
                  <p className="eyebrow text-gold-soft">Seven o'clock in the evening · IST</p>
                </div>
              </ScratchCard>
            </div>
            {phase === "open" && <p className="eyebrow animate-fade-up mt-10 text-gold-soft/80">Scroll</p>}
          </div>
        )}
      </section>

      {!lidGone && <OpeningBook phase={phase} onOpen={open} names={`${COUPLE.a} & ${COUPLE.b}`} />}

      {petals && <Petals />}

      <main className="relative">
        <ArchBand />
        {/* FAMILIES */}
        <section className="paper-ivory px-5 py-20 sm:py-28">
          <Reveal className="mx-auto max-w-4xl">
            <SectionHeading eyebrow="With the blessings of" title="Our Families" />
            <div className="grid gap-8 md:grid-cols-2">
              {FAMILIES.map((f) => (
                <div key={f.side} className="frame-card px-7 py-10 text-center">
                  <Corners />
                  <p className="eyebrow text-gold">{f.side}</p>
                  <p className="mt-3 font-display text-5xl italic text-tint">{f.name}</p>
                  <div className="gold-rule mx-auto my-5 w-24" />
                  <p className="eyebrow text-muted-foreground">Son / Daughter of</p>
                  <p className="mt-2 font-display text-2xl text-foreground">{f.parents}</p>
                  <p className="eyebrow mt-6 text-muted-foreground">Grandchild of</p>
                  <p className="mt-2 font-display text-lg leading-relaxed text-muted-foreground">{f.grand}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <ArchBand />
        {/* VENUE + COUNTDOWN */}
        <section className="paper-emerald px-5 py-20 sm:py-28">
          <Reveal className="mx-auto max-w-3xl text-center">
            <SectionHeading eyebrow="The venue" title={VENUE.name} dark />
            <p className="font-display text-xl text-paper">{VENUE.address}</p>
            <a href={VENUE.map} target="_blank" rel="noreferrer" className="btn-gold mt-8 inline-block px-8 py-4">View on map</a>
            <Divider className="my-16" />
            <Countdown />
          </Reveal>
        </section>

        <ArchBand />
        {/* PROGRAMME */}
        <section className="paper-ivory px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <Reveal><SectionHeading eyebrow="The celebrations" title="Programme" /></Reveal>
            <div className="grid gap-8 sm:grid-cols-2">
              {EVENTS.map((e, i) => (
                <Reveal key={e.name} delay={i * 120}>
                  <article className="frame-card h-full px-7 py-10 text-center">
                    <Corners />
                    <p className="eyebrow text-gold">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-2 font-display text-4xl italic text-tint">{e.name}</h3>
                    <div className="gold-rule mx-auto my-4 w-20" />
                    <p className="font-display text-xl text-foreground"><time dateTime={e.iso}>{e.date}</time></p>
                    <p className="eyebrow mt-1 text-muted-foreground">{e.time} IST · {e.place}</p>
                    <p className="mt-5 text-sm text-muted-foreground"><span className="eyebrow text-gold">Dress code</span><br />{e.dress}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <ArchBand />
        {/* GALLERY */}
        <section className="paper-emerald px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <Reveal><SectionHeading eyebrow="Moments" title="Gallery" dark /></Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[gallery1, gallery2, gallery3].map((src, i) => (
                <Reveal key={src} delay={i * 150} className={i === 2 ? "col-span-2 sm:col-span-1" : ""}>
                  <figure className="frame-card-dark p-3">
                    <img src={src} alt="" loading="lazy" width={768} height={1024} className="aspect-[3/4] w-full object-cover" />
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <ArchBand />
        {/* BLESSING */}
        <section className="paper-ivory px-5 py-24 sm:py-32">
          <Reveal className="frame-card mx-auto max-w-2xl px-8 py-14 text-center">
            <Corners />
            <p className="eyebrow text-gold">A blessing</p>
            <blockquote className="mt-6 font-display text-2xl font-light italic leading-relaxed text-tint sm:text-3xl">
              “And among His signs is that He created for you spouses from among yourselves, that you may find tranquillity in them; and He placed between you affection and mercy.”
            </blockquote>
            <Divider className="mt-8" />
            <p className="eyebrow mt-4 text-muted-foreground">Surah Ar-Rum · 30:21</p>
          </Reveal>
        </section>

        <ArchBand />
        {/* TRAVEL */}
        <section className="paper-emerald px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-5xl">
            <Reveal><SectionHeading eyebrow="For our guests" title="Travel & Stay" dark /></Reveal>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { t: "Arriving", d: "Chhatrapati Shivaji Maharaj International Airport is 40 minutes away. Shuttles run from Terminal 2 on 12–15 February." },
                { t: "Accommodation", d: "A block of rooms is held at The Pavilion Residences. Mention “Aarav & Anaya” when booking before 10 January 2027." },
                { t: "On the day", d: "Valet parking is available at the main gate. Please arrive 30 minutes before each ceremony." },
              ].map((x, i) => (
                <Reveal key={x.t} delay={i * 120}>
                  <div className="frame-card-dark h-full px-6 py-10 text-center">
                    <Corners />
                    <h3 className="font-display text-3xl italic text-gold-soft">{x.t}</h3>
                    <div className="gold-rule mx-auto my-4 w-16" />
                    <p className="text-sm leading-relaxed text-paper">{x.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <ArchBand />
        {/* RSVP */}
        <section className="paper-ivory px-5 py-20 sm:py-28">
          <Reveal className="mx-auto max-w-xl">
            <SectionHeading eyebrow="Kindly reply by 10 January 2027" title="RSVP" />
            <Rsvp />
          </Reveal>
        </section>

        <ArchBand />
        {/* CLOSING */}
        <section className="relative overflow-hidden px-5 py-28 text-center">
          <img src={heroBackdrop} alt="" loading="lazy" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover brightness-50" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
          <Reveal className="frame-card-dark relative mx-auto max-w-lg px-8 py-14">
            <Corners />
            <p className="eyebrow text-gold-soft">With love & gratitude</p>
            <p className="text-gold animate-shimmer mt-5 font-display text-5xl italic sm:text-6xl">{COUPLE.a} &amp; {COUPLE.b}</p>
            <Divider className="mt-6" />
            <p className="mt-6 font-display text-xl text-paper">We can't wait to celebrate with you beneath the lanterns.</p>
          </Reveal>
        </section>
      </main>
    </div>
  );
}

function Countdown() {
  const c = useCountdown(WEDDING_ISO);
  const units = [["Days", c.days], ["Hours", c.hours], ["Minutes", c.minutes], ["Seconds", c.seconds]] as const;
  return (
    <div>
      <p className="eyebrow mb-6 text-gold-soft">Counting down to the Nikah</p>
      <div className="grid grid-cols-4 gap-2 sm:gap-4" aria-live="off">
        {units.map(([l, v]) => (
          <div key={l} className="frame-card-dark px-1 py-5 sm:py-7">
            <p className="text-gold font-display text-3xl tabular-nums sm:text-5xl">{c.ready ? String(v).padStart(2, "0") : "--"}</p>
            <p className="eyebrow mt-2 text-[0.55rem] text-paper sm:text-[0.65rem]">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Rsvp() {
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <div className="frame-card px-8 py-14 text-center">
        <Corners />
        <p className="font-display text-4xl italic text-tint">Thank you</p>
        <p className="mt-3 text-muted-foreground">Your reply has been received with gratitude.</p>
      </div>
    );
  }
  return (
    <form className="frame-card space-y-5 px-6 py-10 sm:px-10" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <Corners />
      <label className="block"><span className="eyebrow text-gold">Full name</span><input required className="field mt-2" name="name" autoComplete="name" /></label>
      <label className="block"><span className="eyebrow text-gold">Guests</span>
        <select className="field mt-2" name="guests" defaultValue="1">{[1, 2, 3, 4, 5].map((n) => <option key={n}>{n}</option>)}</select>
      </label>
      <fieldset>
        <legend className="eyebrow text-gold">Attending</legend>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          {EVENTS.map((e) => (
            <label key={e.name} className="flex items-center gap-2"><input type="checkbox" defaultChecked className="accent-[var(--tint)]" /> {e.name}</label>
          ))}
        </div>
      </fieldset>
      <label className="block"><span className="eyebrow text-gold">A note for the couple</span><textarea rows={3} className="field mt-2" /></label>
      <button className="btn-gold w-full px-6 py-4">Send reply</button>
    </form>
  );
}

function Petals() {
  const [items] = useState(() => Array.from({ length: 22 }, (_, i) => ({
    left: Math.random() * 100, size: 10 + Math.random() * 12, dur: 12 + Math.random() * 12, delay: Math.random() * 14,
    drift: `${(Math.random() - 0.5) * 30}vw`, spin: `${360 + Math.random() * 540}deg`, key: i,
  })));
  return (
    <div aria-hidden>
      {items.map((p) => (
        <span key={p.key} className="petal" style={{ left: `${p.left}%`, width: p.size, height: p.size, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`, "--drift": p.drift, "--spin": p.spin } as CSSProperties} />
      ))}
    </div>
  );
}
