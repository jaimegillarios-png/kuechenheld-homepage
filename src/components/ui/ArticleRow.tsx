import Image from "next/image";
import MaybeLink from "../MaybeLink";
import styles from "./ArticleRow.module.css";

type Props = {
  title: string;
  excerpt: string;
  meta: string;
  src: string;
  alt: string;
  href?: string | null;
  /** The first row sits flush against the rule above it. */
  first?: boolean;
};

export default function ArticleRow({
  title,
  excerpt,
  meta,
  src,
  alt,
  href,
  first,
}: Props) {
  return (
    <MaybeLink
      href={href}
      data-zoomparent
      data-reveal
      className={first ? styles.first : styles.row}
    >
      <div data-zoom className={styles.thumbFrame}>
        <Image
          src={src}
          alt={alt}
          width={352}
          height={352}
          sizes="(max-width: 560px) 100vw, 176px"
          data-reveal="wipe"
          className={styles.thumb}
        />
      </div>
      <div>
        <div className={styles.title}>{title}</div>
        <p className={styles.excerpt}>{excerpt}</p>
        <div className={styles.meta}>{meta}</div>
      </div>
    </MaybeLink>
  );
}
