import type { CSSProperties, ReactNode } from "react";
import type { SpaceStep } from "./spacing";
import styles from "./Stat.module.css";

type Props = {
  /** Counts up on reveal — `data-count` drives the animation. */
  value: ReactNode;
  label?: ReactNode;
  /** Space under the value, for stat blocks that carry a card body instead. */
  gap?: SpaceStep;
};

export default function Stat({ value, label, gap }: Props) {
  const style = (gap ? { "--stat-gap": `var(--space-${gap})` } : undefined) as
    CSSProperties | undefined;
  return (
    <div>
      <div className={styles.value} style={style} data-count>
        {value}
      </div>
      {label && <div className={styles.label}>{label}</div>}
    </div>
  );
}
