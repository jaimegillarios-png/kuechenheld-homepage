import Image from "next/image";
import { ctaBandImage } from "@/lib/content";
import Button from "./ui/Button";
import { Eyebrow, Heading, Lede } from "./ui/SectionHeader";
import SplitSection from "./ui/SplitSection";
import styles from "./CtaBand.module.css";

const reassurance = ["Unverbindlich", "Kostenlos", "In 24 Stunden"];

export default function CtaBand() {
  return (
    <SplitSection
      tone="inverse-raised"
      contentRhythm="tall"
      mediaMinHeight={560}
      mediaMinHeightNarrow={320}
      media={
        <Image
          src={ctaBandImage.src}
          alt={ctaBandImage.alt}
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          data-parallax
          data-reveal="wipe"
          className={styles.photo}
        />
      }
    >
      <Eyebrow tone="inverse" gap={4}>
        Küchenkauf starten
      </Eyebrow>
      <Heading measure="column" gap={4}>
        Angebot mit Preisindikation für Ihre Traumküche
      </Heading>
      <Lede tone="inverse" measure="default" gap={7}>
        Einfach Ihre Vorstellungen einer Traumküche angeben und wir erstellen
        individuell für Sie Ihr unverbindliches, kostenloses Angebot.
      </Lede>
      <Button
        href="#fragebogen"
        variant="cream"
        data-reveal="rise"
        data-reveal-delay={240}
      >
        Kostenloses Angebot erhalten
      </Button>

      <div className={styles.reassurance}>
        {reassurance.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </SplitSection>
  );
}
