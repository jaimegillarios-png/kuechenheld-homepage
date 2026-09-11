import MaybeLink from "../MaybeLink";
import styles from "./PostCard.module.css";

type Props = {
  title: string;
  excerpt: string;
  src: string;
  alt: string;
  href?: string | null;
  /** Absent on the one imported post with no author. */
  author?: { name: string; avatar?: string } | null;
  /** ISO date, already formatted for display by the caller. */
  date?: string | null;
  dateTime?: string | null;
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
  author,
  date,
  dateTime,
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

      <h3 className={styles.title}>{title}</h3>
      {excerpt && <p className={styles.excerpt}>{excerpt}</p>}

      {/* A post with no author keeps its date rather than showing a
          placeholder portrait for someone who is not recorded. */}
      <div className={styles.byline}>
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
    </MaybeLink>
  );
}
