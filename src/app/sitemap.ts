import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/**
 * Served at /sitemap.xml, which 404'd before this existed.
 *
 * Listed by hand rather than globbed off the filesystem: every route here is a page a human
 * should land on from a search result. The spec itself lives at spec.ojcp.dev and the schemas
 * under /schemas are machine artefacts — neither belongs in a sitemap aimed at readers.
 *
 * `priority` is advisory and most crawlers ignore it; the homepage is marked highest because it
 * is the page whose re-crawl refreshes the site-level favicon.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/governance`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/registry`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    {
      url: `${SITE_URL}/demo/career-page`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
