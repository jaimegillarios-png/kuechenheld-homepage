import type { ReactNode } from "react";
import AnchorLink from "../AnchorLink";
import MaybeLink from "../MaybeLink";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "outline" | "cream";

type Props = {
  children: ReactNode;
  variant?: ButtonVariant;
  /** `compact` is one spacing step tighter and will not wrap. */
  size?: "default" | "compact";
  full?: boolean;
  /** `#hash` smooth-scrolls; a route links; neither renders a real button. */
  href?: string | null;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  "data-reveal"?: string;
  "data-reveal-delay"?: number;
};

const VARIANT = {
  primary: styles.primary,
  outline: styles.outline,
  cream: styles.cream,
} as const;

export default function Button({
  children,
  variant = "primary",
  size = "default",
  full,
  href,
  onClick,
  type = "button",
  className,
  ...rest
}: Props) {
  const classes = [
    styles.base,
    VARIANT[variant],
    size === "compact" && styles.compact,
    full && styles.full,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href?.startsWith("#")) {
    return (
      <AnchorLink href={href} className={classes} onClick={onClick} {...rest}>
        {children}
      </AnchorLink>
    );
  }
  if (href !== undefined) {
    return (
      <MaybeLink href={href} className={classes} {...rest}>
        {children}
      </MaybeLink>
    );
  }
  return (
    <button type={type} className={classes} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
