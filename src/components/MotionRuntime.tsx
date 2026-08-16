"use client";

import { useEffect } from "react";
import {
  initCounters,
  initParallax,
  initRules,
  initScrollReveals,
} from "@/lib/motion";

/**
 * Wires up the page-level scroll choreography once the static markup is in the
 * DOM. Kept as one mount-time effect so every section can stay a server
 * component and simply tag itself with `data-reveal` / `data-parallax` / …
 */
export default function MotionRuntime() {
  useEffect(() => {
    const teardowns = [
      initScrollReveals(),
      initParallax(),
      initCounters(),
      initRules(),
    ];
    return () => teardowns.forEach((stop) => stop());
  }, []);

  return null;
}
