import { routes, showrooms } from "@/lib/content";
import Button from "./ui/Button";
import IndexList from "./ui/IndexList";
import Section from "./ui/Section";
import { Eyebrow, Heading, Lede } from "./ui/SectionHeader";
import Stat from "./ui/Stat";
import styles from "./Locations.module.css";

export default function Locations() {
  return (
    <>
      <div data-rule className={styles.rule} />

      <Section id="standorte" contained={false}>
        <div className={styles.inner}>
          <div>
            <Eyebrow>Standorte</Eyebrow>
            <Heading measure="column">
              Küche kaufen leicht gemacht: Online planen, vor Ort erleben
            </Heading>
            <Lede measure="tight" gap="action">
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

          <IndexList items={showrooms} href={routes.showrooms} />
        </div>
      </Section>
    </>
  );
}
