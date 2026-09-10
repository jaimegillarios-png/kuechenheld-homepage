import MaybeLink from "../MaybeLink";
import styles from "./IndexList.module.css";

type Props = {
  items: string[];
  /** One destination for every row, until the individual routes exist. */
  href?: string | null;
};

export default function IndexList({ items, href }: Props) {
  return (
    <ul className={styles.list}>
      {items.map((item, i) => (
        <li key={item}>
          <MaybeLink href={href} className={styles.row} data-reveal-stagger>
            <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
            <span className={styles.label}>{item}</span>
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </MaybeLink>
        </li>
      ))}
    </ul>
  );
}
