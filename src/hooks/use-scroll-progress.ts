"use client";

import * as React from "react";

/**
 * Tracks scroll progress across the first viewport — 0 at the top, 1 after the
 * visitor has scrolled one screen height — into a ref updated on a passive
 * scroll listener.
 *
 * Returning a ref (not state) is deliberate: the R3F render loop reads
 * `ref.current` inside `useFrame` every frame, so driving 3D from scroll must
 * NOT re-render React on every scroll tick. State here would thrash the tree.
 */
export function useHeroScrollProgress(): React.RefObject<number> {
  const progress = React.useRef(0);

  React.useEffect(() => {
    const update = () => {
      const vh = window.innerHeight || 1;
      progress.current = Math.min(1, Math.max(0, window.scrollY / vh));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return progress;
}
