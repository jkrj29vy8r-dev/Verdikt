"use client";

import * as React from "react";

import { gsap } from "@/lib/gsap";
import { useGsap } from "@/hooks/use-gsap";

interface ParallaxProps extends React.ComponentProps<"div"> {
  /** Positive drifts slower than scroll, negative faster. -1…1 is typical. */
  speed?: number;
}

/**
 * Parallax — GSAP + ScrollTrigger depth effect. The reusable wrapper for
 * scroll-linked movement; drives the layered depth on the marketing surfaces.
 * Degrades to a static element under reduced-motion (handled by `useGsap`).
 */
export function Parallax({ children, speed = 0.3, ...props }: ParallaxProps) {
  const scope = React.useRef<HTMLDivElement>(null);

  useGsap(scope, () => {
    gsap.to(scope.current, {
      yPercent: speed * -100,
      ease: "none",
      scrollTrigger: {
        trigger: scope.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, [speed]);

  return (
    <div ref={scope} {...props}>
      {children}
    </div>
  );
}
