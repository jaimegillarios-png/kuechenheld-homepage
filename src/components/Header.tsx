"use client";

import { useEffect, useRef, useState } from "react";
import MaybeLink from "./MaybeLink";
import { navItems, routes } from "@/lib/content";
import { asset } from "@/lib/site";
import { prefersReducedMotion } from "@/lib/motion";
import styles from "./Header.module.css";

type Props = {
  items?: readonly { href: string; label: string }[];
  /** Falls back to the site wordmark. */
  wordmark?: string;
};

export default function Header({
  items = navItems,
  wordmark = "Küchenheld",
}: Props) {
  const headerRef = useRef<HTMLElement>(null);
  const [navOpen, setNavOpen] = useState(false);

  // Hide on scroll-down past 120px, bring back on scroll-up. Driven directly on
  // the node rather than through state so it never costs a React render.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    let last = window.scrollY;
    let hidden = false;
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const past = y > 120;

      if (!prefersReducedMotion()) {
        if (past && y > last + 6 && !hidden) {
          hidden = true;
          el.style.transform = "translateY(-100%)";
        } else if ((!past || y < last - 6) && hidden) {
          hidden = false;
          el.style.transform = "none";
        }
      }

      el.style.borderBottomColor = y > 24 ? "var(--color-rule)" : "transparent";
      el.style.boxShadow =
        y > 24 && !hidden ? "var(--elevation-header)" : "none";
      last = y;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Lock the page behind the full-screen overlay, and let Escape close it.
  useEffect(() => {
    if (!navOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [navOpen]);

  return (
    <>
      <header ref={headerRef} className={styles.header}>
        <a
          href={asset("/")}
          className={styles.wordmark}
          data-enter="nav"
          data-enter-delay="1"
        >
          {wordmark}
        </a>

        <nav
          className={styles.nav}
          aria-label="Hauptnavigation"
          data-enter="nav"
          data-enter-delay="2"
        >
          {items.map((item) => (
            <a key={item.href} href={item.href} data-ul>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions} data-enter="nav" data-enter-delay="3">
          <MaybeLink href={routes.login} data-ul className={styles.action}>
            Einloggen
          </MaybeLink>
          <a href="#fragebogen" data-ul2 className={styles.actionRuled}>
            Termin buchen
          </a>
        </div>

        <button
          type="button"
          className={styles.burger}
          data-enter="nav"
          data-enter-delay="3"
          aria-label="Menü öffnen"
          aria-expanded={navOpen}
          aria-controls="mobile-nav"
          onClick={() => setNavOpen(true)}
        >
          <span />
          <span />
        </button>
      </header>

      {navOpen && (
        <div
          id="mobile-nav"
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.overlayTop}>
            <a href={asset("/")} className={styles.overlayWordmark}>
              {wordmark}
            </a>
            <button
              type="button"
              className={styles.close}
              aria-label="Menü schließen"
              onClick={() => setNavOpen(false)}
            >
              ×
            </button>
          </div>

          <nav className={styles.overlayNav} aria-label="Hauptnavigation">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={styles.overlayItem}
                onClick={() => setNavOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className={styles.overlayFoot}>
            <a
              href="#fragebogen"
              className={styles.overlayCta}
              onClick={() => setNavOpen(false)}
            >
              Termin buchen
            </a>
            <MaybeLink href={routes.login} className={styles.overlayLogin}>
              Einloggen
            </MaybeLink>
          </div>
        </div>
      )}
    </>
  );
}
