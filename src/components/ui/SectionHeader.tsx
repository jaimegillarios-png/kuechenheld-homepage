import type { ReactNode } from "react";
import styles from "./SectionHeader.module.css";

/** Two widths cover every heading on the page; three cover every lede. */
export type HeadingMeasure = "column" | "wide" | "full" | "none";
export type LedeMeasure = "tight" | "default" | "wide";
export type Tone = "light" | "inverse";

/**
 * How much room a head gives the action it invites. `open` is for a head that
 * is a vertically centred split column — the block floats in enough air that
 * the tighter step reads as attached to the lede.
 */
export type HeadGaps = "default" | "open";

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

/* --- parts ---------------------------------------------------------------- */
/* Nine of the eleven heads split their eyebrow, heading and lede across a grid
   or a split column, so the three parts are the component and `SectionHeader`
   is the convenience wrapper for the two that stack.
   A part used on its own cannot see what follows it, so it is told which gap
   tier sits underneath. The tiers are named, never a step. */

export function Eyebrow({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={cx(
        tone === "inverse" ? styles.eyebrowInverse : styles.eyebrow,
        className,
      )}
      data-reveal="letter"
    >
      {children}
    </div>
  );
}

export function Heading({
  children,
  measure = "full",
  /** `stack` when a lede follows; `none` when the heading ends the head. */
  gap = "stack",
  hyphenate,
  /**
   * The element, not the size — the size comes from the class either way.
   * `h2` is right for a section inside a page that already states its subject
   * somewhere else. A page whose own title this is passes `h1`; an index has
   * no hero to supply one.
   */
  as: Tag = "h2",
  className,
}: {
  children: ReactNode;
  measure?: HeadingMeasure;
  gap?: "stack" | "none";
  hyphenate?: boolean;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <Tag
      className={cx(
        styles.heading,
        HEADING_MEASURE[measure],
        hyphenate && styles.hyphenate,
        gap === "stack" && styles.gapStack,
        className,
      )}
      data-reveal="mask"
    >
      {children}
    </Tag>
  );
}

export function Lede({
  children,
  tone = "light",
  measure = "default",
  /** `none` when the lede ends the head and the body below owns the spacing. */
  gap = "none",
  delay = 140,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  measure?: LedeMeasure;
  gap?: "action" | "action-open" | "none";
  delay?: number;
  className?: string;
}) {
  return (
    <p
      className={cx(
        tone === "inverse" ? styles.ledeInverse : styles.lede,
        LEDE_MEASURE[measure],
        gap === "action" && styles.gapAction,
        gap === "action-open" && styles.gapActionOpen,
        className,
      )}
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
  gaps?: HeadGaps;
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
  gaps = "default",
  hyphenate,
  children,
  className,
}: Props) {
  // The stacked head can see what follows each slot, so it works its own gaps
  // out rather than being told them.
  const headingGap = lede ? "stack" : "none";
  const ledeGap = !children
    ? "none"
    : gaps === "open"
      ? "action-open"
      : "action";

  return (
    <div className={className}>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <Heading measure={measure} gap={headingGap} hyphenate={hyphenate}>
        {heading}
      </Heading>
      {lede && (
        <Lede tone={tone} measure={ledeMeasure} gap={ledeGap}>
          {lede}
        </Lede>
      )}
      {children}
    </div>
  );
}
