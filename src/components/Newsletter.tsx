"use client";

import { useState, type FormEvent } from "react";
import styles from "./Footer.module.css";

type Props = {
  eyebrow?: string;
  body?: string;
  submitLabel?: string;
  /** INTEGRATION POINT: the design has no success or error state, so agree on
   *  one before wiring this up. */
  onSubscribe?: (email: string) => void;
};

export default function Newsletter({
  eyebrow = "Newsletter abonnieren",
  body = "Mit unserem Newsletter erhalten Sie regelmäßig spannende Infos rund um moderne Küchenplanung und erfahren alles über die neusten Küchentrends.",
  submitLabel = "Anmelden",
  onSubscribe,
}: Props) {
  const [email, setEmail] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubscribe?.(email);
  };

  return (
    <>
      <div className={styles.newsletterEyebrow}>{eyebrow}</div>
      <p className={styles.newsletterBody}>{body}</p>

      <form className={styles.newsletterForm} onSubmit={onSubmit}>
        <label htmlFor="newsletter-email" className={styles.srOnly}>
          E-Mail-Adresse
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          placeholder="E-Mail-Adresse"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.newsletterInput}
        />
        <button type="submit" className={styles.newsletterSubmit}>
          {submitLabel}
        </button>
      </form>
    </>
  );
}
