import type { ReactNode } from "react";
import prose from "@/styles/prose.module.css";

/**
 * The prose container. Everything inside is styled by element selector, so a
 * CMS's raw rich-text HTML renders exactly as the local MDX does.
 */
export default function ArticleBody({ children }: { children: ReactNode }) {
  return <div className={prose.prose}>{children}</div>;
}
