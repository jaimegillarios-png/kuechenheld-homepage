import { faqs } from "@/lib/content";
import Accordion from "./ui/Accordion";
import Section from "./ui/Section";
import { Eyebrow, Heading, Lede } from "./ui/SectionHeader";
import TextLink from "./ui/TextLink";
import styles from "./Faq.module.css";

export default function Faq() {
  return (
    <>
      <div data-rule className={styles.rule} />

      <Section>
        <Eyebrow gap={5}>Fragen &amp; Antworten</Eyebrow>

        <div className={styles.head}>
          <Heading measure="column">
            Häufige Fragen zum Thema Küche kaufen
          </Heading>
          <div>
            <Lede measure="default" gap={5}>
              Hier finden Sie Antworten auf die wichtigsten Fragen rund um den
              Küchenkauf. Von der Planung über die Auswahl der Materialien bis
              hin zur Lieferung – wir helfen Ihnen, Ihre Traumküche mit
              Leichtigkeit zu realisieren.
            </Lede>
            <TextLink
              href="#fragebogen"
              data-reveal="rise"
              data-reveal-delay={240}
            >
              Kostenlose Beratung
            </TextLink>
          </div>
        </div>

        <Accordion items={faqs} />
      </Section>
    </>
  );
}
