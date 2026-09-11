import { steps } from "@/lib/content";
import { asset } from "@/lib/site";
import { Eyebrow, Heading, Lede } from "./ui/SectionHeader";
import SplitSection from "./ui/SplitSection";
import shared from "@/styles/shared.module.css";
import styles from "./HowItWorks.module.css";

export default function HowItWorks() {
  return (
    <SplitSection
      id="planung"
      mediaMinHeight={640}
      mediaMinHeightNarrow={360}
      contentAlign="top"
      media={
        <img
          src={asset("/images/planung-eiche-insel.png")}
          alt="Küche mit Eiche-Insel und hellen Fronten"
          sizes="(max-width: 900px) 100vw, 50vw"
          loading="lazy"
          data-parallax
          data-reveal="wipe"
          className={styles.photo}
        />
      }
    >
      <Eyebrow>Küchenwunsch, Planung, fertig</Eyebrow>

      <div className={styles.intro}>
        <Heading measure="full">
          So funktioniert der Küchenkauf mit Küchenheld
        </Heading>
        <Lede measure="wide">
          Drei Schritte, ein festes Planungsteam: Sie geben Ihre Küchenwünsche
          an, wir planen Ihre Küche gemeinsam mit Ihnen und liefern sie fertig
          montiert — mit 100 % transparentem Angebot ohne versteckte Kosten.
        </Lede>
      </div>

      <ol className={styles.steps} data-reveal-stagger>
        {steps.map((step) => (
          <li key={step.num} className={styles.step}>
            <div className={styles.stepNum}>{step.num}</div>
            <div>
              <div className={shared.cardTitle}>{step.title}</div>
              <p className={shared.bodySmall}>{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </SplitSection>
  );
}
