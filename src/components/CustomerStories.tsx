"use client";

import { useRef } from "react";
import { routes, storySlides } from "@/lib/content";
import { useRail } from "@/lib/useRail";
import OverlayArrows from "./ui/OverlayArrows";
import Rail from "./ui/Rail";
import { Eyebrow, Heading, Lede } from "./ui/SectionHeader";
import SplitSection from "./ui/SplitSection";
import TextLink from "./ui/TextLink";
import styles from "./CustomerStories.module.css";

export default function CustomerStories() {
  const railRef = useRef<HTMLDivElement>(null);
  const rail = useRail(railRef);

  return (
    <SplitSection
      even
      mediaKind="rail"
      mediaMinHeight={800}
      mediaMinHeightNarrow={360}
      mediaProps={rail.hoverProps}
      media={
        <>
          <Rail railRef={railRef} filled>
            {storySlides.map((slide) => (
              <div key={slide.src} className={styles.slide}>
                <img
                  src={slide.src}
                  alt={slide.alt}
                  sizes="(max-width: 900px) 100vw, 50vw"
                  loading="lazy"
                  className={styles.photo}
                />
                <span className={styles.caption}>{slide.caption}</span>
              </div>
            ))}
          </Rail>

          <OverlayArrows
            onPrev={rail.prev}
            onNext={rail.next}
            opacity={rail.arrowOpacity}
            labels={{ prev: "Vorheriges Bild", next: "Nächstes Bild" }}
          />
        </>
      }
    >
      <Eyebrow>Erfahrungsberichte</Eyebrow>
      <Heading measure="full" hyphenate>
        Kundenerfahrungen: Gemeinsam Erfolge schaffen
      </Heading>
      <Lede measure="default" gap="action-open">
        Sehen Sie, wie die Zusammenarbeit mit unserem Team zu transformierenden
        Ergebnissen für unsere KundInnen geführt hat.
      </Lede>
      <TextLink
        href={routes.testimonials}
        data-reveal="rise"
        data-reveal-delay={240}
      >
        Erfahrungsberichte ansehen
      </TextLink>
    </SplitSection>
  );
}
