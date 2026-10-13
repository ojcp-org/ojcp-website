import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { readFileSync } from "fs";
import path from "path";
import fixture from "./fixtures/registry-index.json";
import { OJCP_VERSION } from "../site";
import { REGISTRY_INDEX_TTL_MS } from "../registry-data";

// The spec's response schema, as the site publishes it under public/schemas.
// (The spec submodule isn't checked out in CI.)
const findProvidersSchema = JSON.parse(
  readFileSync(
    path.join(
      __dirname,
      "../../../public/schemas/v0.1/responses/find-providers.json"
    ),
    "utf-8"
  )
);
const itemSchema = findProvidersSchema.properties.providers.items;

const INDEX_URL = "http://registry.test/registry.json";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const fetchMock = vi.fn<typeof fetch>();

// The index cache is module-level state, so each test loads fresh module instances; a static
// import would share one cache across tests. RegistryUnavailableError comes from the same fresh
// graph so `instanceof` matches what the fresh registry-tools throws.
async function loadTools() {
  vi.resetModules();
  const [tools, data] = await Promise.all([
    import("../registry-tools"),
    import("../registry-data"),
  ]);
  return {
    findOjcpProviders: tools.findOjcpProviders,
    RegistryUnavailableError: data.RegistryUnavailableError,
  };
}

beforeEach(() => {
  vi.stubEnv("REGISTRY_INDEX_URL", INDEX_URL);
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "warn").mockImplementation(() => {});
  fetchMock.mockReset();
  fetchMock.mockImplementation(async () => jsonResponse(fixture));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("findOjcpProviders", () => {
  it("returns every indexed provider with no filters, fetched from REGISTRY_INDEX_URL", async () => {
    const { findOjcpProviders } = await loadTools();
    const res = await findOjcpProviders({});
    expect(fetchMock).toHaveBeenCalledWith(INDEX_URL, expect.anything());
    expect(res.ojcp_version).toBe(OJCP_VERSION);
    expect(res.total_results).toBe(4);
    expect(res.providers.map((p) => p.domain)).toEqual([
      "www.foundrole.com",
      "freehire.me",
      "cloud.jobops.app",
      "ojcp.dev",
    ]);
  });

  it("emits items conformant with the spec's find-providers response", async () => {
    const { findOjcpProviders } = await loadTools();
    const res = await findOjcpProviders({});
    for (const p of res.providers) {
      for (const field of itemSchema.required) expect(p).toHaveProperty(field);
      expect(p["@context"]).toBe(itemSchema.properties["@context"].const);
      expect(p["@type"]).toBe(itemSchema.properties["@type"].const);
      expect(itemSchema.properties.trust_tier.enum).toContain(p.trust_tier);
      expect(Array.isArray(p.tools)).toBe(true);
    }
  });

  it("filters by industry", async () => {
    const { findOjcpProviders } = await loadTools();
    const res = await findOjcpProviders({ industry: "refer" });
    expect(res.providers.map((p) => p.domain)).toEqual(["ojcp.dev"]);
    expect((await findOjcpProviders({ industry: "zzz_no_match" })).total_results).toBe(0);
  });

  it("filters by employer name or domain, case-insensitively", async () => {
    const { findOjcpProviders } = await loadTools();
    expect((await findOjcpProviders({ employer_name: "JOBOPS" })).providers.map((p) => p.domain)).toEqual([
      "cloud.jobops.app",
    ]);
    expect((await findOjcpProviders({ employer_name: "freehire.me" })).providers.map((p) => p.name)).toEqual([
      "freehire",
    ]);
  });

  it("accepts location but does not filter on it (entries carry no location)", async () => {
    const { findOjcpProviders } = await loadTools();
    const res = await findOjcpProviders({ location: "Nowhere, Antarctica" });
    expect(res.total_results).toBe(4);
  });

  it("orders trust tiers unverified < verified < audited for min_trust_tier", async () => {
    const tiered = {
      ...fixture,
      providers: [
        { ...fixture.providers[0], trust_tier: "unverified" },
        { ...fixture.providers[1], trust_tier: "verified" },
        { ...fixture.providers[2], trust_tier: "audited" },
      ],
    };
    fetchMock.mockImplementation(async () => jsonResponse(tiered));
    const { findOjcpProviders } = await loadTools();

    const tiers = async (min: "unverified" | "verified" | "audited") =>
      (await findOjcpProviders({ min_trust_tier: min })).providers.map((p) => p.trust_tier);
    expect(await tiers("unverified")).toEqual(["unverified", "verified", "audited"]);
    expect(await tiers("verified")).toEqual(["verified", "audited"]);
    expect(await tiers("audited")).toEqual(["audited"]);
  });

  it("returns nothing at min_trust_tier=verified when every listing is unverified", async () => {
    const { findOjcpProviders } = await loadTools();
    expect((await findOjcpProviders({ min_trust_tier: "verified" })).total_results).toBe(0);
  });

  it("sets the deprecated verified alias to trust_tier !== 'unverified'", async () => {
    fetchMock.mockImplementation(async () =>
      jsonResponse({
        ...fixture,
        providers: [
          fixture.providers[0],
          { ...fixture.providers[1], trust_tier: "verified" },
          { ...fixture.providers[2], trust_tier: "audited" },
        ],
      })
    );
    const { findOjcpProviders } = await loadTools();
    const res = await findOjcpProviders({});
    expect(res.providers.map((p) => [p.trust_tier, p.verified])).toEqual([
      ["unverified", false],
      ["verified", true],
      ["audited", true],
    ]);
  });

  it("takes manifest facts from health.manifest", async () => {
    const { findOjcpProviders } = await loadTools();
    const res = await findOjcpProviders({ employer_name: "freehire" });
    expect(res.providers[0]).toMatchObject({
      name: "freehire",
      description: "Open-source job aggregator.",
      mcp_endpoint: "https://freehire.me/api/v1/ojcp/mcp",
      tools: ["search_jobs", "get_job_detail", "get_employer_context"],
      apply_paths: ["ats_direct", "external_redirect"],
      ojcp_version: "0.1",
      auth_required: false,
      manifest_signed: false,
    });
  });

  it("reports conformance evidence with failed checks", async () => {
    const { findOjcpProviders } = await loadTools();
    const [jobops] = (await findOjcpProviders({ employer_name: "jobops" })).providers;
    expect(jobops.conformance).toEqual({
      suite_version: "0.3.0",
      passed: 8,
      failed: 1,
      skipped: 0,
      checked_at: "2026-10-13T06:17:13.000Z",
      failures: [
        {
          test: "search-jobs-valid-schema",
          message: "/jobLocation: must be object; /jobLocation: must be array",
        },
      ],
    });
  });

  it("falls back to the entry when the manifest was unreachable", async () => {
    const { findOjcpProviders } = await loadTools();
    const [ref] = (await findOjcpProviders({ employer_name: "ojcp.dev" })).providers;
    expect(ref.name).toBe("OJCP Reference Provider");
    expect(ref.tools).toEqual([]);
    expect(ref.manifest_error).toBe("HTTP 503");
    expect(ref.checked_at).toBe("2026-10-13T06:17:15.000Z");
    expect(ref).not.toHaveProperty("conformance");
    expect(ref).not.toHaveProperty("ojcp_version");
    // Without a manifest the hand-set entry flag is all there is.
    expect(ref.has_agent_apply).toBe(true);
  });

  it("derives agent apply from begin_application in health.manifest.tools, over the entry flag", async () => {
    const withApply = structuredClone(fixture.providers[0]);
    withApply.health.manifest!.tools.push("begin_application");
    withApply.has_agent_apply = false;
    const withoutApply = structuredClone(fixture.providers[1]);
    withoutApply.has_agent_apply = true;
    fetchMock.mockImplementation(async () =>
      jsonResponse({ ...fixture, providers: [withApply, withoutApply] })
    );
    const { findOjcpProviders } = await loadTools();

    const res = await findOjcpProviders({});
    expect(res.providers.map((p) => [p.domain, p.has_agent_apply])).toEqual([
      ["www.foundrole.com", true],
      ["freehire.me", false],
    ]);
    expect(
      (await findOjcpProviders({ has_agent_apply: true })).providers.map((p) => p.domain)
    ).toEqual(["www.foundrole.com"]);
  });

  it("throws RegistryUnavailableError when the index has never loaded", async () => {
    fetchMock.mockImplementation(async () => jsonResponse({ error: "nope" }, 502));
    const { findOjcpProviders, RegistryUnavailableError } = await loadTools();
    const call = findOjcpProviders({});
    await expect(call).rejects.toBeInstanceOf(RegistryUnavailableError);
    await expect(call).rejects.toThrow(`could not load ${INDEX_URL} (HTTP 502)`);
  });

  it("throws when the response is not a registry index", async () => {
    fetchMock.mockImplementation(async () => jsonResponse({ hello: "world" }));
    const { findOjcpProviders } = await loadTools();
    await expect(findOjcpProviders({})).rejects.toThrow(/not an OJCP registry index/);
  });

  it("serves the cached index within the TTL and stale data when a refresh fails", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-13T12:00:00Z"));
    const { findOjcpProviders } = await loadTools();
    expect((await findOjcpProviders({})).total_results).toBe(4);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    vi.setSystemTime(Date.now() + REGISTRY_INDEX_TTL_MS - 1);
    await findOjcpProviders({});
    expect(fetchMock).toHaveBeenCalledTimes(1);

    fetchMock.mockImplementation(async () => {
      throw new TypeError("fetch failed");
    });
    vi.setSystemTime(Date.now() + 2);
    expect((await findOjcpProviders({})).total_results).toBe(4);
    expect(fetchMock).toHaveBeenCalledTimes(2);

    // A later successful refresh replaces the stale copy.
    fetchMock.mockImplementation(async () =>
      jsonResponse({ ...fixture, providers: fixture.providers.slice(0, 1) })
    );
    expect((await findOjcpProviders({})).total_results).toBe(1);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
