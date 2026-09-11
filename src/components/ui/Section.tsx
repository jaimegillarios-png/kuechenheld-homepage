import type { ReactNode } from "react";
import styles from "./Section.module.css";

export type SectionTone =
  "paper" | "warm" | "cream" | "inverse" | "inverse-raised";

/**
 * `section` is the shared vertical rhythm. `tight` is the one band that runs a
 * step shorter; `lead` and `trail` are the two halves of a head/body pair that
 * reads as a single section, so the seam between them carries no padding.
 * `flush` is for sections that lay out edge to edge and pad their own columns.
 */
export type SectionRhythm =
  "section" | "tight" | "masthead" | "lead" | "trail" | "flush";

type Props = {
  id?: string;
  tone?: SectionTone;
  rhythm?: SectionRhythm;
  /** Hold the content to the shared max-width. Off for edge-to-edge splits. */
  contained?: boolean;
  className?: string;
  children: ReactNode;
};

const TONE = {
  paper: undefined,
  warm: styles.warm,
  cream: styles.cream,
  inverse: styles.inverse,
  "inverse-raised": styles.inverseRaised,
} as const;

const RHYTHM = {
  section: styles.section,
  tight: styles.tight,
  masthead: styles.masthead,
  lead: styles.lead,
  trail: styles.trail,
  flush: styles.flush,
} as const;

export default function Section({
  id,
  tone = "paper",
  rhythm = "section",
  contained = true,
  className,
  children,
}: Props) {
  const classes = [RHYTHM[rhythm], TONE[tone], className]
    .filter(Boolean)
    .join(" ");
  return (
    <section id={id} className={classes}>
      {contained ? (
        <div className={styles.container}>{children}</div>
      ) : (
        children
      )}
    </section>
  );
}
