import type { MetadataRoute } from "next";
import { isIndexable } from "@/lib/site";

// Read at build time, so this also emits a plain file under `output: export`.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return isIndexable
    ? { rules: [{ userAgent: "*", allow: "/" }] }
    : { rules: [{ userAgent: "*", disallow: "/" }] };
}
