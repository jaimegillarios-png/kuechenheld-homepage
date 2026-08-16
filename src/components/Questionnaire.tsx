"use client";

import Image from "next/image";
import { useState } from "react";
import { kitchenForms } from "@/lib/content";
import shared from "@/styles/shared.module.css";
import styles from "./Questionnaire.module.css";

export default function Questionnaire() {
  const [picked, setPicked] = useState<string | null>(null);
  const pickedForm = kitchenForms.find((f) => f.id === picked);

  return (
    <section id="fragebogen" className={styles.section}>
      <div className={shared.container}>
        <div className={styles.stepEyebrow} data-reveal="letter">
          Schritt 1 von 4 — Küchenform
        </div>

        <h2 className={styles.heading} data-reveal="mask">
          Jetzt Ihre Küchenwünsche angeben und ein kostenloses Angebot erhalten
        </h2>

        <div className={styles.meta} data-reveal="rise" data-reveal-delay="140">
          Kostenlos · 2 Minuten · Unverbindlich
        </div>

        <fieldset className={styles.grid} data-reveal-stagger>
          <legend className={styles.srOnly}>Küchenform wählen</legend>
          {kitchenForms.map((form) => {
            const selected = picked === form.id;
            return (
              <button
                key={form.id}
                type="button"
                role="radio"
                aria-checked={selected}
                className={styles.card}
                onClick={() => setPicked(form.id)}
              >
                {selected && (
                  <>
                    <span className={styles.cardRing} aria-hidden="true" />
                    <span className={styles.cardCheck} aria-hidden="true">
                      ✓
                    </span>
                  </>
                )}
                <Image
                  src={form.icon}
                  alt=""
                  width={104}
                  height={80}
                  data-reveal="wipe"
                  className={styles.icon}
                />
                <span className={shared.label}>{form.label}</span>
              </button>
            );
          })}
        </fieldset>

        <div className={styles.foot}>
          <button type="button" className={styles.otherForm}>
            Andere Küchenform / steht noch nicht fest
          </button>

          {pickedForm && (
            <div className={styles.continue}>
              <span className={styles.pickedNote}>
                {pickedForm.label} ausgewählt
              </span>
              <button type="button" className={styles.continueBtn}>
                Weiter
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
