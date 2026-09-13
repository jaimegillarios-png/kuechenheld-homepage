import Button from "./ui/Button";
import { heroSlides } from "@/lib/content";
import styles from "./HeroCentered.module.css";

/**
 * The centred hero — the conventional one: a single photograph, the type
 * stacked on top of it.
 *
 * It sits beside `Hero` rather than replacing it. The split hero is the
 * site's own composition and it still runs on `/`; this is the variant on
 * `/home-b`, so the two can be looked at against each other.
 *
 * It carries no carousel and no state, so unlike `Hero` it is not an island:
 * Astro renders it to HTML and it ships no JS. The entrance comes from the
 * shared `data-enter` ladder in globals.css, which is CSS and needs none.
 */

/** The second slide of the split hero's carousel, as a still. */
const slide = heroSlides[1];

export default function HeroCentered() {
  return (
    <section className={styles.hero}>
      <img
        src={slide.src}
        alt={slide.alt}
        sizes="100vw"
        loading="eager"
        className={styles.photo}
      />
      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.inner}>
        <h1 className={styles.h1}>
          <span className={styles.clip}>
            <span data-enter="line" data-enter-delay="1">
              Küche kaufen
            </span>
          </span>
          <span className={styles.clip}>
            <span data-enter="line" data-enter-delay="2">
              von zuhause aus
            </span>
          </span>
        </h1>

        <p className={styles.lede} data-enter="rise" data-enter-delay="4">
          Küche online kaufen vom Sofa aus oder bei uns vor Ort in einem
          unserer 8 Showrooms deutschlandweit. Kein Risiko: Preisgarantie bis
          Ende 2026.
        </p>

        <div className={styles.actions} data-enter="rise" data-enter-delay="5">
          <Button href="#fragebogen" variant="cream">
            Küchenwünsche angeben
          </Button>
        </div>
      </div>

      <div className={styles.caption} data-enter="fade" data-enter-delay="6">
        <span>{slide.model}</span>
        <span>{slide.city}</span>
      </div>
    </section>
  );
}
