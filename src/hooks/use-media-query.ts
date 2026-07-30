"use client";

import * as React from "react";

/**
 * Subscribe to a CSS media query. SSR-safe: returns `false` until mounted, then
 * reflects the live match state. Built on `useSyncExternalStore` for correct
 * concurrent-rendering behavior.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = React.useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query],
  );

  const getSnapshot = () => window.matchMedia(query).matches;
  const getServerSnapshot = () => false;

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Semantic breakpoint helpers aligned with the Tailwind default scale. */
export const useIsMobile = () => !useMediaQuery("(min-width: 768px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
