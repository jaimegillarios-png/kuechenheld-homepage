import Image from "next/image";
import { ctaBandImage } from "@/lib/content";
import Button from "./ui/Button";
import { Eyebrow, Heading, Lede } from "./ui/SectionHeader";
import SplitSection from "./ui/SplitSection";
import styles from "./CtaBand.module.css";

const DEFAULT_MARKS = ["Unverbindlich", "Kostenlos", "In 24 Stunden"];

type Props = {
  eyebrow?: string;
  heading?: string;
  lede?: string;
  cta?: { label: string; href: string };
  /** The reassurance strip under the button. */
  marks?: readonly string[];
  image?: { src: string; alt: string };
};

export default function CtaBand({
  eyebrow = "Küchenkauf starten",
  heading = "Angebot mit Preisindikation für Ihre Traumküche",
  lede = "Einfach Ihre Vorstellungen einer Traumküche angeben und wir erstellen individuell für Sie Ihr unverbindliches, kostenloses Angebot.",
  cta = { label: "Kostenloses Angebot erhalten", href: "#fragebogen" },
  marks = DEFAULT_MARKS,
  image = ctaBandImage,
}: Props) {
  return (
    <SplitSection
      tone="inverse-raised"
      contentRhythm="tall"
      mediaMinHeight={560}
      mediaMinHeightNarrow={320}
      media={
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          data-parallax
          data-reveal="wipe"
          className={styles.photo}
        />
      }
    >
      <Eyebrow tone="inverse">{eyebrow}</Eyebrow>
      <Heading measure="column">{heading}</Heading>
      <Lede tone="inverse" measure="default" gap="action-open">
        {lede}
      </Lede>
      <Button
        href={cta.href}
        variant="cream"
        data-reveal="rise"
        data-reveal-delay={240}
      >
        {cta.label}
      </Button>

      <div className={styles.reassurance}>
        {marks.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </SplitSection>
  );
}
