"use client";

import type { ReactNode, RefObject } from "react";
import styles from "./Rail.module.css";

type Props = {
  railRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  /** Cards flow with a gutter between them; full-bleed slides butt together. */
  gapped?: boolean;
  /** Fill the parent absolutely, for a rail that is its column's background. */
  filled?: boolean;
  /** Stretch items so a short card still rules off level with a tall one. */
  stretch?: boolean;
  /** ms between each card's reveal. */
  staggerStep?: number;
};

const cx = (...v: (string | false | undefined)[]) =>
  v.filter(Boolean).join(" ");

export default function Rail({
  railRef,
  children,
  gapped,
  filled,
  stretch,
  staggerStep = 110,
}: Props) {
  return (
    <div
      ref={railRef}
      className={cx(
        styles.rail,
        gapped && styles.gapped,
        filled && styles.filled,
        stretch && styles.stretch,
      )}
      data-rail
      data-reveal-stagger
      data-reveal-stagger-step={staggerStep}
    >
      {children}
    </div>
  );
}
