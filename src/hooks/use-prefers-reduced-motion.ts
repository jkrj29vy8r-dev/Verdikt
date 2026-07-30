"use client";

import { useMediaQuery } from "./use-media-query";

/**
 * Whether the user has requested reduced motion. Motion components read this to
 * gracefully downgrade animations — an accessibility requirement, not a nicety.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
