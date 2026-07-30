"use client";

import * as React from "react";

import { usePrefersReducedMotion } from "@/hooks";
import { ANALYSIS_TIMINGS, type AnalysisPhase } from "../analysis";

export interface AnalysisSequence {
  phase: AnalysisPhase;
  isIdle: boolean;
  /** Scanning or revealing — the cinematic is mid-flight. */
  isAnalyzing: boolean;
  isComplete: boolean;
  /** Kick off the cinematic (or jump straight to the result under reduced-motion). */
  analyze: () => void;
  /** Return to the untouched idle state. */
  reset: () => void;
}

/**
 * useAnalysisSequence — the state machine behind the "Analyze" cinematic.
 *
 * Advances `idle → scanning → revealing → complete` on timers so the 3D stage
 * and the holographic HUD read from a single phase and stay in lockstep. Under
 * reduced-motion it skips the timed beats and lands on `complete` immediately —
 * the result is the point, the choreography is the enhancement. All timers are
 * cleared on reset and unmount so a rapid analyze/reset never leaks a
 * transition.
 */
export function useAnalysisSequence(): AnalysisSequence {
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = React.useState<AnalysisPhase>("idle");
  const timers = React.useRef<number[]>([]);

  const clearTimers = React.useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  }, []);

  const analyze = React.useCallback(() => {
    clearTimers();
    if (reduced) {
      setPhase("complete");
      return;
    }
    setPhase("scanning");
    timers.current.push(
      window.setTimeout(() => setPhase("revealing"), ANALYSIS_TIMINGS.scanning),
      window.setTimeout(
        () => setPhase("complete"),
        ANALYSIS_TIMINGS.scanning + ANALYSIS_TIMINGS.revealing,
      ),
    );
  }, [reduced, clearTimers]);

  const reset = React.useCallback(() => {
    clearTimers();
    setPhase("idle");
  }, [clearTimers]);

  React.useEffect(() => clearTimers, [clearTimers]);

  return {
    phase,
    isIdle: phase === "idle",
    isAnalyzing: phase === "scanning" || phase === "revealing",
    isComplete: phase === "complete",
    analyze,
    reset,
  };
}
