import Image from "next/image";
import MaybeLink from "./MaybeLink";
import { blogPosts, featuredPost, routes } from "@/lib/content";
import styles from "./Blog.module.css";

export default function Blog() {
  return (
    <>
      <section id="blog" className={styles.head}>
        <div className={styles.headInner}>
          <div>
            <div className={styles.eyebrow} data-reveal="letter">
              Blog
            </div>
            <h2 className={styles.heading} data-reveal="mask">
              Tipps &amp; Inspiration rund um den Küchenkauf
            </h2>
          </div>
          <p className={styles.lead} data-reveal="rise" data-reveal-delay="140">
            Entdecken Sie nützliche Tipps, innovative Gestaltungsideen und
            wertvolle Empfehlungen, um Ihren Küchenkauf zu einem erfolgreichen
            und inspirierenden Erlebnis zu machen.
          </p>
        </div>
      </section>

      <section className={styles.body}>
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
              <MaybeLink
                href={routes.blog}
                data-ul2
                className={styles.allPostsLink}
              >
                Alle Beiträge ansehen
              </MaybeLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
