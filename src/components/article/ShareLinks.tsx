"use client";

import { Link2 } from "lucide-react";
import { useState } from "react";
import { SocialIcon } from "../SocialIcons";
import styles from "./ShareLinks.module.css";

type Props = { url: string; title: string };

export default function ShareLinks({ url, title }: Props) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const targets = [
    {
      name: "LinkedIn",
      label: "Auf LinkedIn teilen",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${u}&title=${t}`,
    },
    {
      name: "Twitter",
      label: "Auf X teilen",
      href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    },
    {
      name: "Facebook",
      label: "Auf Facebook teilen",
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can be refused; the other three links still work.
    }
  };

  return (
    <div className={styles.share}>
      <button
        type="button"
        onClick={copy}
        aria-label="Link kopieren"
        className={`${styles.link} ${styles.copy}`}
      >
        {copied && (
          <span className={styles.copied} role="status">
            URL kopiert
          </span>
        )}
        <Link2 size={24} strokeWidth={1.8} aria-hidden="true" />
      </button>

      {targets.map((target) => (
        <a
          key={target.name}
          href={target.href}
          aria-label={target.label}
          className={styles.link}
          target="_blank"
          rel="noreferrer noopener"
        >
          <SocialIcon name={target.name} size={24} />
        </a>
      ))}
    </div>
  );
}
