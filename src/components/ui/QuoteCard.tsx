import styles from "./QuoteCard.module.css";

type Props = {
  quote: string;
  author: string;
  date: string;
  /** The design only ever shows five filled stars. */
  rating?: string;
};

export default function QuoteCard({
  quote,
  author,
  date,
  rating = "★★★★★",
}: Props) {
  return (
    <figure className={styles.card}>
      <div className={styles.top}>
        <span className={styles.stars}>{rating}</span>
        <span className={styles.date}>{date}</span>
      </div>
      <blockquote className={styles.quote}>{quote}</blockquote>
      <figcaption className={styles.author}>{author}</figcaption>
    </figure>
  );
}
