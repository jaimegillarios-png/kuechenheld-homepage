import { ChevronRight } from "lucide-react";
import AnchorLink from "../AnchorLink";
import MaybeLink from "../MaybeLink";
import styles from "./CtaButton.module.css";

/** 221 of the 223 imported buttons pointed here. */
const DEFAULT_HREF = "/questionnaire";

export default function CtaButton({
  label,
  href = DEFAULT_HREF,
}: {
  label: string;
  href?: string;
}) {
  const inner = (
    <>
      {label}
      <ChevronRight
        className={styles.arrow}
        size={16}
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </>
  );

  return (
    <div className={styles.wrap}>
      {href.startsWith("#") ? (
        <AnchorLink href={href} className={styles.button}>
          {inner}
        </AnchorLink>
      ) : (
        <MaybeLink href={href} className={styles.button}>
          {inner}
        </MaybeLink>
      )}
    </div>
  );
}
