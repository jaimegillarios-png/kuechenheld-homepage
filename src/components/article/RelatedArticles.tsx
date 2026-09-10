import ArticleRow from "../ui/ArticleRow";
import Section, { type SectionTone } from "../ui/Section";
import SectionHeader from "../ui/SectionHeader";
import type { PostSummary } from "@/lib/blog";
import styles from "./RelatedArticles.module.css";

const dateFormat = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default function RelatedArticles({
  posts,
  heading = "Weiterlesen",
  eyebrow = "Mehr aus dem Blog",
  tone = "paper",
}: {
  posts: PostSummary[];
  heading?: string;
  eyebrow?: string;
  tone?: SectionTone;
}) {
  if (posts.length === 0) return null;

  return (
    <Section tone={tone}>
      <SectionHeader eyebrow={eyebrow} heading={heading} measure="wide" />
      <div className={styles.rows}>
        {posts.map((post, i) => (
          <ArticleRow
            key={post.slug}
            href={`/blog/${post.slug}`}
            title={post.title}
            excerpt={post.summary}
            meta={[
              post.author?.name,
              post.date && dateFormat.format(new Date(post.date)),
              `${post.readingTime} Min.`,
            ]
              .filter(Boolean)
              .join(" · ")}
            src={post.thumbnailImage.src}
            alt={post.thumbnailImage.alt}
            first={i === 0}
          />
        ))}
      </div>
    </Section>
  );
}
