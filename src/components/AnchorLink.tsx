"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { scrollToHash } from "@/lib/motion";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  /** Runs after the scroll is kicked off — used to close the mobile nav. */
  onNavigate?: () => void;
};

/**
 * A real `<a href="#…">` that smooth-scrolls instead of jumping, so the link
 * still works with middle-click, keyboard and JS disabled.
 */
export default function AnchorLink({
  href,
  onNavigate,
  onClick,
  ...rest
}: Props) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.button !== 0
    ) {
      return;
    }
    e.preventDefault();
    onNavigate?.();
    scrollToHash(href);
  };

  return <a href={href} onClick={handleClick} {...rest} />;
}
