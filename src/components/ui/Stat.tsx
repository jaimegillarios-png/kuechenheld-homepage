import type { ReactNode } from "react";
import styles from "./Stat.module.css";

type Props = {
  /** Counts up on reveal — `data-count` drives the animation. */
  value: ReactNode;
  label?: ReactNode;
};

export default function Stat({ value, label }: Props) {
  return (
    <div>
      <div className={styles.value} data-count>
        {value}
      </div>
      {label && <div className={styles.label}>{label}</div>}
    </div>
  );
}
