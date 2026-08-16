"use client";

import { useRef } from "react";
import { reviews } from "@/lib/content";
import { useRail } from "@/lib/useRail";
import shared from "@/styles/shared.module.css";
import styles from "./Reviews.module.css";

export default function Reviews() {
  const railRef = useRef<HTMLDivElement>(null);
  const rail = useRail(railRef);

  return (
    <section className={styles.section}>
      <div className={shared.container}>
        <div className={styles.eyebrow} data-reveal="letter">
          Bewertungen
        </div>

        <div className={styles.head} data-reveal-stagger>
          <div>
            <h2 className={styles.heading} data-reveal="mask">
              Über 1.500 gekaufte Küchen im Jahr
            </h2>
            <p
              className={styles.lead}
              data-reveal="rise"
              data-reveal-delay="140"
            >
              Jedes Jahr dürfen wir mehr als 1.500 KundInnen bei ihrer
              Küchenrenovierung unterstützen! Unsere KundInnen sind von der
              Küchenplanung mit Küchenheld begeistert und mehr als 85% empfehlen
              uns weiter:
            </p>
          </div>

          <div className={styles.stats}>
            <div>
              <div className={shared.stat} data-count>
                4,7
              </div>
              <div className={styles.statLabel}>★★★★★ Reviews.io</div>
            </div>
            <div>
              <div className={shared.stat} data-count>
                85 %
              </div>
              <div className={styles.statLabel}>Empfehlungen</div>
            </div>
            <div className={styles.bareArrows}>
              <button
                type="button"
                aria-label="Vorherige Bewertung"
                onClick={rail.prev}
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Nächste Bewertung"
                onClick={rail.next}
              >
                →
              </button>
            </div>
          </div>
        </div>

        <div {...rail.hoverProps}>
          <div
            ref={railRef}
            className={styles.rail}
            data-rail
            data-reveal-stagger
            data-reveal-stagger-step="110"
          >
            {reviews.map((review) => (
              <figure key={review.author} className={styles.quote}>
                <div className={styles.quoteTop}>
                  <span className={styles.stars}>★★★★★</span>
                  <span className={styles.date}>{review.date}</span>
                </div>
                <blockquote className={styles.quoteText}>
                  {review.quote}
                </blockquote>
                <figcaption className={styles.author}>
                  {review.author}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
