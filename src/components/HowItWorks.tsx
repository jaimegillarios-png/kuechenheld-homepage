import Image from "next/image";
import { steps } from "@/lib/content";
import shared from "@/styles/shared.module.css";
import styles from "./HowItWorks.module.css";

export default function HowItWorks() {
  return (
    <section id="planung" className={styles.section}>
      <div className={styles.media}>
        <Image
          src="/images/planung-eiche-insel.png"
          alt="Küche mit Eiche-Insel und hellen Fronten"
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          data-parallax
          className={styles.photo}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.eyebrow} data-reveal="letter">
          Küchenwunsch, Planung, fertig
        </div>

        <div className={styles.intro}>
          <h2 className={styles.heading} data-reveal="mask">
            So funktioniert der Küchenkauf mit Küchenheld
          </h2>
          <p className={shared.body} data-reveal="rise" data-reveal-delay="140">
            Drei Schritte, ein festes Planungsteam: Sie geben Ihre Küchenwünsche
            an, wir planen Ihre Küche gemeinsam mit Ihnen und liefern sie fertig
            montiert — mit 100 % transparentem Angebot ohne versteckte Kosten.
          </p>
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
      </div>
    </section>
  );
}
