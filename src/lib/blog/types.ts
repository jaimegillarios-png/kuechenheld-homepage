/**
 * The shape a blog post page reads from. Deliberately independent of where the
 * content came from: the local MDX source in `mdx-source.ts` is one adapter,
 * and a CMS would be another. The template only ever sees these types.
 */

import type { ReactNode } from "react";

export type Image = { src: string; alt: string };

/** Renders inside a byline. Not a page of its own. */
export type Author = {
  name: string;
  avatar?: string;
  role?: string;
};

/** Renders as a chip. Not a page of its own. */
export type Category = {
  name: string;
  slug: string;
};

/** `href` is null for the current page, which is not a link. */
export type Breadcrumb = { name: string; href: string | null };

export type Seo = {
  title: string;
  description: string;
  /** False keeps the post out of search results — drafts, or thin pages. */
  index: boolean;
};

/**
 * What the source stores. Author and categories are references; the adapter
 * resolves them against authors.json and categories.json.
 */
export type PostSource = {
  title: string;
  slug: string;
  summary: string;
  /** Raw rich text, in whatever the source speaks. MDX here. */
  body: string;
  author: string;
  categories: string[];
  mainImage: Image;
  thumbnailImage: Image;
  date: string;
  dateUpdated?: string;
  /** Minutes. Computed from the body when the source omits it. */
  readingTime?: number;
  breadcrumbs?: Breadcrumb[];
  seo: Seo;
  featured: boolean;
};

/** What the page reads: the same post with its references joined. */
export type Post = Omit<
  PostSource,
  "body" | "author" | "categories" | "readingTime" | "breadcrumbs"
> & {
  body: ReactNode;
  author: Author;
  categories: Category[];
  readingTime: number;
  breadcrumbs: Breadcrumb[];
};

/** A post without its body — enough for a listing row or a related card. */
export type PostSummary = Omit<Post, "body">;

/**
 * The seam a CMS would replace. Everything above the line is the template's
 * contract; everything below it is the local MDX reader.
 */
export type BlogSource = {
  getPost(slug: string): Promise<Post | null>;
  getAllPosts(): Promise<PostSummary[]>;
  getRelatedPosts(slug: string, limit?: number): Promise<PostSummary[]>;
};
