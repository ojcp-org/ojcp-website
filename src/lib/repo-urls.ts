/**
 * Centralized repo URL helpers.
 *
 * Set NEXT_PUBLIC_SPEC_REPO_URL and NEXT_PUBLIC_SITE_REPO_URL in .env.local
 * to override defaults.
 */

const SPEC_REPO =
  process.env.NEXT_PUBLIC_SPEC_REPO_URL ??
  "https://github.com/ojcp-org/ojcp";

const SITE_REPO =
  process.env.NEXT_PUBLIC_SITE_REPO_URL ??
  "https://github.com/ojcp-org/ojcp-website";

// ── Spec repo ──

export const specRepo = SPEC_REPO;

/** Rendered spec hosted via GitHub Pages */
export const specRendered =
  process.env.NEXT_PUBLIC_SPEC_PAGES_URL ?? "https://spec.ojcp.dev/";

export function specBlob(path: string, branch = "main") {
  return `${SPEC_REPO}/blob/${branch}/${path}`;
}

export function specTree(path: string, branch = "main") {
  return `${SPEC_REPO}/tree/${branch}/${path}`;
}

export const specIssues = `${SPEC_REPO}/issues`;

export const specDiscussions = `${SPEC_REPO}/discussions`;

/** Display label for the repo host */
export const repoHostLabel = "GitHub";

// ── Site repo ──

export const siteRepo = SITE_REPO;

export function siteNewIssue(params: { title: string; body: string }) {
  const t = encodeURIComponent(params.title);
  const b = encodeURIComponent(params.body);
  return `${SITE_REPO}/issues/new?title=${t}&body=${b}`;
}
