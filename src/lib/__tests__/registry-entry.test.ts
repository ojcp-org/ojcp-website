import { describe, it, expect } from "vitest";
import { buildRegistryEntry, REGISTRY_DOMAIN_PATTERN } from "../registry-entry";
import { registryNewEntryUrl } from "../repo-urls";

describe("buildRegistryEntry", () => {
  const manifest = {
    ojcp_version: "0.3",
    provider: { name: "Acme Careers" },
    tools: ["search_jobs", "get_job_detail"],
  };

  it("builds an unverified first listing", () => {
    expect(buildRegistryEntry("careers.acme.com", manifest, "2026-10-13")).toEqual({
      domain: "careers.acme.com",
      name: "Acme Careers",
      manifest_url: "https://careers.acme.com/.well-known/ojcp.json",
      trust_tier: "unverified",
      manifest_signed: false,
      has_agent_apply: false,
      attestations: [],
      added_at: "2026-10-13",
      tier_history: [{ tier: "unverified", date: "2026-10-13", note: "Initial listing." }],
    });
  });

  it("derives signed and agent-apply from the manifest", () => {
    const entry = buildRegistryEntry(
      "careers.acme.com",
      { ...manifest, tools: [...manifest.tools, "begin_application"], signature: { alg: "ES256" } },
      "2026-10-13"
    );
    expect(entry.manifest_signed).toBe(true);
    expect(entry.has_agent_apply).toBe(true);
  });

  it("only uses properties the registry entry schema allows", () => {
    // properties of ojcp-org/registry schema/registry-entry.schema.json (additionalProperties: false)
    const allowed = [
      "domain",
      "name",
      "manifest_url",
      "trust_tier",
      "manifest_signed",
      "domain_control",
      "industries",
      "has_agent_apply",
      "attestations",
      "added_at",
      "tier_history",
    ];
    const entry = buildRegistryEntry("careers.acme.com", manifest, "2026-10-13");
    for (const key of Object.keys(entry)) expect(allowed).toContain(key);
    expect(entry.domain).toMatch(REGISTRY_DOMAIN_PATTERN);
  });
});

describe("registryNewEntryUrl", () => {
  it("pre-fills providers/<domain>.json on the registry repo", () => {
    const entry = { domain: "freehire.me", name: "freehire & co" };
    const url = new URL(registryNewEntryUrl("freehire.me", entry));
    expect(`${url.origin}${url.pathname}`).toBe(
      "https://github.com/ojcp-org/registry/new/main/providers"
    );
    expect(url.searchParams.get("filename")).toBe("freehire.me.json");
    expect(url.searchParams.get("value")).toBe(`${JSON.stringify(entry, null, 2)}\n`);
  });
});
