/**
 * Canonical origin of the deployed site.
 *
 * robots.txt and sitemap.xml must emit absolute URLs, and a wrong origin there is worse than no
 * file at all — it points crawlers at a host that does not serve this content. The literal was
 * already repeated across route handlers (`.well-known/ojcp.json`, `context/v1`), so this is the
 * one place to change it if the domain ever moves.
 */
export const SITE_URL = "https://ojcp.dev";
