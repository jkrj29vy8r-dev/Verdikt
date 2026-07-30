"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { PresentationControls } from "@react-three/drei";

import { cn } from "@/lib/utils";
import { useIsMobile, useWebglSupported } from "@/hooks";

/**
 * Lazy-load the WebGL layer on the client only. This keeps three.js out of the
 * server bundle and off the critical path — the page is interactive before the
 * 3D scene hydrates, and users on constrained devices still get the gradient.
 */
const SceneCanvas = dynamic(
  () => import("./scene-canvas").then((m) => m.SceneCanvas),
  { ssr: false },
);
const VehicleSilhouette = dynamic(
  () => import("./vehicle-silhouette").then((m) => m.VehicleSilhouette),
  { ssr: false },
);

/** Soft brand gradient shown before WebGL hydrates, or permanently when
 * WebGL is unsupported. Never a dead end — always reads as "premium ambient
 * glow," never as a broken image. */
function SceneFallback() {
  return (
    <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-br from-signature/25 via-signature-2/10 to-transparent blur-3xl" />
  );
}

/**
 * HeroScene — the full-bleed 3D hero backdrop.
 *
 * Composes the reusable SceneCanvas with the original VehicleSilhouette scene,
 * wrapped in drei's PresentationControls for a smooth, spring-damped,
 * pointer-driven camera — constrained so a visitor can never spin the scene
 * into disorientation. Gracefully degrades to a static gradient when WebGL is
 * unavailable, keeping the hero premium either way.
 */
export function HeroScene({ className }: { className?: string }) {
  const webglSupported = useWebglSupported();
  const isMobile = useIsMobile();

  if (!webglSupported) {
    return (
      <div className={cn("relative h-full w-full", className)}>
        <SceneFallback />
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full", className)}>
      <React.Suspense fallback={<SceneFallback />}>
        <SceneCanvas
          fallback={<SceneFallback />}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
        >
          {/* Pointer-drag rotation is desktop-only: on touch, a global drag
           * over the full-bleed canvas would hijack page scroll. Mobile keeps
           * the idle spin + scroll-reactive motion, which is plenty. */}
          <PresentationControls
            enabled={!isMobile}
            global
            cursor
            snap
            speed={1.2}
            damping={0.35}
            polar={[-0.2, 0.25]}
            azimuth={[-0.5, 0.5]}
          >
            <VehicleSilhouette />
          </PresentationControls>
        </SceneCanvas>
      </React.Suspense>
    </div>
  );
}
