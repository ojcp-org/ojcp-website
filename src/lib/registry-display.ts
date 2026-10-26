/**
 * How the registry is shown: shared by the server-rendered provider pages and the client-side
 * registry list. No fetching here, so client components can import it.
 */
import type { TrustTier } from "./schemas";

/** What each listing tier means, in the words shown next to it. */
export const TIER_EXPLANATION: Record<TrustTier, string> = {
  unverified:
    "Listed. The manifest exists and parses; the registry has not confirmed who operates the domain.",
  verified:
    "The manifest signature validates and the registry has confirmed the employer's identity.",
  audited:
    "Verified, plus the conformance suite passes and a security review has been completed.",
};

/** Path of a provider's registry page. Registry domains are already lower-case host names. */
export function providerPagePath(domain: string): string {
  return `/registry/${domain}`;
}

/**
 * `rel` for links from the registry to a provider's own site. A listing is not an endorsement, so
 * links to providers nobody has verified pass no ranking signal (`nofollow`) and are marked as
 * user-submitted (`ugc`); verified and audited listings earn a normal link.
 */
export function providerLinkRel(tier: TrustTier): string {
  return tier === "unverified" ? "nofollow ugc noopener noreferrer" : "noopener noreferrer";
}

const DATE = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });
const DATE_TIME = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

/**
 * A registry date (`2026-10-13`) or timestamp for display. Always UTC, so the server render and
 * the browser agree.
 */
export function formatRegistryDate(value: string, withTime = false): string {
  const ms = Date.parse(value);
  if (Number.isNaN(ms)) return value;
  return withTime ? `${DATE_TIME.format(ms)} UTC` : DATE.format(ms);
}
