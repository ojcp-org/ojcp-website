import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const SITE_NAME = "OJCP";
export const SITE_TITLE = "OJCP — Open Job Context Protocol";
export const SITE_DESCRIPTION =
  "A front door for the agents candidates send: OJCP is the open standard for how AI agents search, read and apply to jobs, under rules the employer controls.";

/**
 * Per-page metadata for search and link previews. Each page needs its own canonical URL and
 * og:url; a page's `openGraph` replaces the layout's wholesale, so the shared fields are set here
 * rather than relying on inheritance. The card image itself comes from the App Router file
 * convention (src/app/opengraph-image.png, twitter-image.png) and applies to every route.
 */
export function pageMetadata(page: { path: string; title: string; description: string }): Metadata {
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      type: "website",
      url: page.path,
      siteName: SITE_NAME,
      title: page.title,
      description: page.description,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
  };
}

/** Schema.org description of the project and site, embedded as JSON-LD in the root layout. */
export const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Open Job Context Protocol",
      alternateName: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/apple-icon.png`,
      sameAs: ["https://github.com/ojcp-org"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_TITLE,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};
