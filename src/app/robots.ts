import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * Served at /robots.txt.
 *
 * Without this file Next's catch-all answers /robots.txt with the app's HTML shell under a 404,
 * so a crawler asking "what may I fetch?" gets a page instead of a policy. Google tolerates that
 * by assuming allow-all, but it also means nothing points at the sitemap, and a favicon refresh
 * only happens when the homepage is re-crawled.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
