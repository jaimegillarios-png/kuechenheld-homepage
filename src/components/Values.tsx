import { values } from "@/lib/content";
import Section from "./ui/Section";
import SectionHeader from "./ui/SectionHeader";
import styles from "./Values.module.css";

export default function Values() {
  return (
    <Section tone="inverse">
      <SectionHeader
        eyebrow="Unsere Werte"
        heading="Ihre Vorteile auf einen Blick"
        tone="inverse"
        measure="none"
      />

      <div className={styles.grid} data-reveal-stagger>
        {values.map((value) => (
          <div key={value.title} className={styles.card}>
            <div className={styles.stat} data-count>
              {value.stat}
            </div>
            <div className={styles.cardTitle}>{value.title}</div>
            <p className={styles.cardBody}>{value.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
