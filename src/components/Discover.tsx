"use client";

import { useRef } from "react";
import { discoverCards } from "@/lib/content";
import { useRail } from "@/lib/useRail";
import MediaCard, { MediaCardSpacer } from "./ui/MediaCard";
import OverlayArrows from "./ui/OverlayArrows";
import Rail from "./ui/Rail";
import Section from "./ui/Section";
import { Heading, Lede } from "./ui/SectionHeader";
import styles from "./Discover.module.css";

export default function Discover() {
  const railRef = useRef<HTMLDivElement>(null);
  const rail = useRail(railRef);

  return (
    <>
      <Section id="kuechendesign" rhythm="lead">
        <Heading measure="none" gap={3}>
          Küchenplanung entdecken
        </Heading>
        <Lede measure="wide">
          Erleben Sie individuelle Küchenplanung – Transparent, digital und auf
          Sie zugeschnitten.
        </Lede>
      </Section>

      <Section rhythm="trail" contained={false}>
        <div className={styles.railWrap} {...rail.hoverProps}>
          <Rail railRef={railRef} gapped>
            {discoverCards.map((card) => (
              <MediaCard
                key={card.title}
                title={card.title}
                body={card.body}
                src={card.src}
                width={800}
                height={1067}
                sizes="(max-width: 560px) 100vw, (max-width: 900px) 82vw, 33vw"
              />
            ))}
          </Rail>

          {/* Arrows sit at the vertical centre of the card image, not the section. */}
          <OverlayArrows
            onPrev={rail.prev}
            onNext={rail.next}
            opacity={rail.arrowOpacity}
            labels={{ prev: "Vorherige Karte", next: "Nächste Karte" }}
            spacer={<MediaCardSpacer />}
          />
        </div>
      </Section>
    </>
  );
}
