/**
 * Centralized repo URL helpers.
 *
 * Set NEXT_PUBLIC_SPEC_REPO_URL and NEXT_PUBLIC_SITE_REPO_URL in .env.local
 * to control all outbound repo links. Handles GitHub vs GitLab URL patterns.
 */

const SPEC_REPO =
  process.env.NEXT_PUBLIC_SPEC_REPO_URL ??
  "https://gitlab.com/recruitics/ojcp/ojcp";

const SITE_REPO =
  process.env.NEXT_PUBLIC_SITE_REPO_URL ??
  "https://gitlab.com/recruitics/ojcp/ojcp-website";

function isGitLabHost(url: string) {
  return url.includes("gitlab.com");
}

/** Infix required by GitLab for file/tree/issue URLs */
function infix(url: string) {
  return isGitLabHost(url) ? "/-" : "";
}

// ── Spec repo ──

export const specRepo = SPEC_REPO;

export function specBlob(path: string, branch = "main") {
  return `${SPEC_REPO}${infix(SPEC_REPO)}/blob/${branch}/${path}`;
}

export function specTree(path: string, branch = "main") {
  return `${SPEC_REPO}${infix(SPEC_REPO)}/tree/${branch}/${path}`;
}

export const specIssues = `${SPEC_REPO}${infix(SPEC_REPO)}/issues`;

export const specDiscussions = isGitLabHost(SPEC_REPO)
  ? `${SPEC_REPO}${infix(SPEC_REPO)}/issues`
  : `${SPEC_REPO}/discussions`;

/** Whether the spec repo is hosted on GitLab (affects icon/label in UI) */
export const isGitLab = isGitLabHost(SPEC_REPO);

/** Display label for the repo host — "GitLab" or "GitHub" */
export const repoHostLabel = isGitLab ? "GitLab" : "GitHub";

// ── Site repo ──

export const siteRepo = SITE_REPO;

export function siteNewIssue(params: { title: string; body: string }) {
  const t = encodeURIComponent(params.title);
  const b = encodeURIComponent(params.body);
  if (isGitLabHost(SITE_REPO)) {
    return `${SITE_REPO}/-/issues/new?issue[title]=${t}&issue[description]=${b}`;
  }
  return `${SITE_REPO}/issues/new?title=${t}&body=${b}`;
}
