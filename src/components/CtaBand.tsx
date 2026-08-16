import Image from "next/image";
import AnchorLink from "./AnchorLink";
import { ctaBandImage } from "@/lib/content";
import shared from "@/styles/shared.module.css";
import styles from "./CtaBand.module.css";

const reassurance = ["Unverbindlich", "Kostenlos", "In 24 Stunden"];

export default function CtaBand() {
  return (
    <section className={styles.section}>
      <div className={styles.media}>
        <Image
          src={ctaBandImage.src}
          alt={ctaBandImage.alt}
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
          data-parallax
          className={styles.photo}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.eyebrow} data-reveal="letter">
          Küchenkauf starten
        </div>
        <h2 className={styles.heading} data-reveal="mask">
          Angebot mit Preisindikation für Ihre Traumküche
        </h2>
        <p className={styles.lead} data-reveal="rise" data-reveal-delay="140">
          Einfach Ihre Vorstellungen einer Traumküche angeben und wir erstellen
          individuell für Sie Ihr unverbindliches, kostenloses Angebot.
        </p>
        <AnchorLink
          href="#fragebogen"
          className={shared.btnCream}
          data-reveal="rise"
          data-reveal-delay="240"
        >
          Kostenloses Angebot erhalten
        </AnchorLink>

        <div className={styles.reassurance}>
          {reassurance.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
