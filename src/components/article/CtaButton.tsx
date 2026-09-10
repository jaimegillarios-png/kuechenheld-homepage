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
      <svg
        className={styles.arrow}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" />
      </svg>
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
