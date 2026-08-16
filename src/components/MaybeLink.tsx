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
  return <a href={href} {...rest} />;
}
