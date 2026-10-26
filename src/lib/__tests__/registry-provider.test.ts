import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import fixture from "./fixtures/registry-index.json";
import { providerLinkRel } from "../registry-display";

const INDEX_URL = "http://registry.test/registry.json";

const fetchMock = vi.fn<typeof fetch>();

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), { headers: { "Content-Type": "application/json" } });
}

// The index cache is module-level state; load a fresh module per test.
async function loadData() {
  vi.resetModules();
  return import("../registry-data");
}

beforeEach(() => {
  vi.stubEnv("REGISTRY_INDEX_URL", INDEX_URL);
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "warn").mockImplementation(() => {});
  fetchMock.mockReset();
  fetchMock.mockImplementation(async () => jsonResponse(fixture));
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("getRegistryProvider", () => {
  it("finds a listed provider by domain, case-insensitively", async () => {
    const { getRegistryProvider } = await loadData();
    expect((await getRegistryProvider("WWW.FoundRole.com"))?.name).toBe("FoundRole");
  });

  it("returns undefined for a domain that isn't listed", async () => {
    const { getRegistryProvider } = await loadData();
    expect(await getRegistryProvider("careers.example.com")).toBeUndefined();
  });

  it("throws, rather than reporting 'not listed', when the index has never loaded", async () => {
    fetchMock.mockImplementation(async () => {
      throw new TypeError("fetch failed");
    });
    const { getRegistryProvider, RegistryUnavailableError } = await loadData();
    await expect(getRegistryProvider("www.foundrole.com")).rejects.toBeInstanceOf(RegistryUnavailableError);
  });

  it("carries the entry's tier history, and keeps the listing when the history is malformed", async () => {
    const [first, ...rest] = fixture.providers;
    const broken = { ...rest[0], tier_history: [{ tier: "trusted", date: 7 }] };
    fetchMock.mockImplementation(async () => jsonResponse({ ...fixture, providers: [first, broken] }));
    const { getRegistryProvider } = await loadData();

    expect((await getRegistryProvider(first.domain))?.tier_history).toEqual(first.tier_history);
    const kept = await getRegistryProvider(broken.domain);
    expect(kept).toBeDefined();
    expect(kept?.tier_history).toBeUndefined();
  });
});

describe("providerLinkRel", () => {
  it("passes no ranking signal to unverified providers", () => {
    expect(providerLinkRel("unverified").split(" ")).toEqual(expect.arrayContaining(["nofollow", "ugc"]));
  });

  it("gives verified and audited providers a followed link", () => {
    for (const tier of ["verified", "audited"] as const) {
      expect(providerLinkRel(tier)).not.toMatch(/nofollow|ugc/);
      expect(providerLinkRel(tier)).toContain("noopener");
    }
  });
});
