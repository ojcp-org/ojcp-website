"use client";

import { useEffect, useState } from "react";
import { specRepoSlug } from "./repo-urls";

/**
 * Baked-in fallback so the button renders a real number instantly (and even if
 * the GitHub API is rate-limited or unreachable). Bump this occasionally so the
 * pre-fetch value stays roughly current.
 */
export const STARS_FALLBACK = 52;

/**
 * Live star count for the spec repo. Starts at the fallback for a stable SSR /
 * first paint, then updates from the GitHub API once the fetch resolves.
 */
export function useGitHubStars(slug: string = specRepoSlug): number {
  const [stars, setStars] = useState(STARS_FALLBACK);

  useEffect(() => {
    let active = true;
    fetch(`https://api.github.com/repos/${slug}`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && typeof data?.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      })
      .catch(() => {
        /* keep the fallback on any error */
      });
    return () => {
      active = false;
    };
  }, [slug]);

  return stars;
}
