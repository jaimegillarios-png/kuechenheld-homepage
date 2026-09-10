"use client";

import type { ReactNode } from "react";
import styles from "./OverlayArrows.module.css";

type Props = {
  onPrev: () => void;
  onNext: () => void;
  /** 0 until the rail is hovered — the hook owns the state. */
  opacity: number;
  labels: { prev: string; next: string };
  /**
   * A `band` lays the arrows over a spacer so they centre on the card's image
   * rather than on the whole card. Pass the spacer as `spacer`.
   */
  spacer?: ReactNode;
};

export default function OverlayArrows({
  onPrev,
  onNext,
  opacity,
  labels,
  spacer,
}: Props) {
  const banded = spacer !== undefined;
  const prev = (
    <button
      type="button"
      aria-label={labels.prev}
      className={banded ? styles.bandPrev : styles.prev}
      style={{ opacity }}
      onClick={onPrev}
    >
      ←
    </button>
  );
  const next = (
    <button
      type="button"
      aria-label={labels.next}
      className={banded ? styles.bandNext : styles.next}
      style={{ opacity }}
      onClick={onNext}
    >
      →
    </button>
  );

  if (!banded) {
    return (
      <>
        {prev}
        {next}
      </>
    );
  }
  return (
    <div className={styles.band} aria-hidden={opacity === 0}>
      {spacer}
      {prev}
      {next}
    </div>
  );
}
