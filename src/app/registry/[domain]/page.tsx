import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header, Footer } from "@/components";
import { ProviderListing } from "@/components/ProviderListing";
import { getRegistryProvider } from "@/lib/registry-data";
import { providerPagePath } from "@/lib/registry-display";
import { pageMetadata } from "@/lib/seo";

type Params = Promise<{ domain: string }>;

// Rendered per request from the registry index, which registry-data caches for ten minutes, so a
// new listing or a fresh check shows up without a deploy and a registry outage can't fail a build.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { domain } = await params;
  const provider = await getRegistryProvider(domain).catch(() => undefined);
  if (!provider) return { title: "Provider not listed — OJCP Registry", robots: { index: false } };

  const verbs = provider.has_agent_apply ? "search and apply to its jobs" : "search its jobs";
  return pageMetadata({
    path: providerPagePath(provider.domain),
    title: `${provider.name} (${provider.domain}) — OJCP Registry`,
    description:
      `${provider.name} serves the Open Job Context Protocol at ${provider.domain}, so AI agents can ${verbs}. ` +
      "Registry evidence: the provider's manifest and its conformance results, checked daily. A listing is not an endorsement.",
  });
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
        <ProviderListing provider={provider} />
      </main>
      <Footer />
    </>
  );
}
