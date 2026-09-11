/**
 * Prefixes root-absolute links and image sources inside a post body with the
 * deployment's base path.
 *
 * Everything the templates render goes through `asset()`, but a post body is
 * authored markdown — `[text](/blog/slug)` is written by hand and reaches the
 * page as raw HTML. On a project-site deployment those resolve to the domain
 * root and 404.
 *
 * A Sätteri hast plugin, not a unified attacher: Sätteri takes
 * `{ name, element: { filter, visit } }` and calls the visitor per matching
 * element. Protocol-relative and absolute URLs are left alone, and so is a
 * path that already carries the prefix.
 */
export function hastBasePath({ base }) {
  const prefix = (base || "/").replace(/\/$/, "");

  const fix = (value) =>
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.startsWith(`${prefix}/`) &&
    value !== prefix
      ? `${prefix}${value}`
      : value;

  return {
    name: "base-path",
    element: {
      filter: ["a", "img"],
      visit(node, ctx) {
        const key = node.tagName === "a" ? "href" : "src";
        const current = node.properties?.[key];
        const next = fix(current);
        if (next !== current) ctx.setProperty(node, key, next);
      },
    },
  };
}
