"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import AnchorLink from "./AnchorLink";
import { heroSlides } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/motion";
import shared from "@/styles/shared.module.css";
import styles from "./Hero.module.css";

const SLIDE_MS = 8600;
const CURTAIN = "1.7s cubic-bezier(.62,.02,.24,1) both";

/** `children` is the trust strip — hero and strip together fill the first screen. */
export default function Hero({ children }: { children?: React.ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const edgeRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (heroSlides.length < 2 || prefersReducedMotion()) return;

    const section = sectionRef.current;
    if (!section) return;

    let index = 0;
    let timer = 0;

    const advance = () => {
      const previous = index;
      index = (index + 1) % heroSlides.length;

      slideRefs.current.forEach((slide, i) => {
        if (!slide) return;
        if (i === index) return;
        // The outgoing slide stays underneath; everything else resets out of
        // the way, so the z-index never grows without bound.
        slide.style.zIndex = i === previous ? "1" : "0";
        if (i !== previous) {
          slide.style.animation = "none";
          slide.style.clipPath = "inset(0 0 0 100%)";
        }
      });

      const el = slideRefs.current[index];
      if (el) {
        el.style.zIndex = "2";
        el.style.animation = "none";
        void el.offsetWidth; // force a reflow so the animation restarts
        el.style.clipPath = "";
        el.style.animation = `khImgIn ${CURTAIN}`;

        const lag = el.querySelector<HTMLElement>("[data-hero-lag]");
        if (lag) {
          lag.style.animation = "none";
          void lag.offsetWidth;
          lag.style.animation = `khSlideLag ${CURTAIN}`;
        }
        const img = el.querySelector("img");
        if (img) {
          img.style.animation = "none";
          void img.offsetWidth;
          img.style.animation = "khHeroDrift 9s linear both";
        }
      }

      const edge = edgeRef.current;
      if (edge) {
        edge.style.animation = "none";
        void edge.offsetWidth;
        edge.style.animation = `khEdge ${CURTAIN}`;
      }

      setActive(index);
    };

    const start = () => {
      if (timer) return;
      timer = window.setInterval(advance, SLIDE_MS);
    };
    const stop = () => {
      window.clearInterval(timer);
      timer = 0;
    };

    // Don't burn frames on a hero that has scrolled out of view.
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.15 },
    );
    io.observe(section);

    return () => {
      io.disconnect();
      stop();
    };
  }, []);

  return (
    <div className={styles.wrap}>
      <section ref={sectionRef} className={styles.hero}>
        <div className={styles.rail} aria-hidden="true">
          <span className={styles.railNum}>01</span>
          <span className={styles.railVertical}>Küchenheld — seit 2019</span>
          <span className={styles.railTick} />
        </div>

        <div className={styles.text}>
          <div className={styles.eyebrow}>Küchen, individuell geplant</div>

          <h1 className={styles.h1}>
            <span className={styles.clip}>
              <span className={styles.line1}>Küche kaufen</span>
            </span>
            <span className={styles.clip}>
              <span className={styles.line2}>von zuhause</span>
            </span>
            <span className={styles.clip}>
              <span className={styles.line3}>aus</span>
            </span>
          </h1>

          <div className={styles.rule} />

          <p className={styles.lead}>
            Küche online kaufen vom Sofa aus oder bei uns vor Ort in einem
            unserer 8 Showrooms deutschlandweit. Kein Risiko: Preisgarantie bis
            Ende 2026.
          </p>

          <div className={styles.ctas}>
            <AnchorLink href="#fragebogen" className={shared.btnPrimary}>
              Küchenwünsche angeben
            </AnchorLink>
            <AnchorLink href="#standorte" data-ul2 className={styles.secondary}>
              Showrooms ansehen
            </AnchorLink>
          </div>
        </div>

        <div className={styles.media}>
          {heroSlides.map((slide, i) => (
            <div
              key={slide.src}
              ref={(node) => {
                slideRefs.current[i] = node;
              }}
              className={styles.slide}
              style={
                i === 0
                  ? { zIndex: 1, animation: `khImgIn ${CURTAIN}` }
                  : { zIndex: 2, clipPath: "inset(0 0 0 100%)" }
              }
              aria-hidden={i === active ? undefined : true}
            >
              <div
                data-hero-lag
                className={styles.lag}
                style={
                  i === 0 ? { animation: `khSlideLag ${CURTAIN}` } : undefined
                }
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 560px) 100vw, (max-width: 900px) 100vw, 50vw"
                  priority={i === 0}
                  className={styles.photo}
                />
                <div
                  className={styles.caption}
                  style={{
                    animation: `khFade 1.2s ease ${i === 0 ? "1.2s" : ".5s"} both`,
                  }}
                >
                  <span>{slide.model}</span>
                  <span>{slide.city}</span>
                </div>
              </div>
            </div>
          ))}

          <div ref={edgeRef} className={styles.edge} aria-hidden="true" />

          <div className={styles.dots} aria-hidden="true">
            {heroSlides.map((slide, i) => (
              <span
                key={slide.src}
                className={styles.dot}
                style={{ opacity: i === active ? 1 : 0.35 }}
              />
            ))}
          </div>
        </div>
      </section>

      {children}
    </div>
  );
}
