"use client";

import { useRef } from "react";
import Image from "next/image";
import { discoverCards } from "@/lib/content";
import { useRail } from "@/lib/useRail";
import shared from "@/styles/shared.module.css";
import styles from "./Discover.module.css";

export default function Discover() {
  const railRef = useRef<HTMLDivElement>(null);
  const rail = useRail(railRef);

  return (
    <>
      <section id="kuechendesign" className={styles.head}>
        <div className={shared.container}>
          <h2 className={styles.heading} data-reveal="mask">
            Küchenplanung entdecken
          </h2>
          <p className={styles.lead} data-reveal="rise" data-reveal-delay="140">
            Erleben Sie individuelle Küchenplanung – Transparent, digital und
            auf Sie zugeschnitten.
          </p>
        </div>
      </section>

      <section className={styles.railSection}>
        <div className={styles.railWrap} {...rail.hoverProps}>
          <div
            ref={railRef}
            className={styles.rail}
            data-rail
            data-reveal-stagger
            data-reveal-stagger-step="110"
          >
            {discoverCards.map((card) => (
              <article key={card.title} className={styles.card}>
                <div data-zoom className={styles.frame}>
                  <Image
                    src={card.src}
                    alt={card.title}
                    width={800}
                    height={1067}
                    sizes="(max-width: 560px) 100vw, (max-width: 900px) 82vw, 33vw"
                    className={styles.photo}
                  />
                </div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardBody}>{card.body}</p>
              </article>
            ))}
          </div>

          {/* Arrows sit at the vertical centre of the card image, not the section. */}
          <div className={styles.arrows} aria-hidden={rail.arrowOpacity === 0}>
            <div className={styles.arrowSpacer} />
            <button
              type="button"
              aria-label="Vorherige Karte"
              className={styles.arrowPrev}
              style={{ opacity: rail.arrowOpacity }}
              onClick={rail.prev}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Nächste Karte"
              className={styles.arrowNext}
              style={{ opacity: rail.arrowOpacity }}
              onClick={rail.next}
            >
              →
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
