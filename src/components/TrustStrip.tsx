import { trustStrip } from "@/lib/content";
import styles from "./TrustStrip.module.css";

export default function TrustStrip() {
  return (
    <div className={styles.strip}>
      {trustStrip.map((item, i) => (
        <div
          key={item}
          className={styles.cell}
          style={{ animation: `khRise .9s ease ${1.1 + i * 0.1}s both` }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
