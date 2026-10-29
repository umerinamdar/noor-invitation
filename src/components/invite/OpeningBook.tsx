import type { CSSProperties } from "react";
import cover from "@/assets/navy-cover-balanced.jpg";
import pageArtwork from "@/assets/illuminated-ivory-page.jpg";
import setting from "@/assets/book-setting.jpg";
import { Button } from "@/components/ui/button";
import { OPENING } from "./opening-timeline";

export type OpeningPhase = "sealed" | "opening" | "flash" | "quote" | "open";

export function OpeningBook({ phase, onOpen, names }: { phase: OpeningPhase; onOpen: () => void; names: string }) {
  const started = phase !== "sealed";
  return (
    <div className={`manuscript ${started ? "has-started" : ""} ${phase === "open" ? "has-finished" : ""}`} data-phase={phase}
      style={{ "--book-hold": `${OPENING.hold}ms`, "--book-swing": `${OPENING.swing}ms`, "--book-flash-duration": `${OPENING.flash}ms` } as CSSProperties}>
      <img className="manuscript-floor" src={setting} alt="" width={1536} height={1024} aria-hidden="true" />
      <div className="manuscript-stage">
        <div className="manuscript-camera">
          <div className="manuscript-volume">
            <div className="manuscript-page manuscript-right paper-ivory"><img className="manuscript-paper-art" src={pageArtwork} width={1024} height={1536} alt="" aria-hidden="true" /><div className="manuscript-turn-shadow" /></div>
            <div className="manuscript-page-edges" aria-hidden="true" />
            <div className="manuscript-spine" aria-hidden="true" />
            <div className="manuscript-cover">
              <div className="manuscript-front">
                <img src={cover} alt="A navy-blue leather invitation book with embossed gold floral ornament" width={1024} height={1536} />
              </div>
              <div className="manuscript-back paper-ivory"><img className="manuscript-paper-art" src={pageArtwork} width={1024} height={1536} alt="" aria-hidden="true" /></div>
              <div className="manuscript-cover-edge" aria-hidden="true" />
            </div>
            {(phase === "quote" || phase === "open") && (
              <div className="manuscript-verse" role="status">
                <div className="manuscript-verse-page manuscript-translation-page">
                  <p className="manuscript-verse-label">Surah Ar-Rum · 30:21</p>
                  <div className="gold-rule" />
                  <p className="manuscript-english">“And among His signs is that He created for you spouses from among yourselves, that you may find tranquillity in them; and He placed between you affection and mercy. Indeed in that are signs for a people who give thought.”</p>
                </div>
                <div className="manuscript-verse-page manuscript-arabic-page">
                  <p className="manuscript-verse-label" lang="ar" dir="rtl">سورة الروم · ٣٠:٢١</p>
                  <div className="gold-rule" />
                  <p dir="rtl" lang="ar" className="manuscript-arabic">وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {phase === "sealed" && <div className="manuscript-controls"><Button variant="ghost" onClick={onOpen} aria-label={`Open the invitation from ${names}`} className="manuscript-open plate">Tap to open</Button><p>You're invited</p></div>}
      {phase === "flash" && <div className="manuscript-flash" aria-hidden="true"><div className="manuscript-light" /><div className="manuscript-light-ray" /></div>}
    </div>
  );
}