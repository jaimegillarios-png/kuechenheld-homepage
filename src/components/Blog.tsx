import Image from "next/image";
import { blogPosts, featuredPost, routes } from "@/lib/content";
import MaybeLink from "./MaybeLink";
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
          <MaybeLink
            href={featuredPost.href ?? routes.blog}
            data-zoomparent
            data-reveal
            className={styles.featured}
          >
            <div data-zoom className={styles.featuredFrame}>
              <Image
                src={featuredPost.src}
                alt={featuredPost.alt}
                width={1200}
                height={900}
                sizes="(max-width: 900px) 100vw, 50vw"
                data-reveal="wipe"
                className={styles.featuredPhoto}
              />
            </div>
            <div className={styles.meta}>{featuredPost.meta}</div>
            <h3 className={styles.featuredTitle}>{featuredPost.title}</h3>
            <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
          </MaybeLink>

          <div>
            {blogPosts.map((post, i) => (
              <MaybeLink
                key={post.title}
                href={post.href ?? routes.blog}
                data-zoomparent
                data-reveal
                className={i === 0 ? styles.rowFirst : styles.row}
              >
                <div data-zoom className={styles.thumbFrame}>
                  <Image
                    src={post.src}
                    alt={post.alt}
                    width={352}
                    height={352}
                    sizes="(max-width: 560px) 100vw, 176px"
                    data-reveal="wipe"
                    className={styles.thumb}
                  />
                </div>
                <div>
                  <div className={styles.rowTitle}>{post.title}</div>
                  <p className={styles.rowExcerpt}>{post.excerpt}</p>
                  <div className={styles.rowMeta}>{post.meta}</div>
                </div>
              </MaybeLink>
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
