import { describe, it, expect } from "vitest";
import { findOjcpProviders } from "../registry-tools";
import { OJCP_VERSION } from "../site";

describe("findOjcpProviders", () => {
  it("returns all providers with no filters", () => {
    const res = findOjcpProviders({});
    expect(res.total_results).toBeGreaterThan(0);
    expect(res.ojcp_version).toBe(OJCP_VERSION);
  });

  it("filters by industry", () => {
    const res = findOjcpProviders({ industry: "technology" });
    for (const p of res.providers) {
      expect(
        p.industries.some((i) => i.toLowerCase().includes("technology"))
      ).toBe(true);
    }
  });

  it("filters by employer name", () => {
    const res = findOjcpProviders({ employer_name: "acme" });
    for (const p of res.providers) {
      expect(p.name.toLowerCase()).toContain("acme");
    }
  });

  it("filters by location", () => {
    const res = findOjcpProviders({ location: "US" });
    for (const p of res.providers) {
      const loc = p.location;
      expect(
        loc.country?.toLowerCase().includes("us") ||
          loc.state?.toLowerCase().includes("us") ||
          loc.city?.toLowerCase().includes("us")
      ).toBe(true);
    }
  });

  it("filters by has_agent_apply", () => {
    const res = findOjcpProviders({ has_agent_apply: true });
    for (const p of res.providers) {
      expect(p.has_agent_apply).toBe(true);
    }
  });

  it("returns empty for non-matching filter", () => {
    const res = findOjcpProviders({ industry: "zzzzz_no_match" });
    expect(res.total_results).toBe(0);
    expect(res.providers.length).toBe(0);
  });
});
