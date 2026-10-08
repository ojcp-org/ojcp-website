/**
 * Canonical origin of the deployed site.
 *
 * robots.txt and sitemap.xml must emit absolute URLs, and a wrong origin there is worse than no
 * file at all — it points crawlers at a host that does not serve this content. The literal was
 * already repeated across route handlers (`.well-known/ojcp.json`, `context/v1`), so this is the
 * one place to change it if the domain ever moves.
 */
export const SITE_URL = "https://ojcp.dev";

/**
 * OJCP version implemented by this site's reference provider: emitted as `ojcp_version` by the
 * manifest, tool responses and code examples. The schema `$id` namespace stays `/schemas/v0.1/`
 * across minor versions, so it is deliberately not derived from this.
 */
export const OJCP_VERSION = "0.3";
