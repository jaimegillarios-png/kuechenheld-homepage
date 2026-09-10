import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleBody from "@/components/article/ArticleBody";
import ArticleHeader from "@/components/article/ArticleHeader";
import RelatedArticles from "@/components/article/RelatedArticles";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MotionRuntime from "@/components/MotionRuntime";
import Section from "@/components/ui/Section";
import { allSlugs, blog } from "@/lib/blog";
import { isIndexable } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await allSlugs()).map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = await blog.getPost((await params).slug);
  if (!post) return {};
  // A post may ask not to be indexed; a non-indexable deployment overrules it
  // either way, the same as the homepage.
  const index = isIndexable && post.seo.index;
  return {
    title: post.seo.title,
    description: post.seo.description,
    robots: index ? undefined : { index: false, follow: false, nocache: true },
    openGraph: {
      type: "article",
      locale: "de_DE",
      title: post.seo.title,
      description: post.seo.description,
      publishedTime: post.date ?? undefined,
      modifiedTime: post.dateUpdated,
      images: [{ url: post.mainImage.src, alt: post.mainImage.alt }],
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await blog.getPost(slug);
  if (!post) notFound();
  const related = await blog.getRelatedPosts(slug);

  return (
    <>
      <a href="#main" className="skipLink">
        Zum Inhalt springen
      </a>

      <Header />

      <main id="main">
        <article>
          <Section rhythm="lead">
            <ArticleHeader post={post} />
          </Section>
          <Section rhythm="trail">
            <ArticleBody>{post.body}</ArticleBody>
          </Section>
        </article>

        <RelatedArticles posts={related} />
      </main>

      <Footer />
      <MotionRuntime />
    </>
  );
}
