import type { MetadataRoute } from "next";

import { getRegistryIndex } from "@/lib/registry-data";
import { providerPagePath } from "@/lib/registry-display";
import { SITE_URL } from "@/lib/site";

// Built per request from the registry index (cached for ten minutes in registry-data), so a new
// listing reaches the sitemap without a deploy, and a registry outage can't fail the build.
export const dynamic = "force-dynamic";

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
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    ...(await providerPages()),
  ];
}

/**
 * One entry per listed provider. The page changes when the registry re-checks it, so its
 * `lastModified` is that check. If the index can't be loaded the sitemap still serves the
 * site's own pages rather than failing.
 */
async function providerPages(): Promise<MetadataRoute.Sitemap> {
  try {
    return (await getRegistryIndex()).map((p) => ({
      url: `${SITE_URL}${providerPagePath(p.domain)}`,
      lastModified: new Date(p.checked_at ?? p.added_at),
      changeFrequency: "daily",
      priority: 0.6,
    }));
  } catch {
    return [];
  }
}
