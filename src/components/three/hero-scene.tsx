"use client";

import * as React from "react";
import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";

/**
 * Lazy-load the WebGL layer on the client only. This keeps three.js out of the
 * server bundle and off the critical path — the page is interactive before the
 * 3D scene hydrates, and users on constrained devices still get the gradient.
 */
const SceneCanvas = dynamic(
  () => import("./scene-canvas").then((m) => m.SceneCanvas),
  { ssr: false },
);
const VerdiktCore = dynamic(
  () => import("./verdikt-core").then((m) => m.VerdiktCore),
  { ssr: false },
);

/** Soft brand gradient shown before/instead of WebGL. */
function SceneFallback() {
  return (
    <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-br from-signature/20 via-transparent to-signature-2/10 blur-2xl" />
  );
}

/**
 * HeroScene — drop-in 3D hero. Composes the reusable SceneCanvas with the
 * VerdiktCore scene and a graceful fallback, so pages consume a single element.
 */
export function HeroScene({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-full w-full", className)}>
      <React.Suspense fallback={<SceneFallback />}>
        <SceneCanvas fallback={<SceneFallback />}>
          <VerdiktCore />
        </SceneCanvas>
      </React.Suspense>
    </div>
  );
}
