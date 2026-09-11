import type { ReactNode } from "react";
import MaybeLink from "../MaybeLink";
import styles from "./TextLink.module.css";

type Props = {
  children: ReactNode;
  href?: string | null;
  /** Distance from the text to its rule. */
  offset?: "default" | "loose";
  className?: string;
  "data-reveal"?: string;
  "data-reveal-delay"?: number;
};

export default function TextLink({
  children,
  href,
  offset = "default",
  className,
  ...rest
}: Props) {
  const classes = [styles.link, offset === "loose" && styles.loose, className]
    .filter(Boolean)
    .join(" ");

  return (
    <MaybeLink href={href} data-ul2 className={classes} {...rest}>
      {children}
    </MaybeLink>
  );
}
