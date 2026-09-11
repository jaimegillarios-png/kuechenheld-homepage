import type { APIRoute } from "astro";
import { blog } from "../../lib/blog";

/**
 * The search index, built once at build time.
 *
 * 100 posts is small enough that the browser can filter the whole corpus, so
 * there is no search service and no Pagefind — just this file, fetched by the
 * island on the first keystroke.
 *
 * It carries the thumbnail and byline as well as the text fields, because a
 * result renders as the same `PostCard` as the grid it replaces; without them
 * searching would drop the reader into a visibly poorer list.
 */
export const GET: APIRoute = async () => {
  const posts = await blog.getAllPosts();
  const entries = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    categories: post.categories.map((c) => c.slug),
    thumb: post.thumbnailImage.src,
    alt: post.thumbnailImage.alt,
    author: post.author?.name ?? null,
    avatar: post.author?.avatar ?? null,
    date: post.date,
  }));

  return new Response(JSON.stringify(entries), {
    headers: { "Content-Type": "application/json" },
  });
};
