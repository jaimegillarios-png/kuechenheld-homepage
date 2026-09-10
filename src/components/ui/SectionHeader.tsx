import type { CSSProperties, ReactNode } from "react";
import type { SpaceStep } from "./spacing";
import styles from "./SectionHeader.module.css";

/** Two widths cover every heading on the page; three cover every lede. */
export type HeadingMeasure = "column" | "wide" | "full" | "none";
export type LedeMeasure = "tight" | "default" | "wide";
export type Tone = "light" | "inverse";

const HEADING_MEASURE: Record<HeadingMeasure, string | undefined> = {
  column: styles.measureColumn,
  wide: styles.measureWide,
  full: styles.measureFull,
  none: undefined,
};

const LEDE_MEASURE = {
  tight: styles.ledeTight,
  default: styles.ledeDefault,
  wide: styles.ledeWide,
} as const;

const cx = (...v: (string | false | undefined)[]) =>
  v.filter(Boolean).join(" ");

// Spacing-scale steps only — the SpaceStep type keeps this closed.
const gapStyle = (name: string, step?: SpaceStep) =>
  (step ? { [name]: `var(--space-${step})` } : undefined) as
    CSSProperties | undefined;

/* --- parts ---------------------------------------------------------------- */
/* Four of the nine heads split their eyebrow, heading and lede across a grid,
   so the three parts are the component and `SectionHeader` is the convenience
   wrapper for the five that stack. */

export function Eyebrow({
  children,
  tone = "light",
  gap,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  gap?: SpaceStep;
  className?: string;
}) {
  return (
    <div
      className={cx(
        tone === "inverse" ? styles.eyebrowInverse : styles.eyebrow,
        className,
      )}
      style={gapStyle("--sh-gap-eyebrow", gap)}
      data-reveal="letter"
    >
      {children}
    </div>
  );
}

export function Heading({
  children,
  measure = "full",
  gap,
  hyphenate,
  className,
}: {
  children: ReactNode;
  measure?: HeadingMeasure;
  gap?: SpaceStep;
  hyphenate?: boolean;
  className?: string;
}) {
  return (
    <h2
      className={cx(
        styles.heading,
        HEADING_MEASURE[measure],
        hyphenate && styles.hyphenate,
        className,
      )}
      style={gapStyle("--sh-gap-heading", gap)}
      data-reveal="mask"
    >
      {children}
    </h2>
  );
}

export function Lede({
  children,
  tone = "light",
  measure = "default",
  gap,
  delay = 140,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  measure?: LedeMeasure;
  gap?: SpaceStep;
  delay?: number;
  className?: string;
}) {
  return (
    <p
      className={cx(
        tone === "inverse" ? styles.ledeInverse : styles.lede,
        LEDE_MEASURE[measure],
        className,
      )}
      style={gapStyle("--sh-gap-lede", gap)}
      data-reveal="rise"
      data-reveal-delay={delay}
    >
      {children}
    </p>
  );
}

/* --- the stacked head ----------------------------------------------------- */

type Props = {
  eyebrow?: ReactNode;
  heading: ReactNode;
  lede?: ReactNode;
  tone?: Tone;
  measure?: HeadingMeasure;
  ledeMeasure?: LedeMeasure;
  /** Per-slot bottom margins, as spacing-scale steps. */
  gaps?: { eyebrow?: SpaceStep; heading?: SpaceStep; lede?: SpaceStep };
  hyphenate?: boolean;
  /** Rendered after the lede — a CTA, usually. */
  children?: ReactNode;
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  heading,
  lede,
  tone = "light",
  measure = "full",
  ledeMeasure = "default",
  gaps,
  hyphenate,
  children,
  className,
}: Props) {
  return (
    <div className={className}>
      {eyebrow && (
        <Eyebrow tone={tone} gap={gaps?.eyebrow}>
          {eyebrow}
        </Eyebrow>
      )}
      <Heading measure={measure} gap={gaps?.heading} hyphenate={hyphenate}>
        {heading}
      </Heading>
      {lede && (
        <Lede tone={tone} measure={ledeMeasure} gap={gaps?.lede}>
          {lede}
        </Lede>
      )}
      {children}
    </div>
  );
}
