import MaybeLink from "../MaybeLink";
import styles from "./FeaturedArticle.module.css";

type Props = {
  title: string;
  excerpt: string;
  meta: string;
  src: string;
  alt: string;
  href?: string | null;
};

export default function FeaturedArticle({
  title,
  excerpt,
  meta,
  src,
  alt,
  href,
}: Props) {
  return (
    <MaybeLink
      href={href}
      data-zoomparent
      data-reveal
      className={styles.featured}
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
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.excerpt}>{excerpt}</p>
    </MaybeLink>
  );
}
