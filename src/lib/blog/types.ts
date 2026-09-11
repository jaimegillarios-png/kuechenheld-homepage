/**
 * The shape a blog post page reads from. Deliberately independent of where the
 * content came from: the local MDX source in `mdx-source.ts` is one adapter,
 * and a CMS would be another. The template only ever sees these types.
 */

/**
 * The source's rendered rich text. The template renders it and never inspects
 * it; a CMS adapter would put its own renderer here. Described structurally so
 * this file names no framework.
 */
export type RichText = {
  Content: (props: Record<string, unknown>) => unknown;
};

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
  /** Null where the source has no override; the page falls back to the title. */
  title: string | null;
  description: string | null;
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
  /** One imported post has no summary. Null rather than an invented one. */
  summary: string | null;
  /** Raw rich text, in whatever the source speaks. MDX here. */
  body: string;
  author: string | null;
  categories: string[];
  mainImage: Image;
  thumbnailImage: Image;
  date: string | null;
  dateUpdated?: string;
  /** Minutes. Computed from the body when the source omits it. */
  readingTime?: number;
  breadcrumbs?: Breadcrumb[];
  seo: Seo;
  /** Editorial placement — where a post shows, not what it says. */
  featured: boolean;
  showInHomeSlider: boolean;
  showInUeberUns: boolean;
  showOnKuechenplanung: boolean;
  /** Orders a listing. Null only if the CMS never set one. */
  priority: number | null;
};

/** What the page reads: the same post with its references joined. */
export type Post = Omit<
  PostSource,
  "body" | "author" | "categories" | "readingTime" | "breadcrumbs"
> & {
  body: RichText;
  author: Author | null;
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
  /** Every category that has at least one post, in the order the source lists
   *  them. The index needs these as routes, not as a facet of the posts. */
  getCategories(): Promise<Category[]>;
  /** Posts in one category, newest first. */
  getPostsByCategory(slug: string): Promise<PostSummary[]>;
};
