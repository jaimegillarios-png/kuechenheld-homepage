import type { CSSProperties, ReactNode } from "react";
import type { SectionTone } from "./Section";
import sectionStyles from "./Section.module.css";
import styles from "./SplitSection.module.css";

type Props = {
  id?: string;
  media: ReactNode;
  children: ReactNode;
  tone?: SectionTone;
  /** Media column height, in px, wide and at ≤900px. Structural, not a scale. */
  mediaMinHeight: number;
  mediaMinHeightNarrow: number;
  /** The rail media lays its slides out absolutely, so it must not clip. */
  mediaKind?: "photo" | "rail";
  /** Let the content sit at the top of its column instead of centring. */
  contentAlign?: "center" | "top";
  /** `tall` gives the content column the next spacing step of vertical room. */
  contentRhythm?: "default" | "tall";
  /** Both tracks shrinkable — needed when a column holds an overflow rail. */
  even?: boolean;
  mediaProps?: Record<string, unknown>;
  className?: string;
};

const TONE: Record<SectionTone, string | undefined> = {
  paper: undefined,
  warm: sectionStyles.warm,
  cream: sectionStyles.cream,
  inverse: sectionStyles.inverse,
  "inverse-raised": sectionStyles.inverseRaised,
};

const cx = (...v: (string | false | undefined)[]) =>
  v.filter(Boolean).join(" ");

export default function SplitSection({
  id,
  media,
  children,
  tone = "paper",
  mediaMinHeight,
  mediaMinHeightNarrow,
  mediaKind = "photo",
  contentAlign = "center",
  contentRhythm = "default",
  even,
  mediaProps,
  className,
}: Props) {
  const style = {
    "--split-media-min-height": `${mediaMinHeight}px`,
    "--split-media-min-height-narrow": `${mediaMinHeightNarrow}px`,
  } as CSSProperties;

  return (
    <section
      id={id}
      className={cx(styles.section, even && styles.even, TONE[tone], className)}
      style={style}
    >
      <div
        className={cx(styles.media, mediaKind === "rail" && styles.mediaRail)}
        {...mediaProps}
      >
        {media}
      </div>
      <div
        className={cx(
          styles.content,
          contentAlign === "top" && styles.contentTop,
          contentRhythm === "tall" && styles.contentTall,
        )}
      >
        {children}
      </div>
    </section>
  );
}
