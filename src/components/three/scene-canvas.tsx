"use client";

import * as React from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";

import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks";

interface SceneCanvasProps extends Omit<CanvasProps, "children"> {
  children: React.ReactNode;
  /** Rendered while the WebGL context / assets initialize. */
  fallback?: React.ReactNode;
  /**
   * Whether the scene should be actively animating. Pass the host's in-view
   * state: a mounted canvas with the default `always` frameloop keeps issuing
   * draw calls even when scrolled far off screen, burning GPU and battery to
   * render something nobody can see. Setting this `false` idles the loop while
   * keeping the WebGL context alive, so scrolling back is instant (no
   * re-initialization flash, which unmounting would cause).
   */
  active?: boolean;
}

/**
 * SceneCanvas — the single, opinionated React Three Fiber entry point.
 *
 * Every 3D surface mounts through here so we configure the renderer once:
 * color-managed output, capped DPR for performance, and an idle frameloop
 * whenever the scene can't be seen or the user opted out of motion (renders
 * one frame, then stops — no spinning GPU). Individual scenes stay pure and
 * declarative.
 */
export function SceneCanvas({
  children,
  fallback = null,
  className,
  camera,
  active = true,
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
      frameloop={reduced || !active ? "demand" : "always"}
      {...props}
    >
      <React.Suspense fallback={fallback}>{children}</React.Suspense>
    </Canvas>
  );
}
