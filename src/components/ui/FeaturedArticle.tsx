import MaybeLink from "../MaybeLink";
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
   * side, for the blog index, where the stack at full content width would
   * give one post a whole viewport.
   */
  layout?: "stack" | "split";
  /**
   * The element, not the size. `h3` under a section heading on a page that
   * states its subject elsewhere; `h2` when this is the lead item under a
   * page's own `h1`.
   */
  as?: "h2" | "h3";
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
}: Props) {
  return (
    <MaybeLink
      href={href}
      data-zoomparent
      data-reveal
      className={layout === "split" ? styles.split : styles.featured}
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
    </MaybeLink>
  );
}
