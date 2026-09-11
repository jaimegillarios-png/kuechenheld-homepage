import type { AnchorHTMLAttributes } from "react";

type Props = Omit<AnchorHTMLAttributes<HTMLElement>, "href"> & {
  /** Destination, or `null`/`undefined` while the route does not exist yet. */
  href?: string | null;
};

/**
 * Renders a real `<a>` once a destination exists, and an inert `<span>` until
 * then — so nothing on the page points at a route that would 404. The design's
 * hover treatments (`data-ul`, `data-ul2`, `data-zoom`) are attribute-driven,
 * so both branches look and behave identically.
 *
 * Fill in `routes` in `lib/content.ts` to turn these into links.
 */
export default function MaybeLink({ href, ...rest }: Props) {
  if (!href) return <span {...rest} />;
  // `children` arrives in `rest`, which the rule cannot see through a spread.
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a href={href} {...rest} />;
}
