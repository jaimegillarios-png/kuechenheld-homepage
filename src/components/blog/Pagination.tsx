import MaybeLink from "../MaybeLink";
import styles from "./Pagination.module.css";

type Props = {
  current: number;
  total: number;
  /** Builds the href for a page number. Page 1 is the bare route. */
  hrefFor: (page: number) => string;
};

/**
 * Numbered pages, not load-more. On a static site load-more leaves every page
 * after the first without a URL — nothing to crawl, link or come back to — on
 * the one page whose job is finding things.
 *
 * Ends render no control rather than a disabled one: there is nothing to press
 * on page 1, so there is nothing to show.
 */
export default function Pagination({ current, total, hrefFor }: Props) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <nav className={styles.nav} aria-label="Seiten">
      {current > 1 ? (
        <MaybeLink href={hrefFor(current - 1)} data-ul2 className={styles.step}>
          ← Zurück
        </MaybeLink>
      ) : (
        <span className={styles.stepSpacer} />
      )}

      <div className={styles.numbers}>
        {pages.map((page) =>
          page === current ? (
            <span
              key={page}
              aria-current="page"
              className={styles.current}
            >
              {page}
            </span>
          ) : (
            <MaybeLink
              key={page}
              href={hrefFor(page)}
              aria-label={`Seite ${page}`}
              className={styles.number}
            >
              {page}
            </MaybeLink>
          ),
        )}
      </div>

      {current < total ? (
        <MaybeLink href={hrefFor(current + 1)} data-ul2 className={styles.step}>
          Weiter →
        </MaybeLink>
      ) : (
        <span className={styles.stepSpacer} />
      )}
    </nav>
  );
}
