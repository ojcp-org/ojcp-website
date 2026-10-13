/**
 * Centralized repo URL helpers.
 *
 * Set NEXT_PUBLIC_SPEC_REPO_URL, NEXT_PUBLIC_SITE_REPO_URL and NEXT_PUBLIC_REGISTRY_REPO_URL in
 * .env.local to override defaults.
 */

const SPEC_REPO =
  process.env.NEXT_PUBLIC_SPEC_REPO_URL ??
  "https://github.com/ojcp-org/ojcp";

const SITE_REPO =
  process.env.NEXT_PUBLIC_SITE_REPO_URL ??
  "https://github.com/ojcp-org/ojcp-website";

const REGISTRY_REPO =
  process.env.NEXT_PUBLIC_REGISTRY_REPO_URL ??
  "https://github.com/ojcp-org/registry";

// ── Spec repo ──

export const specRepo = SPEC_REPO;

/** owner/repo slug for the spec repo, e.g. "ojcp-org/ojcp" (for the GitHub API) */
export const specRepoSlug = SPEC_REPO.replace(/^https?:\/\/github\.com\//, "");

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

// ── Registry repo ──

export const registryRepo = REGISTRY_REPO;

/**
 * GitHub "create new file" URL that opens a PR-ready `providers/<domain>.json` pre-filled with
 * `entry`, pretty-printed.
 */
export function registryNewEntryUrl(domain: string, entry: unknown, branch = "main") {
  const filename = encodeURIComponent(`${domain}.json`);
  const value = encodeURIComponent(`${JSON.stringify(entry, null, 2)}\n`);
  return `${REGISTRY_REPO}/new/${branch}/providers?filename=${filename}&value=${value}`;
}
