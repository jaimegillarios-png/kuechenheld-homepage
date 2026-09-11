import MaybeLink from "../MaybeLink";
import Byline, { type BylineAuthor } from "./Byline";
import styles from "./FeaturedArticle.module.css";

type Props = {
  title: string;
  excerpt: string;
  meta: string;
  src: string;
  alt: string;
  href?: string | null;
  /**
   * `stack` puts the text under the image and is sized for a half-width
   * column — the homepage's blog band. `split` sets image and text side by
   * side. `feature` is the blog index's lead: a full-bleed band on the
   * inverse ground, text held to the container at the left and the
   * photograph running off the right edge. It needs its section uncontained.
   */
  layout?: "stack" | "split" | "feature";
  /**
   * The element, not the size. `h3` under a section heading on a page that
   * states its subject elsewhere; `h2` when this is the lead item under a
   * page's own `h1`.
   */
  as?: "h2" | "h3";
  /**
   * The attribution, when the caller has one. The homepage's blog band reads
   * from static copy and passes none, so it renders as it always did.
   */
  author?: BylineAuthor | null;
  date?: string | null;
  dateTime?: string | null;
};

export default function FeaturedArticle({
  title,
  excerpt,
  meta,
  src,
  alt,
  href,
  layout = "stack",
  as: Title = "h3",
  author,
  date,
  dateTime,
}: Props) {
  return (
    <MaybeLink
      href={href}
      data-zoomparent
      data-reveal
      className={
        layout === "feature"
          ? styles.feature
          : layout === "split"
            ? styles.split
            : styles.featured
      }
    >
      <div data-zoom className={styles.frame}>
        <img
          src={src}
          alt={alt}
          width={1200}
          height={900}
          sizes="(max-width: 900px) 100vw, 50vw"
          data-reveal="wipe"
          className={styles.photo}
        />
      </div>
      <div className={styles.meta}>{meta}</div>
      <Title className={styles.title}>{title}</Title>
      <p className={styles.excerpt}>{excerpt}</p>
      <div className={styles.foot}>
        <Byline
          author={author}
          date={date}
          dateTime={dateTime}
          tone={layout === "feature" ? "inverse" : "light"}
          className={styles.byline}
        />
        {layout === "feature" && (
          <span className={styles.cue}>Beitrag lesen &rarr;</span>
        )}
      </div>
    </MaybeLink>
  );
}
