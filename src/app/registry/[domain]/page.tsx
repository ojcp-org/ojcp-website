import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components";
import { ProviderListing } from "@/components/ProviderListing";
import { getRegistryProvider, type RegistryProvider } from "@/lib/registry-data";
import { providerPagePath } from "@/lib/registry-display";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

type Params = Promise<{ domain: string }>;

// Rendered per request from the registry index, which registry-data caches for ten minutes, so a
// new listing or a fresh check shows up without a deploy and a registry outage can't fail a build.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { domain } = await params;
  const provider = await getRegistryProvider(domain).catch(() => undefined);
  if (!provider) return { title: "Provider not listed — OJCP Registry", robots: { index: false } };

  return pageMetadata({
    path: providerPagePath(provider.domain),
    title: `${/\bojcp\b/i.test(provider.name) ? provider.name : `${provider.name} OJCP provider`} (${provider.domain})`,
    description: describe(provider),
  });
}

/** One sentence of facts for search snippets: what agents can do there, and how it tested. */
function describe(p: RegistryProvider): string {
  const can = p.has_agent_apply ? "search and apply to jobs" : "search jobs";
  const c = p.conformance;
  const tested = c ? ` Passes ${c.passed}/${c.passed + c.failed + c.skipped} conformance checks.` : "";
  return `AI agents can ${can} at ${p.domain} over the Open Job Context Protocol.${tested} Manifest, tools and listing history.`;
}

/** Breadcrumbs only: structured data here describes the page, never the provider's identity. */
function breadcrumbs(p: RegistryProvider): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Registry", item: `${SITE_URL}/registry` },
      { "@type": "ListItem", position: 2, name: p.name, item: `${SITE_URL}${providerPagePath(p.domain)}` },
    ],
  };
  // JSON-LD is data, not markup: escape "<" so no string in it can close the script element.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function ProviderPage({ params }: { params: Params }) {
  const { domain } = await params;
  // A registry outage should render the error page, not claim the provider isn't listed.
  const provider = await getRegistryProvider(domain);
  if (!provider) notFound();

  return (
    <>
      <Header />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbs(provider) }} />
        <ProviderListing provider={provider} />
      </main>
      <Footer />
    </>
  );
}
