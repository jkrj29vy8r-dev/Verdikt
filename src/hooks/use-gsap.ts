"use client";

import * as React from "react";

import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

/** Run layout effects on the client, no-op on the server. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/**
 * useGsap — the safe, idiomatic way to run GSAP in React.
 *
 * Runs `callback` inside a `gsap.context()` scoped to `scopeRef`, so every
 * tween/ScrollTrigger created within is automatically reverted on unmount or
 * when a dependency changes. Skips entirely under reduced-motion.
 *
 * @example
 * const scope = useRef<HTMLDivElement>(null);
 * useGsap(scope, () => {
 *   gsap.from(".layer", { y: 100, scrollTrigger: { trigger: scope.current } });
 * });
 */
export function useGsap(
  scopeRef: React.RefObject<HTMLElement | null>,
  callback: (ctx: gsap.Context) => void,
  deps: React.DependencyList = [],
): void {
  const reduced = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (reduced || !scopeRef.current) return;
    const ctx = gsap.context(callback, scopeRef);
    return () => ctx.revert();
  }, [reduced, ...deps]);
}
