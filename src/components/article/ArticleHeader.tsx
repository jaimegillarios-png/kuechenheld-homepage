import { ChevronRight } from "lucide-react";
import Image from "next/image";
import MaybeLink from "../MaybeLink";
import ShareLinks from "./ShareLinks";
import type { Breadcrumb, PostSummary } from "@/lib/blog";
import { siteUrl } from "@/lib/site";
import styles from "./ArticleHeader.module.css";

const dateFormat = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const formatDate = (iso: string) => dateFormat.format(new Date(iso));

/** The trail's category step is a link into /blog-categories. */
const isCategory = (crumb: Breadcrumb) =>
  Boolean(crumb.href?.startsWith("/blog-categories/"));

function Crumbs({ items, title }: { items: Breadcrumb[]; title: string }) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Brotkrümelnavigation">
      {items.map((crumb, i) => (
        <span key={`${crumb.name}-${i}`} className={styles.crumb}>
          {i > 0 && (
            <ChevronRight
              className={styles.separator}
              size={14}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          )}
          {crumb.href ? (
            <MaybeLink
              href={crumb.href}
              className={
                isCategory(crumb) ? styles.crumbCategory : styles.crumbLink
              }
            >
              {crumb.name}
            </MaybeLink>
          ) : (
            // Truncated by CSS rather than sliced, so the whole title stays
            // in the accessibility tree and the cut adapts to the space.
            <span
              className={styles.crumbCurrent}
              aria-current="page"
              title={title}
            >
              {title}
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
      <Crumbs items={post.breadcrumbs} title={post.title} />

      <h1 className={styles.title} data-reveal="mask">
        {post.title}
      </h1>

      <div className={styles.byline}>
        {post.author && (
          <div className={styles.author}>
            {post.author.avatar && (
              <Image
                src={post.author.avatar}
                alt=""
                width={96}
                height={96}
                className={styles.avatar}
              />
            )}
            <div>
              <div className={styles.name}>{post.author.name}</div>
              <div className={styles.meta}>
                {post.date && (
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                )}
                {post.dateUpdated && (
                  <>
                    <span className={styles.dot} aria-hidden="true">
                      •
                    </span>
                    <time dateTime={post.dateUpdated}>
                      Aktualisiert: {formatDate(post.dateUpdated)}
                    </time>
                  </>
                )}
                {post.date && (
                  <span className={styles.dot} aria-hidden="true">
                    •
                  </span>
                )}
                <span>{post.readingTime} min Lesezeit</span>
              </div>
            </div>
          </div>
        )}

        <ShareLinks url={`${siteUrl}/blog/${post.slug}`} title={post.title} />
      </div>
    </header>
  );
}

/**
 * The hero image, on a band that carries the masthead's ground partway down
 * the photograph before giving way to paper. It is a sibling of the masthead
 * section rather than part of it, because the ground has to change *inside*
 * the image — a background that stops where a section stops would just draw a
 * line above it.
 */
export function ArticleHeroImage({
  image,
}: {
  image: PostSummary["mainImage"];
}) {
  return (
    <div className={styles.heroBand}>
      <div className={styles.heroInner}>
        <Image
          src={image.src}
          alt={image.alt}
          width={1600}
          height={900}
          sizes="(max-width: 900px) 100vw, 1240px"
          priority
          data-reveal="wipe"
          className={styles.photo}
        />
      </div>
    </div>
  );
}
