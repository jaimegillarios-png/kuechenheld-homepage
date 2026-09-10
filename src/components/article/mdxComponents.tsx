import type { ComponentPropsWithoutRef } from "react";
import Stat from "../ui/Stat";
import CtaButton from "./CtaButton";
import prose from "@/styles/prose.module.css";

/**
 * The only place MDX needs help from us. Everything else a post can write —
 * headings, lists, quotes, figures, tables — is styled by element selector in
 * prose.module.css, so it works the same when the body arrives as CMS HTML.
 *
 * The table wrapper is the one exception: a narrow screen needs somewhere to
 * scroll a wide table. A bare <table> still renders correctly without it.
 */
export const mdxComponents = {
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className={prose.tableWrap}>
      <table {...props} />
    </div>
  ),
  /** The in-article call to action, imported from Webflow custom code. */
  CtaButton,
  /** Available to a post that wants a figure callout mid-article. */
  Stat,
};
