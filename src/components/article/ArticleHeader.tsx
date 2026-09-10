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
            // The post's own step. Its title is the h1 immediately below, so
            // the trail marks the position without repeating the heading.
            <span
              className={styles.crumbCurrent}
              aria-current="page"
              title={title}
            >
              …
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
