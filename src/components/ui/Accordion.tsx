"use client";

import { useId, useState } from "react";
import styles from "./Accordion.module.css";

export type AccordionItem = { q: string; a: string };

type Props = {
  items: AccordionItem[];
  /** Opening one closes the rest. The only mode the design has. */
  singleOpen?: boolean;
};

export default function Accordion({ items, singleOpen = true }: Props) {
  const [openIdx, setOpenIdx] = useState(-1);
  const baseId = useId();

  return (
    <div className={styles.list}>
      {items.map((item, i) => {
        const open = openIdx === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        return (
          <div key={item.q} className={styles.item}>
            <button
              type="button"
              id={buttonId}
              className={styles.row}
              data-reveal-stagger
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenIdx(open || !singleOpen ? -1 : i)}
            >
              <span className={styles.num}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles.question}>{item.q}</span>
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
                    <p className={styles.answer}>{item.a}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
