"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks";

/**
 * Spotlight — a cursor-tracked radial highlight for elevated surfaces.
 *
 * Wrap a card's contents (not the card's own border/shadow element — nest this
 * one level in) to get a soft signature-tinted glow that follows the pointer,
 * the way Linear/Stripe treat their feature cards. Pointer position is written
 * to CSS custom properties on the wrapper so the decorative overlay (a plain
 * child div, `pointer-events-none`) can read them via `var()` — no per-frame
 * React state, so hovering never triggers a re-render. Renders children plain
 * under reduced-motion: no listener, no glow.
 */
export function Spotlight({
  children,
  className,
  contentClassName,
}: {
  children: React.ReactNode;
  className?: string;
  /** Applied to the inner content wrapper — set this to whatever layout
   * (flex/gap, centering) the wrapped content needs, since it now sits one
   * DOM level deeper than before Spotlight wrapped it. */
  contentClassName?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onPointerMove={reduced ? undefined : handlePointerMove}
      className={cn(
        "group/spotlight relative isolate h-full rounded-[inherit]",
        className,
      )}
    >
      {reduced ? null : (
        <div
          aria-hidden
          className="spotlight-glow pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/spotlight:opacity-100"
        />
      )}
      <div className={cn("relative h-full", contentClassName)}>{children}</div>
    </div>
  );
}
