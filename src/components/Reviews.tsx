"use client";

import { useRef } from "react";
import { reviews } from "@/lib/content";
import { useRail } from "@/lib/useRail";
import Rail from "./ui/Rail";
import Section from "./ui/Section";
import { Eyebrow, Heading, Lede } from "./ui/SectionHeader";
import Stat from "./ui/Stat";
import styles from "./Reviews.module.css";

export default function Reviews() {
  const railRef = useRef<HTMLDivElement>(null);
  const rail = useRail(railRef);

  return (
    <Section tone="warm">
      <Eyebrow gap={5}>Bewertungen</Eyebrow>

      <div className={styles.head} data-reveal-stagger>
        <div>
          <Heading measure="full" gap={4}>
            Über 1.500 gekaufte Küchen im Jahr
          </Heading>
          <Lede measure="wide">
            Jedes Jahr dürfen wir mehr als 1.500 KundInnen bei ihrer
            Küchenrenovierung unterstützen! Unsere KundInnen sind von der
            Küchenplanung mit Küchenheld begeistert und mehr als 85% empfehlen
            uns weiter:
          </Lede>
        </div>

        <div className={styles.stats}>
          <Stat value="4,7" label="★★★★★ Reviews.io" />
          <Stat value="85 %" label="Empfehlungen" />
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
        <Rail railRef={railRef} stretch>
          {reviews.map((review) => (
            <figure key={review.author} className={styles.quote}>
              <div className={styles.quoteTop}>
                <span className={styles.stars}>★★★★★</span>
                <span className={styles.date}>{review.date}</span>
              </div>
              <blockquote className={styles.quoteText}>
                {review.quote}
              </blockquote>
              <figcaption className={styles.author}>{review.author}</figcaption>
            </figure>
          ))}
        </Rail>
      </div>
    </Section>
  );
}
