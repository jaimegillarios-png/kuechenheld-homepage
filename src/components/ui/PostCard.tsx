import MaybeLink from "../MaybeLink";
import Byline, { type BylineAuthor } from "./Byline";
import styles from "./PostCard.module.css";

type Props = {
  title: string;
  excerpt: string;
  src: string;
  alt: string;
  href?: string | null;
  /** Every category the post is in. A post can carry more than one. */
  categories?: readonly string[];
  /** Absent on a post with no author recorded. */
  author?: BylineAuthor | null;
  /** ISO date, already formatted for display by the caller. */
  date?: string | null;
  dateTime?: string | null;
  /**
   * The element, not the size. `h3` under a section heading; `h2` in a grid
   * that sits directly under a page's own `h1`.
   */
  as?: "h2" | "h3";
};

/**
 * A post in a grid: image, title, summary, then a byline.
 *
 * Deliberately not a `MediaCard` variant. MediaCard's whole sizing model is
 * rail item — `flex: none`, a thirds width formula, scroll snapping, a 3/4
 * portrait frame and no link — where a grid card fills its track and is the
 * link. It also carries no author and no date. Switching all of that on a
 * prop would be two components sharing a name, which is the argument
 * MediaCard's own file already makes about ArticleRow.
 */
export default function PostCard({
  title,
  excerpt,
  src,
  alt,
  href,
  categories,
  author,
  date,
  dateTime,
  as: Title = "h3",
}: Props) {
  return (
    <MaybeLink
      href={href}
      data-zoomparent
      data-reveal
      className={styles.card}
    >
      <div data-zoom className={styles.frame}>
        <img
          src={src}
          alt={alt}
          width={800}
          height={600}
          sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw"
          data-reveal="wipe"
          className={styles.photo}
        />
      </div>

      {categories && categories.length > 0 && (
        <div className={styles.categories}>{categories.join(" · ")}</div>
      )}
      <Title className={styles.title}>{title}</Title>
      {excerpt && <p className={styles.excerpt}>{excerpt}</p>}

      <Byline
        author={author}
        date={date}
        dateTime={dateTime}
        className={styles.byline}
      />
    </MaybeLink>
  );
}
