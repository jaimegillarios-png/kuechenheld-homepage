/**
 * Imperative scroll choreography.
 *
 * The design reference discovered its targets by sweeping the DOM (every `h2`,
 * every `section img`, …). Here the sections opt in explicitly instead:
 *
 *   data-reveal="mask" | "letter" | "wipe" | "rise"   — reveal kind
 *   data-reveal-delay="140"                            — extra delay in ms
 *   data-reveal-stagger                                — stagger direct children
 *   data-reveal-stagger-step="110"                     — ms between children
 *   data-parallax                                      — slow vertical drift
 *   data-count                                         — count the numeral up
 *   data-rule                                          — draw the hairline in
 *
 * Every routine returns its own teardown so React effects can clean up, and all
 * of them no-op under `prefers-reduced-motion: reduce`.
 */

const EASE = "cubic-bezier(.16,1,.3,1)";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

type RevealKind = "mask" | "letter" | "wipe" | "rise";

type RevealTarget = {
  el: HTMLElement;
  kind: RevealKind;
  delay: number;
  done?: boolean;
  restoreLetterSpacing?: string;
};

/** Elements already above the fold are left alone — they are visible on load. */
function isBelowFold(el: Element): boolean {
  return el.getBoundingClientRect().top > window.innerHeight * 0.92;
}

function collectRevealTargets(root: ParentNode): RevealTarget[] {
  const plan: RevealTarget[] = [];
  const seen = new WeakSet<HTMLElement>();

  const add = (el: HTMLElement, kind: RevealKind, delay: number) => {
    if (seen.has(el) || !isBelowFold(el)) return;
    // Anything taller than the viewport would reveal awkwardly, and sticky or
    // fixed elements must not be transformed at all.
    const { height } = el.getBoundingClientRect();
    const position = getComputedStyle(el).position;
    if (height > window.innerHeight * 1.3) return;
    if (position === "sticky" || position === "fixed") return;
    seen.add(el);
    plan.push({ el, kind, delay });
  };

  root
    .querySelectorAll<HTMLElement>("[data-reveal-stagger]")
    .forEach((grid) => {
      const step = Number(grid.dataset.revealStaggerStep) || 90;
      // Rails stagger only the cards that can be on screen when they arrive.
      const limit = grid.hasAttribute("data-rail") ? 4 : grid.children.length;
      Array.from(grid.children)
        .slice(0, limit)
        .forEach((child, i) => add(child as HTMLElement, "rise", i * step));
    });

  root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
    const kind = (el.dataset.reveal || "rise") as RevealKind;
    add(el, kind, Number(el.dataset.revealDelay) || 0);
  });

  return plan;
}

function hideForReveal(t: RevealTarget) {
  const { el, kind, delay } = t;
  const at = (prop: string) => `${prop} 1s ${EASE} ${delay}ms`;

  if (kind === "wipe") {
    el.style.clipPath = "inset(0 0 0 100%)";
    el.style.transform = "scale(1.06)";
    el.style.transition = `${at("clip-path")}, transform 1.6s ${EASE} ${delay}ms`;
  } else if (kind === "mask") {
    el.style.clipPath = "inset(0 0 108% 0)";
    el.style.transform = "translateY(14px)";
    el.style.transition = `${at("clip-path")}, ${at("transform")}`;
  } else if (kind === "letter") {
    t.restoreLetterSpacing = getComputedStyle(el).letterSpacing;
    el.style.opacity = "0";
    el.style.letterSpacing = "0.6em";
    el.style.transition = `opacity .9s ease ${delay}ms, letter-spacing 1.2s ${EASE} ${delay}ms`;
  } else {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = `opacity .9s ease ${delay}ms, ${at("transform")}`;
  }
}

function showRevealed(t: RevealTarget) {
  const { el, kind } = t;
  if (kind === "wipe") {
    el.style.clipPath = "inset(0 0 0 0)";
    el.style.transform = "none";
  } else if (kind === "mask") {
    // Slight vertical overshoot so descenders are not clipped once open.
    el.style.clipPath = "inset(-10% 0 -10% 0)";
    el.style.transform = "none";
  } else if (kind === "letter") {
    el.style.opacity = "1";
    el.style.letterSpacing = t.restoreLetterSpacing || ".28em";
  } else {
    el.style.opacity = "1";
    el.style.transform = "none";
  }
}

export function initScrollReveals(root: ParentNode = document): () => void {
  if (prefersReducedMotion()) return () => {};

  const plan = collectRevealTargets(root);
  if (!plan.length) return () => {};
  plan.forEach(hideForReveal);

  let raf = 0;
  let safety = 0;

  const check = () => {
    raf = 0;
    let pending = 0;
    plan.forEach((t) => {
      if (t.done) return;
      if (t.el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        t.done = true;
        showRevealed(t);
      } else {
        pending++;
      }
    });
    if (!pending) teardown();
  };

  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(check);
  };

  const teardown = () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    if (raf) cancelAnimationFrame(raf);
    if (safety) clearTimeout(safety);
    raf = 0;
    safety = 0;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  raf = requestAnimationFrame(check);

  // Safety net: nothing stays invisible if a first measurement was wrong.
  safety = window.setTimeout(() => {
    plan.forEach((t) => {
      if (t.done) return;
      if (t.el.getBoundingClientRect().top < window.innerHeight * 1.1) {
        t.done = true;
        showRevealed(t);
      }
    });
  }, 2500);

  return teardown;
}

export function initParallax(root: ParentNode = document): () => void {
  if (prefersReducedMotion()) return () => {};

  const els = Array.from(root.querySelectorAll<HTMLElement>("[data-parallax]"));
  if (!els.length) return () => {};

  // Oversize the image so the drift never exposes an edge.
  els.forEach((el) => {
    el.style.height = "118%";
    el.style.top = "-9%";
    el.style.willChange = "transform";
  });

  let raf = 0;
  const frame = () => {
    raf = 0;
    const vh = window.innerHeight;
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const progress = (r.top + r.height / 2 - vh / 2) / vh;
      el.style.transform = `translateY(${(progress * -46).toFixed(2)}px)`;
    });
  };
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  frame();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    if (raf) cancelAnimationFrame(raf);
  };
}

export function initCounters(root: ParentNode = document): () => void {
  if (prefersReducedMotion()) return () => {};

  const els = Array.from(root.querySelectorAll<HTMLElement>("[data-count]"));
  if (!els.length) return () => {};

  const format = new Intl.NumberFormat("de-DE");
  const frames = new Set<number>();

  const run = (el: HTMLElement) => {
    const raw = el.textContent?.trim() ?? "";
    const match = raw.match(/^([\d.,]+)(.*)$/);
    if (!match) return;
    const [, numeral, suffix] = match;
    // German notation: "." groups thousands, "," is the decimal separator.
    const decimals = numeral.includes(",")
      ? (numeral.split(",")[1] || "").length
      : 0;
    const target = parseFloat(numeral.replace(/\./g, "").replace(",", "."));
    if (!isFinite(target)) return;

    const duration = 1100;
    const start = performance.now();
    el.style.fontVariantNumeric = "tabular-nums";

    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = target * eased;
      el.textContent =
        (decimals
          ? value.toFixed(decimals).replace(".", ",")
          : format.format(Math.round(value))) + suffix;
      if (p < 1) frames.add(requestAnimationFrame(step));
      else el.textContent = raw;
    };
    frames.add(requestAnimationFrame(step));
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run(entry.target as HTMLElement);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.6 },
  );
  els.forEach((el) => io.observe(el));

  return () => {
    io.disconnect();
    frames.forEach(cancelAnimationFrame);
    frames.clear();
  };
}

export function initRules(root: ParentNode = document): () => void {
  if (prefersReducedMotion()) return () => {};

  const rules = Array.from(root.querySelectorAll<HTMLElement>("[data-rule]"));
  if (!rules.length) return () => {};

  rules.forEach((r) => {
    r.style.transformOrigin = "left";
    r.style.transform = "scaleX(0)";
    r.style.transition = `transform 1.4s ${EASE}`;
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).style.transform = "none";
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.5 },
  );
  rules.forEach((r) => io.observe(r));

  return () => io.disconnect();
}

/** Smooth-scrolls to a `#hash` target, 8px above its top edge. */
export function scrollToHash(hash: string) {
  const el = document.getElementById(hash.replace("#", ""));
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 8;
  window.scrollTo({
    top: y,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}
