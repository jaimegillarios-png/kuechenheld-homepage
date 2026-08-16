import { values } from "@/lib/content";
import shared from "@/styles/shared.module.css";
import styles from "./Values.module.css";

export default function Values() {
  return (
    <section className={styles.section}>
      <div className={shared.container}>
        <div className={styles.eyebrow} data-reveal="letter">
          Unsere Werte
        </div>

        <h2 className={styles.heading} data-reveal="mask">
          Ihre Vorteile auf einen Blick
        </h2>

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
      </div>
    </section>
  );
}
