import { OJCP_VERSION } from "./site";
import {
  getRegistryIndex,
  type ProviderConformance,
  type RegistryProvider,
} from "./registry-data";
import { TRUST_TIERS, type FindOjcpProvidersInput, type TrustTier } from "./schemas";

/** One item of the find_ojcp_providers response (spec responses/find-providers.json). */
export interface OjcpProviderItem {
  "@context": "https://ojcp.dev/context/v1";
  "@type": "OJCPProvider";
  domain: string;
  name: string;
  description?: string;
  manifest_url: string;
  mcp_endpoint?: string;
  tools: string[];
  apply_paths?: string[];
  has_agent_apply: boolean;
  industries?: string[];
  manifest_signed: boolean;
  trust_tier: TrustTier;
  /** Deprecated spec alias for `trust_tier !== "unverified"`. */
  verified: boolean;
  // ── Evidence extras gathered by the registry build ──
  /** Date the provider was added to the registry. */
  added_at: string;
  ojcp_version?: string;
  auth_required?: boolean;
  /** When the registry last checked this provider. */
  checked_at?: string;
  /** Why the manifest could not be read at `checked_at`, if it couldn't. */
  manifest_error?: string;
  conformance?: ProviderConformance;
}

export interface FindProvidersResult {
  ojcp_version: string;
  total_results: number;
  providers: OjcpProviderItem[];
}

/** Throws RegistryUnavailableError if the registry index has never loaded. */
export async function findOjcpProviders(
  input: FindOjcpProvidersInput
): Promise<FindProvidersResult> {
  let results: RegistryProvider[] = await getRegistryIndex();

  if (input.industry) {
    const q = input.industry.toLowerCase();
    results = results.filter((p) =>
      p.industries?.some((i) => i.toLowerCase().includes(q))
    );
  }

  if (input.employer_name) {
    const q = input.employer_name.toLowerCase();
    results = results.filter(
      (p) => p.name.toLowerCase().includes(q) || p.domain.includes(q)
    );
  }

  if (input.has_agent_apply !== undefined) {
    results = results.filter((p) => p.has_agent_apply === input.has_agent_apply);
  }

  if (input.min_trust_tier) {
    const min = TRUST_TIERS.indexOf(input.min_trust_tier);
    results = results.filter((p) => TRUST_TIERS.indexOf(p.trust_tier) >= min);
  }

  const providers = results.map(
    (p): OjcpProviderItem => ({
      "@context": "https://ojcp.dev/context/v1",
      "@type": "OJCPProvider",
      ...p,
      verified: p.trust_tier !== "unverified",
    })
  );

  return {
    ojcp_version: OJCP_VERSION,
    total_results: providers.length,
    providers,
  };
}
