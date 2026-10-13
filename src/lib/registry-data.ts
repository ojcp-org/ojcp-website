/**
 * Server-side access to the published OJCP registry index.
 *
 * The index is built by the ojcp-org/registry CI and published to GitHub Pages. It carries each
 * registry entry verbatim plus live evidence (`health`) gathered by the build. This module fetches
 * it, keeps it in a module-level cache, and maps entries into the provider shape the site uses.
 *
 * Set REGISTRY_INDEX_URL to point at a different index (e.g. a locally served fixture).
 */
import { z } from "zod/v4";
import { TrustTierSchema, type TrustTier } from "./schemas";

export const DEFAULT_REGISTRY_INDEX_URL =
  "https://ojcp-org.github.io/registry/registry.json";

/** How long a fetched index is served before it is refreshed. */
export const REGISTRY_INDEX_TTL_MS = 10 * 60 * 1000;

const FETCH_TIMEOUT_MS = 10_000;

// ── Published index shape (contract v0.2). Unknown fields are dropped, per the contract. ──

const HealthManifestSchema = z.object({
  ojcp_version: z.string(),
  name: z.string(),
  description: z.string().optional(),
  mcp_endpoint: z.string().optional(),
  tools: z.array(z.string()),
  apply_paths: z.array(z.string()).default([]),
  auth_required: z.boolean().default(false),
  signed: z.boolean().default(false),
});

const ConformanceSchema = z.object({
  suite_version: z.string(),
  passed: z.number(),
  failed: z.number(),
  skipped: z.number(),
  results: z
    .array(
      z.object({
        test: z.string(),
        status: z.enum(["passed", "failed", "skipped"]),
        message: z.string().optional(),
      })
    )
    .default([]),
});

const HealthSchema = z.object({
  checked_at: z.string(),
  manifest: HealthManifestSchema.nullable(),
  manifest_error: z.string().optional(),
  conformance: ConformanceSchema.nullable(),
});

const IndexEntrySchema = z.object({
  domain: z.string(),
  name: z.string(),
  manifest_url: z.string(),
  trust_tier: TrustTierSchema,
  manifest_signed: z.boolean().optional(),
  industries: z.array(z.string()).optional(),
  has_agent_apply: z.boolean().optional(),
  added_at: z.string(),
  // Malformed evidence must not hide the listing: treat it as "not checked".
  health: HealthSchema.optional().catch(undefined),
});
type IndexEntry = z.infer<typeof IndexEntrySchema>;

const IndexSchema = z.object({ providers: z.array(z.unknown()) });

// ── Site-facing provider shape ──

export interface ProviderConformance {
  suite_version: string;
  passed: number;
  failed: number;
  skipped: number;
  /** When the registry ran the suite (the build's health check time). */
  checked_at: string;
  /** Failed checks with the suite's message, so a reader can see what failed without the index. */
  failures: { test: string; message?: string }[];
}

export interface RegistryProvider {
  domain: string;
  name: string;
  description?: string;
  manifest_url: string;
  mcp_endpoint?: string;
  /** Tools the manifest declares; empty when the manifest could not be read. */
  tools: string[];
  apply_paths?: string[];
  has_agent_apply: boolean;
  industries?: string[];
  manifest_signed: boolean;
  trust_tier: TrustTier;
  added_at: string;
  ojcp_version?: string;
  auth_required?: boolean;
  /** When the registry last gathered evidence; absent if it never has. */
  checked_at?: string;
  /** Why the manifest could not be read at `checked_at`, if it couldn't. */
  manifest_error?: string;
  conformance?: ProviderConformance;
}

export class RegistryUnavailableError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "RegistryUnavailableError";
  }
}

function toRegistryProvider(entry: IndexEntry): RegistryProvider {
  const health = entry.health;
  const manifest = health?.manifest ?? null;

  const provider: RegistryProvider = {
    domain: entry.domain,
    name: manifest?.name || entry.name,
    manifest_url: entry.manifest_url,
    tools: manifest ? [...manifest.tools] : [],
    // The live manifest is the evidence; the entry's hand-set flag only stands in without it.
    has_agent_apply: manifest
      ? manifest.tools.includes("begin_application")
      : entry.has_agent_apply === true,
    manifest_signed: manifest ? manifest.signed : entry.manifest_signed === true,
    trust_tier: entry.trust_tier,
    added_at: entry.added_at,
  };

  if (manifest?.description) provider.description = manifest.description;
  if (manifest?.mcp_endpoint) provider.mcp_endpoint = manifest.mcp_endpoint;
  if (manifest) {
    provider.apply_paths = [...manifest.apply_paths];
    provider.ojcp_version = manifest.ojcp_version;
    provider.auth_required = manifest.auth_required;
  }
  if (entry.industries?.length) provider.industries = [...entry.industries];
  if (health) {
    provider.checked_at = health.checked_at;
    if (!manifest) provider.manifest_error = health.manifest_error ?? "manifest unavailable";
    if (health.conformance) {
      const { suite_version, passed, failed, skipped, results } = health.conformance;
      provider.conformance = {
        suite_version,
        passed,
        failed,
        skipped,
        checked_at: health.checked_at,
        failures: results
          .filter((r) => r.status === "failed")
          .map((r) => (r.message ? { test: r.test, message: r.message } : { test: r.test })),
      };
    }
  }

  return provider;
}

async function fetchIndex(url: string): Promise<RegistryProvider[]> {
  const res = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const index = IndexSchema.safeParse(await res.json());
  if (!index.success) {
    throw new Error("response is not an OJCP registry index (no providers array)");
  }
  const providers: RegistryProvider[] = [];
  for (const raw of index.data.providers) {
    const entry = IndexEntrySchema.safeParse(raw);
    if (entry.success) {
      providers.push(toRegistryProvider(entry.data));
    } else {
      console.warn("[registry] skipping malformed index entry", raw);
    }
  }
  return providers;
}

let cached: { providers: RegistryProvider[]; fetchedAt: number } | null = null;
let inflight: Promise<RegistryProvider[]> | null = null;

/**
 * The registry's providers, refreshed at most every REGISTRY_INDEX_TTL_MS. If a refresh fails the
 * last good copy is served; if no copy has ever loaded, throws RegistryUnavailableError.
 */
export async function getRegistryIndex(): Promise<RegistryProvider[]> {
  if (cached && Date.now() - cached.fetchedAt < REGISTRY_INDEX_TTL_MS) {
    return cached.providers;
  }
  if (!inflight) {
    const url = process.env.REGISTRY_INDEX_URL || DEFAULT_REGISTRY_INDEX_URL;
    inflight = fetchIndex(url)
      .then((providers) => {
        cached = { providers, fetchedAt: Date.now() };
        return providers;
      })
      .catch((err: unknown) => {
        const reason = err instanceof Error ? err.message : String(err);
        if (cached) {
          console.warn(`[registry] refresh of ${url} failed (${reason}); serving stale index`);
          return cached.providers;
        }
        throw new RegistryUnavailableError(
          `Registry index unavailable: could not load ${url} (${reason})`,
          { cause: err }
        );
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}
