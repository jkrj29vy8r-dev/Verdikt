"use client";

import * as React from "react";

interface UseInViewOptions {
  /** Grow/shrink the observed viewport box (CSS margin syntax). A positive
   * value mounts the target early, before it scrolls fully into view. */
  rootMargin?: string;
  /** Fraction of the target visible before it counts as in view. */
  threshold?: number;
  /** Latch `true` on first intersection and stop observing. */
  once?: boolean;
}

/**
 * useInView — reports whether a referenced element is within (or near) the
 * viewport, via a single IntersectionObserver.
 *
 * Its reason for existing: gating expensive work to when it can actually be
 * seen. The interactive 3D analysis stage mounts its WebGL canvas only when the
 * section approaches the viewport and tears it down when it leaves — so the page
 * never holds two live, animating WebGL contexts at once. SSR-safe (returns
 * `false` until mounted).
 */
export function useInView<T extends Element = HTMLDivElement>({
  rootMargin = "0px",
  threshold = 0,
  once = false,
}: UseInViewOptions = {}): [React.RefObject<T | null>, boolean] {
  const ref = React.useRef<T>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { rootMargin, threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return [ref, inView];
}
