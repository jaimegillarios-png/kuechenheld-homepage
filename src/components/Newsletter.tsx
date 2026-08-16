"use client";

import { useState, type FormEvent } from "react";
import styles from "./Footer.module.css";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // INTEGRATION POINT: post `email` to the newsletter provider. The design
    // has no success or error state, so agree on one before wiring this up.
  };

  return (
    <>
      <div className={styles.newsletterEyebrow}>Newsletter abonnieren</div>
      <p className={styles.newsletterBody}>
        Mit unserem Newsletter erhalten Sie regelmäßig spannende Infos rund um
        moderne Küchenplanung und erfahren alles über die neusten Küchentrends.
      </p>

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
          Anmelden
        </button>
      </form>
    </>
  );
}
