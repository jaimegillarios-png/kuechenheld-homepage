import styles from "./MediaCard.module.css";

type Props = {
  title: string;
  body: string;
  src: string;
  alt?: string;
  sizes: string;
  width: number;
  height: number;
};

export default function MediaCard({
  title,
  body,
  src,
  alt,
  sizes,
  width,
  height,
}: Props) {
  return (
    <article className={styles.card}>
      <div data-zoom className={styles.frame}>
        <img
          src={src}
          alt={alt ?? title}
          width={width}
          height={height}
          sizes={sizes}
          className={styles.photo}
        />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.body}>{body}</p>
    </article>
  );
}

/** The spacer the rail arrows centre against — same width and ratio as a card. */
export function MediaCardSpacer() {
  return <div className={styles.spacer} />;
}
