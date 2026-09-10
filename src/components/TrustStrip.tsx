import { trustStrip } from "@/lib/content";
import styles from "./TrustStrip.module.css";

type Props = {
  items?: readonly string[];
  /** Seconds before the first cell rises — it trails the hero's own sequence. */
  staggerFrom?: number;
};

export default function TrustStrip({
  items = trustStrip,
  staggerFrom = 1.1,
}: Props) {
  return (
    <div className={styles.strip}>
      {items.map((item, i) => (
        <div
          key={item}
          className={styles.cell}
          style={{
            // Delay is computed per cell, so it stays a literal.
            animation: `var(--kf-rise) 0.9s ease ${staggerFrom + i * 0.1}s both`,
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
