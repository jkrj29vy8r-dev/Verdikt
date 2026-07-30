"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { RotateCcw, ScanLine, Sparkles } from "lucide-react";

import { easing } from "@/lib/motion";
import { useInView, useWebglSupported } from "@/hooks";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section";
import { Button } from "@/components/ui/button";

import { ANALYSIS_TIMINGS } from "../analysis";
import { useAnalysisSequence } from "../hooks/use-analysis-sequence";
import { AnalysisHud } from "./analysis-hud";

/**
 * Load the WebGL layer on the client only, and never on the server — keeps
 * three.js off the critical path exactly as the hero does. The stage is
 * mounted only once the section nears the viewport (see `useInView`), so the
 * page never holds two live, animating WebGL contexts at the same time.
 */
const SceneCanvas = dynamic(
  () => import("@/components/three/scene-canvas").then((m) => m.SceneCanvas),
  { ssr: false },
);
const AnalysisStage = dynamic(
  () => import("./analysis-stage").then((m) => m.AnalysisStage),
  { ssr: false },
);

/** Ambient brand glow shown before the scene mounts / when WebGL is absent —
 * always premium, never a broken frame. */
function StageFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="size-2/3 animate-pulse rounded-full bg-gradient-to-br from-signature/25 via-signature-2/10 to-transparent blur-3xl" />
    </div>
  );
}

/** The scanning readout: a glass pill with a determinate progress bar and a
 * travelling shimmer, shown only while the cinematic runs. */
function ScanningStatus({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="surface-glass border-hairline pointer-events-none absolute inset-x-0 top-5 z-20 mx-auto w-fit max-w-[90%] rounded-full border px-4 py-2"
    >
      <div className="flex items-center gap-2.5">
        <ScanLine className="size-4 shrink-0 animate-pulse text-signature" />
        <span className="text-xs font-medium tracking-wide">
          Running diagnostic scan
        </span>
        <span className="relative h-1 w-24 overflow-hidden rounded-full bg-muted">
          <motion.span
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-signature to-signature-2"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration:
                (ANALYSIS_TIMINGS.scanning + ANALYSIS_TIMINGS.revealing) / 1000,
              ease: easing.inOutQuart,
            }}
          />
        </span>
      </div>
    </motion.div>
  );
}

/** Announces phase changes to assistive tech — the 3D scene is decorative, so
 * the result must be conveyed in text too. */
const STATUS_MESSAGE: Record<string, string> = {
  idle: "Ready to analyze.",
  scanning: "Running diagnostic scan.",
  revealing: "Compiling verdict.",
  complete: "Analysis complete. Verdict: Buy.",
};

/**
 * AnalysisExperience — the landing page's signature interactive moment.
 *
 * A cinematic, click-to-run vehicle analysis: the 3D car rotates and reacts to
 * the cursor on a reflective stage, then — on "Analyze" — a scan sweeps it, the
 * body x-rays open to expose a glowing powertrain and flagged damage, the
 * camera settles, and a holographic verdict resolves. It is the product's
 * promise (VIN → definitive verdict) made tangible in five seconds.
 *
 * Degrades with grace: static gradient when WebGL is unavailable, and under
 * reduced motion the cinematic collapses to an instant, fully legible result.
 */
export function AnalysisExperience() {
  const { phase, isAnalyzing, isComplete, analyze, reset } =
    useAnalysisSequence();
  const webglSupported = useWebglSupported();
  const [stageRef, inView] = useInView<HTMLDivElement>({ rootMargin: "300px" });

  const showScene = webglSupported && inView;
  const revealed = phase === "revealing" || isComplete;

  return (
    <section id="analyze" className="relative py-20 md:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Live analysis"
          title="Watch a verdict take shape"
          description="This is the whole product in one gesture — decode, scan, and resolve any vehicle to an explicit call. Press Analyze."
          className="mx-auto mb-10 items-center md:mb-14"
        />

        <div className="relative mx-auto max-w-6xl">
          {/* Stage: the 3D scene and its overlays */}
          <div
            ref={stageRef}
            className="border-hairline relative h-[52vh] min-h-[380px] w-full overflow-hidden rounded-3xl border bg-gradient-to-b from-card/40 to-background lg:h-[72vh] lg:min-h-[600px]"
          >
            {/* Decorative visual layer: the 3D scene and the holographic
             * overlays. Hidden from assistive tech — the result is conveyed by
             * the live-region status below — but the controls stay reachable. */}
            <div aria-hidden className="absolute inset-0">
              {showScene ? (
                <SceneCanvas
                  className="absolute inset-0"
                  fallback={<StageFallback />}
                  camera={{ position: [0.8, 0.62, 5.7], fov: 38 }}
                >
                  <AnalysisStage phase={phase} />
                </SceneCanvas>
              ) : (
                <StageFallback />
              )}

              <ScanningStatus active={isAnalyzing} />

              {/* HUD overlay (desktop): floats over the right of the stage */}
              <div className="pointer-events-none absolute top-1/2 right-5 z-20 hidden w-80 -translate-y-1/2 lg:block">
                <AnalysisHud visible={revealed} />
              </div>
            </div>

            {/* Controls: float at the bottom of the stage (interactive — never
             * inside the aria-hidden layer). */}
            <div className="absolute inset-x-0 bottom-6 z-30 flex justify-center">
              <Controls
                isAnalyzing={isAnalyzing}
                isComplete={isComplete}
                onAnalyze={analyze}
                onReset={reset}
              />
            </div>
          </div>

          {/* HUD (mobile / no-lg): stacks below the stage so it never covers
           * the car on small screens. Decorative duplicate of the live status. */}
          <div aria-hidden className="mt-6 lg:hidden">
            <AnalysisHud visible={revealed} />
          </div>
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          {STATUS_MESSAGE[phase]}
        </p>
      </Container>
    </section>
  );
}

/** The morphing action control: Analyze → Analyzing… → Run again. */
function Controls({
  isAnalyzing,
  isComplete,
  onAnalyze,
  onReset,
}: {
  isAnalyzing: boolean;
  isComplete: boolean;
  onAnalyze: () => void;
  onReset: () => void;
}) {
  if (isComplete) {
    return (
      <Button variant="outline" size="lg" onClick={onReset} className="gap-2">
        <RotateCcw className="size-4" />
        Run again
      </Button>
    );
  }

  return (
    <Button
      variant="signature"
      size="lg"
      onClick={onAnalyze}
      disabled={isAnalyzing}
      className="gap-2"
    >
      {isAnalyzing ? (
        <>
          <ScanLine className="size-4 animate-pulse" />
          Analyzing…
        </>
      ) : (
        <>
          <Sparkles className="size-4" />
          Analyze this vehicle
        </>
      )}
    </Button>
  );
}
