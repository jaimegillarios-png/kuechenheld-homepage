"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PostCard from "../ui/PostCard";
import styles from "./BlogSearch.module.css";

export type SearchEntry = {
  slug: string;
  title: string;
  summary: string | null;
  categories: string[];
  thumb: string;
  alt: string;
  author: string | null;
  avatar: string | null;
  date: string | null;
};

type Props = {
  /** Where the build put the index. Fetched on the first keystroke, not on load. */
  indexUrl: string;
  /** Prefix for a post's href, already carrying the deployment's base path. */
  postHrefBase: string;
  /** Category slug when the page is scoped to one; search stays inside it. */
  scope?: string | null;
  scopeName?: string | null;
  /**
   * Slug to display name for every category. Passed in rather than carried on
   * every entry in the index: three names beat a hundred repetitions of them.
   */
  categoryNames?: Record<string, string>;
};

/** Folds case and the diacritics German actually uses, so "kuche" finds "Küche". */
const fold = (s: string) =>
  s
    .toLowerCase()
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const dateFormat = new Intl.DateTimeFormat("de-DE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/**
 * Client-side search over a build-time index.
 *
 * The input sits in the masthead and the results belong above the grid, which
 * is a different section — so the results render through a portal into a slot
 * the page leaves for them, and the page's own bands are hidden by a data
 * attribute while a query is live. One island, no cross-island state.
 */
export default function BlogSearch({
  indexUrl,
  postHrefBase,
  scope,
  scopeName,
  categoryNames = {},
}: Props) {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  // Resolved once, on the client's first render. The slot is in the server
  // HTML, and the portal only renders once a query is live — which is never
  // true on that first render — so there is nothing for hydration to mismatch.
  const [slot] = useState<HTMLElement | null>(() =>
    typeof document === "undefined"
      ? null
      : document.getElementById("blog-results"),
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const loading = useRef(false);

  // The index is only worth its bytes to someone who actually searches.
  useEffect(() => {
    if (!query || entries || loading.current) return;
    loading.current = true;
    fetch(indexUrl)
      .then((r) => r.json())
      .then(setEntries)
      .catch(() => setEntries([]));
  }, [query, entries, indexUrl]);

  const active = query.trim().length > 0;

  useEffect(() => {
    document.body.dataset.blogSearch = active ? "active" : "";
  }, [active]);

  const tokens = fold(query).split(/\s+/).filter(Boolean);
  const pool = scope
    ? (entries ?? []).filter((e) => e.categories.includes(scope))
    : (entries ?? []);

  const results = !active
    ? []
    : pool
        .map((entry) => {
          const title = fold(entry.title);
          const rest = fold(
            [entry.summary ?? "", ...entry.categories].join(" "),
          );
          // Every token has to appear somewhere, or it is not a match.
          if (!tokens.every((t) => title.includes(t) || rest.includes(t))) {
            return null;
          }
          const score = tokens.reduce(
            (n, t) => n + (title.includes(t) ? 2 : 1),
            0,
          );
          return { entry, score };
        })
        .filter((r): r is { entry: SearchEntry; score: number } => r !== null)
        .sort(
          (a, b) =>
            b.score - a.score ||
            (b.entry.date ?? "").localeCompare(a.entry.date ?? ""),
        )
        .map((r) => r.entry);

  const clear = () => {
    setQuery("");
    if (inputRef.current) inputRef.current.value = "";
    inputRef.current?.focus();
  };

  const label = scopeName
    ? `In „${scopeName}" suchen`
    : "Beiträge durchsuchen";

  return (
    <>
      <div className={styles.field}>
        <Search
          size={20}
          strokeWidth={1.8}
          aria-hidden="true"
          className={styles.icon}
        />
        <label htmlFor="blog-search" className={styles.srOnly}>
          {label}
        </label>
        <input
          id="blog-search"
          ref={inputRef}
          type="search"
          autoComplete="off"
          placeholder={label}
          defaultValue=""
          onInput={(e) => setQuery(e.currentTarget.value)}
          className={styles.input}
        />
        {active && (
          <button
            type="button"
            onClick={clear}
            aria-label="Suche zurücksetzen"
            className={styles.clear}
          >
            <X size={18} strokeWidth={1.8} aria-hidden="true" />
          </button>
        )}
      </div>

      {active &&
        slot &&
        createPortal(
          <div className={styles.results}>
            <p className={styles.count} role="status">
              {entries === null
                ? "Suche läuft …"
                : results.length === 0
                  ? `Keine Beiträge für „${query.trim()}"`
                  : `${results.length} ${
                      results.length === 1 ? "Beitrag" : "Beiträge"
                    } für „${query.trim()}"`}
            </p>

            {results.length > 0 && (
              <div className={styles.grid}>
                {results.map((entry) => (
                  <PostCard
                    key={entry.slug}
                    as="h2"
                    href={`${postHrefBase}${entry.slug}`}
                    title={entry.title}
                    excerpt={entry.summary ?? ""}
                    src={entry.thumb}
                    alt={entry.alt}
                    categories={entry.categories.map(
                      (slug) => categoryNames[slug] ?? slug,
                    )}
                    author={
                      entry.author
                        ? { name: entry.author, avatar: entry.avatar ?? undefined }
                        : null
                    }
                    date={
                      entry.date ? dateFormat.format(new Date(entry.date)) : null
                    }
                    dateTime={entry.date}
                  />
                ))}
              </div>
            )}
          </div>,
          slot,
        )}
    </>
  );
}
