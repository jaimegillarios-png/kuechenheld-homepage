"use client";

import { useCallback, useState, type RefObject } from "react";

/**
 * Native horizontal scroll-snap rail: the arrows advance by exactly one card
 * (card width + column gap) and only become visible while the rail is hovered.
 *
 * The caller owns the ref and passes it in, so nothing ref-shaped is handed
 * back through render.
 */
export function useRail<T extends HTMLElement>(ref: RefObject<T | null>) {
  const [hovered, setHovered] = useState(false);

  const scrollBy = useCallback(
    (direction: 1 | -1) => {
      const el = ref.current;
      if (!el) return;
      const card = el.firstElementChild;
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      const step = card
        ? card.getBoundingClientRect().width + gap
        : el.clientWidth / 4;
      el.scrollBy({ left: direction * step, behavior: "smooth" });
    },
    [ref],
  );

  return {
    prev: useCallback(() => scrollBy(-1), [scrollBy]),
    next: useCallback(() => scrollBy(1), [scrollBy]),
    arrowOpacity: hovered ? 1 : 0,
    hoverProps: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
    },
  };
}
