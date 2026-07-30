"use client";

import * as React from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";

import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks";

interface SceneCanvasProps extends Omit<CanvasProps, "children"> {
  children: React.ReactNode;
  /** Rendered while the WebGL context / assets initialize. */
  fallback?: React.ReactNode;
}

/**
 * SceneCanvas — the single, opinionated React Three Fiber entry point.
 *
 * Every 3D surface mounts through here so we configure the renderer once:
 * color-managed output, capped DPR for performance, and a demand frameloop
 * under reduced-motion (renders one frame, then idles — no spinning GPU for
 * users who opted out). Individual scenes stay pure and declarative.
 */
export function SceneCanvas({
  children,
  fallback = null,
  className,
  camera,
  ...props
}: SceneCanvasProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <Canvas
      className={cn("h-full w-full", className)}
      // Cap device pixel ratio: retina crispness without melting mobile GPUs.
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={
        { fov: 35, position: [0, 0, 6], ...camera } as CanvasProps["camera"]
      }
      frameloop={reduced ? "demand" : "always"}
      {...props}
    >
      <React.Suspense fallback={fallback}>{children}</React.Suspense>
    </Canvas>
  );
}
