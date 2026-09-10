import Image from "next/image";
import MaybeLink from "../MaybeLink";
import type { Breadcrumb, PostSummary } from "@/lib/blog";
import styles from "./ArticleHeader.module.css";

const dateFormat = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const formatDate = (iso: string) => dateFormat.format(new Date(iso));

function Crumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Brotkrümelnavigation">
      {items.map((crumb, i) => (
        <span key={crumb.name} className={styles.crumb}>
          {i > 0 && (
            <span className={styles.separator} aria-hidden="true">
              /{" "}
            </span>
          )}
          {crumb.href ? (
            <MaybeLink href={crumb.href} className={styles.crumbLink}>
              {crumb.name}
            </MaybeLink>
          ) : (
            <span className={styles.crumbCurrent} aria-current="page">
              {crumb.name}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default function ArticleHeader({ post }: { post: PostSummary }) {
  return (
    <header>
      <Crumbs items={post.breadcrumbs} />

      {post.categories.length > 0 && (
        <div className={styles.categories}>
          {post.categories.map((category) => (
            <span key={category.slug} className={styles.chip}>
              {category.name}
            </span>
          ))}
        </div>
      )}

      <h1 className={styles.title} data-reveal="mask">
        {post.title}
      </h1>

      <p className={styles.summary} data-reveal="rise" data-reveal-delay={140}>
        {post.summary}
      </p>

      {/* The author's avatar and role are part of the type and deliberately not
          rendered — the design's byline is a single line of meta. */}
      <div className={styles.byline}>
        {post.author && (
          <span className={styles.author}>{post.author.name}</span>
        )}
        {post.date && <time dateTime={post.date}>{formatDate(post.date)}</time>}
        <span>{post.readingTime} Min. Lesedauer</span>
        {post.dateUpdated && (
          <time dateTime={post.dateUpdated}>
            Aktualisiert {formatDate(post.dateUpdated)}
          </time>
        )}
      </div>

      <div className={styles.mainImage}>
        <Image
          src={post.mainImage.src}
          alt={post.mainImage.alt}
          width={1600}
          height={900}
          sizes="(max-width: 900px) 100vw, 1240px"
          priority
          data-reveal="wipe"
          className={styles.photo}
        />
      </div>
    </header>
  );
}
