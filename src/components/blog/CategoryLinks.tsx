import MaybeLink from "../MaybeLink";
import styles from "./CategoryLinks.module.css";

export type CategoryLink = { name: string; href: string; current: boolean };

/**
 * The index's category row. Chips, not a filter: each is a real route, so a
 * category is crawlable and linkable and search stays one mechanism.
 *
 * The treatment is not new — a post's category already reads as an outlined
 * chip in the article breadcrumb (`ArticleHeader.module.css`). Same hairline,
 * same fill on hover; the current category is that fill held.
 */
export default function CategoryLinks({ items }: { items: CategoryLink[] }) {
  return (
    <nav className={styles.row} aria-label="Kategorien">
      {items.map((item) => (
        <MaybeLink
          key={item.href}
          href={item.href}
          aria-current={item.current ? "page" : undefined}
          className={item.current ? styles.current : styles.chip}
        >
          {item.name}
        </MaybeLink>
      ))}
    </nav>
  );
}
