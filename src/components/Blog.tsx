import { blogPosts, featuredPost, routes } from "@/lib/content";
import type { BlogPost } from "@/lib/content";
import ArticleRow from "./ui/ArticleRow";
import FeaturedArticle from "./ui/FeaturedArticle";
import Section from "./ui/Section";
import { Eyebrow, Heading, Lede } from "./ui/SectionHeader";
import TextLink from "./ui/TextLink";
import styles from "./Blog.module.css";

type Props = {
  /**
   * The slider set, from the CMS. `show-in-home-page-slider` is what decides
   * membership on the live site; the static copy in `content.ts` was a
   * hand-kept mirror of it and stays as the fallback.
   */
  posts?: readonly BlogPost[];
  featured?: BlogPost;
};

export default function Blog({
  posts = blogPosts,
  featured = featuredPost,
}: Props = {}) {
  return (
    <>
      <Section id="blog" rhythm="lead" contained={false}>
        <div className={styles.headInner}>
          <div>
            <Eyebrow>Blog</Eyebrow>
            <Heading measure="wide" gap="none">
              Tipps &amp; Inspiration rund um den Küchenkauf
            </Heading>
          </div>
          <Lede measure="default">
            Entdecken Sie nützliche Tipps, innovative Gestaltungsideen und
            wertvolle Empfehlungen, um Ihren Küchenkauf zu einem erfolgreichen
            und inspirierenden Erlebnis zu machen.
          </Lede>
        </div>
      </Section>

      <Section rhythm="trail" contained={false}>
        <div className={styles.bodyInner}>
          <FeaturedArticle
            href={featured.href ?? routes.blog}
            title={featured.title}
            excerpt={featured.excerpt}
            meta={featured.meta}
            src={featured.src}
            alt={featured.alt}
          />

          <div>
            {posts.map((post, i) => (
              <ArticleRow
                key={post.title}
                href={post.href ?? routes.blog}
                title={post.title}
                excerpt={post.excerpt}
                meta={post.meta}
                src={post.src}
                alt={post.alt}
                first={i === 0}
              />
            ))}

            <div data-reveal className={styles.allPosts}>
              <TextLink href={routes.blog} offset="loose">
                Alle Beiträge ansehen
              </TextLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
