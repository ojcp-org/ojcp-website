import type { TrustTier } from "./schemas";

/** `domain` pattern from the registry's schema/registry-entry.schema.json. */
export const REGISTRY_DOMAIN_PATTERN = /^[a-z0-9.-]+\.[a-z]{2,}$/;

/** A new `providers/<domain>.json` entry, valid against the registry's entry schema. */
export interface NewRegistryEntry {
  domain: string;
  name: string;
  manifest_url: string;
  trust_tier: TrustTier;
  manifest_signed: boolean;
  has_agent_apply: boolean;
  attestations: never[];
  added_at: string;
  tier_history: { tier: TrustTier; date: string; note: string }[];
}

/**
 * Builds the entry a provider submits for a first listing. New listings always start at
 * `unverified`; promotion happens later by reviewed PR.
 *
 * @param today date of submission, `YYYY-MM-DD`
 */
export function buildRegistryEntry(
  domain: string,
  manifest: { provider: { name: string }; tools: unknown[]; signature?: unknown },
  today: string
): NewRegistryEntry {
  return {
    domain,
    name: manifest.provider.name,
    manifest_url: `https://${domain}/.well-known/ojcp.json`,
    trust_tier: "unverified",
    manifest_signed: typeof manifest.signature === "object" && manifest.signature !== null,
    has_agent_apply: manifest.tools.includes("begin_application"),
    attestations: [],
    added_at: today,
    tier_history: [{ tier: "unverified", date: today, note: "Initial listing." }],
  };
}
