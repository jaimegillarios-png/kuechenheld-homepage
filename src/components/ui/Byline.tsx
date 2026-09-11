import styles from "./Byline.module.css";

export type BylineAuthor = { name: string; avatar?: string };

type Props = {
  /** Absent on a post with no author recorded. */
  author?: BylineAuthor | null;
  /** Already formatted for display by the caller. */
  date?: string | null;
  /** The ISO value behind it, for `<time>`. */
  dateTime?: string | null;
  /** `inverse` on a dark ground, the same switch `Lede` takes. */
  tone?: "light" | "inverse";
  className?: string;
};

/**
 * Portrait, name, date — the attribution under a post anywhere it is listed.
 *
 * Shared by the grid card and the lead story so the two cannot drift: they sit
 * on the same page, and a lead story attributed differently from the cards
 * under it reads as an oversight. The article page's own byline is a separate,
 * larger thing and stays where it is.
 *
 * A post with no author keeps its date rather than showing a placeholder
 * portrait for someone who is not recorded.
 */
export default function Byline({
  author,
  date,
  dateTime,
  tone = "light",
  className,
}: Props) {
  if (!author?.name && !date) return null;

  return (
    <div
      className={[
        tone === "inverse" ? styles.bylineInverse : styles.byline,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {author?.avatar && (
        <img
          src={author.avatar}
          alt=""
          width={64}
          height={64}
          loading="lazy"
          className={styles.avatar}
        />
      )}
      {author?.name && <span className={styles.author}>{author.name}</span>}
      {author?.name && date && <span className={styles.dot}>·</span>}
      {date && (
        <time dateTime={dateTime ?? undefined} className={styles.date}>
          {date}
        </time>
      )}
    </div>
  );
}
