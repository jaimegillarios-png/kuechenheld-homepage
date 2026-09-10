import { routes, showrooms } from "@/lib/content";
import MaybeLink from "./MaybeLink";
import Button from "./ui/Button";
import Section from "./ui/Section";
import { Eyebrow, Heading, Lede } from "./ui/SectionHeader";
import Stat from "./ui/Stat";
import shared from "@/styles/shared.module.css";
import styles from "./Locations.module.css";

export default function Locations() {
  return (
    <>
      <div data-rule className={styles.rule} />

      <Section id="standorte" contained={false}>
        <div className={styles.inner}>
          <div>
            <Eyebrow gap={5}>Standorte</Eyebrow>
            <Heading measure="column" gap={4}>
              Küche kaufen leicht gemacht: Online planen, vor Ort erleben
            </Heading>
            <Lede measure="tight" gap={6}>
              Buchen Sie Ihre Küchenberatung exklusiv in einem unserer 8
              Showrooms!
            </Lede>
            <Button
              href="#fragebogen"
              variant="outline"
              data-reveal="rise"
              data-reveal-delay={240}
            >
              Termin buchen
            </Button>

            <div className={styles.stats}>
              <Stat value="8" label="Showrooms" />
              <Stat value="1" label="Planungsteam" />
            </div>
          </div>

          <ul className={styles.list}>
            {showrooms.map((city, i) => (
              <li key={city}>
                <MaybeLink
                  href={routes.showrooms}
                  className={styles.row}
                  data-reveal-stagger
                >
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
      </Section>
    </>
  );
}
