import { footerColumns, legalLinks, socials } from "@/lib/content";
import { SocialIcon } from "./SocialIcons";
import MaybeLink from "./MaybeLink";
import Newsletter from "./Newsletter";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div>
          <div className={styles.wordmark}>Küchenheld</div>
          <Newsletter />
        </div>

        {footerColumns.map((column) => (
          <div key={column.heading}>
            <div className={styles.columnHeading}>{column.heading}</div>
            <div className={styles.columnLinks}>
              {column.links.map((link) => (
                <MaybeLink key={link} data-ul>
                  {link}
                </MaybeLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.bottom}>
        <span>© Küchenheld GmbH 2026</span>

        <div className={styles.socials}>
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              className={styles.social}
              target="_blank"
              rel="noreferrer noopener"
            >
              <SocialIcon name={social.label} />
            </a>
          ))}
        </div>

        <div className={styles.legal}>
          {legalLinks.map((link) => (
            <MaybeLink key={link} data-ul>
              {link}
            </MaybeLink>
          ))}
        </div>
      </div>
    </footer>
  );
}
