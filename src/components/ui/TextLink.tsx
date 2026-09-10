import type { CSSProperties, ReactNode } from "react";
import type { SpaceStep } from "./spacing";
import AnchorLink from "../AnchorLink";
import MaybeLink from "../MaybeLink";
import styles from "./TextLink.module.css";

type Props = {
  children: ReactNode;
  href?: string | null;
  /** Distance from the text to its rule, as a spacing-scale step. */
  offset?: SpaceStep;
  className?: string;
  "data-reveal"?: string;
  "data-reveal-delay"?: number;
};

export default function TextLink({
  children,
  href,
  offset,
  className,
  ...rest
}: Props) {
  const classes = [styles.link, className].filter(Boolean).join(" ");
  const style = (
    offset ? { "--tl-offset": `var(--space-${offset})` } : undefined
  ) as CSSProperties | undefined;

  if (href?.startsWith("#")) {
    return (
      <AnchorLink
        href={href}
        data-ul2
        className={classes}
        style={style}
        {...rest}
      >
        {children}
      </AnchorLink>
    );
  }
  return (
    <MaybeLink href={href} data-ul2 className={classes} style={style} {...rest}>
      {children}
    </MaybeLink>
  );
}
