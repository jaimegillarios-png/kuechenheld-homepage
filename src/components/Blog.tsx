import { blogPosts, featuredPost, routes } from "@/lib/content";
import ArticleRow from "./ui/ArticleRow";
import FeaturedArticle from "./ui/FeaturedArticle";
import Section from "./ui/Section";
import { Eyebrow, Heading, Lede } from "./ui/SectionHeader";
import TextLink from "./ui/TextLink";
import styles from "./Blog.module.css";

export default function Blog() {
  return (
    <>
      <Section id="blog" rhythm="lead" contained={false}>
        <div className={styles.headInner}>
          <div>
            <Eyebrow gap={4}>Blog</Eyebrow>
            <Heading measure="wide">
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
            href={featuredPost.href ?? routes.blog}
            title={featuredPost.title}
            excerpt={featuredPost.excerpt}
            meta={featuredPost.meta}
            src={featuredPost.src}
            alt={featuredPost.alt}
          />

          <div>
            {blogPosts.map((post, i) => (
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
              <TextLink href={routes.blog} offset={2}>
                Alle Beiträge ansehen
              </TextLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
