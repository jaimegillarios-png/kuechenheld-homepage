import AnchorLink from "./AnchorLink";
import shared from "@/styles/shared.module.css";
import styles from "./OfferCompare.module.css";

export default function OfferCompare() {
  return (
    <section className={styles.section}>
      <div className={shared.container}>
        <h2 className={styles.heading} data-reveal="mask">
          Haben Sie schon ein Angebot? Vergleichen lohnt sich!
        </h2>
        <p className={styles.lead} data-reveal="rise" data-reveal-delay="140">
          Nutzen Sie unseren Angebotsvergleich-Service und sichern Sie sich das
          bestmögliche Angebot für Ihre Traumküche!
        </p>
        <AnchorLink
          href="#fragebogen"
          className={shared.btnOutline}
          data-reveal="rise"
          data-reveal-delay="240"
        >
          Jetzt Angebot vergleichen
        </AnchorLink>
      </div>
    </section>
  );
}
