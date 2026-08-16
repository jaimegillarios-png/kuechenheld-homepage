"use client";

import { useId, useState } from "react";
import AnchorLink from "./AnchorLink";
import { faqs } from "@/lib/content";
import shared from "@/styles/shared.module.css";
import styles from "./Faq.module.css";

export default function Faq() {
  const [openIdx, setOpenIdx] = useState(-1);
  const baseId = useId();

  return (
    <>
      <div data-rule className={styles.rule} />

      <section className={styles.section}>
        <div className={styles.inner}>
          <div className={styles.eyebrow} data-reveal="letter">
            Fragen &amp; Antworten
          </div>

          <div className={styles.head}>
            <h2 className={styles.heading} data-reveal="mask">
              Häufige Fragen zum Thema Küche kaufen
            </h2>
            <div>
              <p
                className={styles.lead}
                data-reveal="rise"
                data-reveal-delay="140"
              >
                Hier finden Sie Antworten auf die wichtigsten Fragen rund um den
                Küchenkauf. Von der Planung über die Auswahl der Materialien bis
                hin zur Lieferung – wir helfen Ihnen, Ihre Traumküche mit
                Leichtigkeit zu realisieren.
              </p>
              <AnchorLink
                href="#fragebogen"
                data-ul2
                className={shared.linkUnderline}
                data-reveal="rise"
                data-reveal-delay="240"
              >
                Kostenlose Beratung
              </AnchorLink>
            </div>
          </div>

          <div className={styles.list}>
            {faqs.map((faq, i) => {
              const open = openIdx === i;
              const panelId = `${baseId}-panel-${i}`;
              const buttonId = `${baseId}-button-${i}`;
              return (
                <div key={faq.q} className={styles.item}>
                  <button
                    type="button"
                    id={buttonId}
                    className={styles.row}
                    data-reveal-stagger
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIdx(open ? -1 : i)}
                  >
                    <span className={styles.num}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={shared.cardTitle}>{faq.q}</span>
                    <span
                      className={styles.sign}
                      style={{ transform: `rotate(${open ? 45 : 0}deg)` }}
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </button>

                  {open && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={styles.panel}
                    >
                      <div className={styles.panelClip}>
                        <div className={styles.answerRow}>
                          <span />
                          <p className={styles.answer}>{faq.a}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
