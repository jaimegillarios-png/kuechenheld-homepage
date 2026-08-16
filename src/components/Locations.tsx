import AnchorLink from "./AnchorLink";
import MaybeLink from "./MaybeLink";
import { routes, showrooms } from "@/lib/content";
import shared from "@/styles/shared.module.css";
import styles from "./Locations.module.css";

export default function Locations() {
  return (
    <>
      <div data-rule className={styles.rule} />

      <section id="standorte" className={styles.section}>
        <div className={styles.inner}>
          <div>
            <div className={styles.eyebrow} data-reveal="letter">
              Standorte
            </div>
            <h2 className={styles.heading} data-reveal="mask">
              Küche kaufen leicht gemacht: Online planen, vor Ort erleben
            </h2>
            <p
              className={styles.lead}
              data-reveal="rise"
              data-reveal-delay="140"
            >
              Buchen Sie Ihre Küchenberatung exklusiv in einem unserer 8
              Showrooms!
            </p>
            <AnchorLink
              href="#fragebogen"
              className={shared.btnOutline}
              data-reveal="rise"
              data-reveal-delay="240"
            >
              Termin buchen
            </AnchorLink>

            <div className={styles.stats}>
              <div>
                <div className={styles.statNum} data-count>
                  8
                </div>
                <div className={styles.statLabel}>Showrooms</div>
              </div>
              <div>
                <div className={styles.statNum} data-count>
                  1
                </div>
                <div className={styles.statLabel}>Planungsteam</div>
              </div>
            </div>
          </div>

          <ul className={styles.list}>
            {showrooms.map((city, i) => (
              <li key={city}>
                <MaybeLink href={routes.showrooms} className={styles.row}>
                  <span className={styles.rowNum}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={shared.cardTitle}>{city}</span>
                  <span className={styles.rowArrow} aria-hidden="true">
                    →
                  </span>
                </MaybeLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
