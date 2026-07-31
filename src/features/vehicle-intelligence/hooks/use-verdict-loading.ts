"use client";

import * as React from "react";

import { usePrefersReducedMotion } from "@/hooks";
import {
  VERDICT_LOADING_MESSAGES,
  VERDICT_LOADING_MESSAGE_MS,
  VERDICT_LOADING_STEPS,
} from "../verdict-loading";

export interface VerdictLoadingState {
  message: string;
  messageIndex: number;
  totalMessages: number;
  /** Steps with a checkmark. Capped one short of `totalSteps` — the last step
   * ("AI Verdict") only ever checks once the caller stops rendering this
   * view, since its lifetime *is* the "still working" signal (see below). */
  completedSteps: number;
  totalSteps: number;
  /** The ticker has reached its last message and is holding there — the
   * "still working" pulse belongs on the final row once this is true. */
  isHolding: boolean;
}

const LAST_TICK = VERDICT_LOADING_MESSAGES.length - 1;

/**
 * useVerdictLoading — drives the loading cinematic's ticker for as long as
 * the component using it stays mounted.
 *
 * There's no `isPending` prop: the caller (`VerdictLoadingExperience`, and
 * above it `VinInput`) mounts this exactly while the real verdict request is
 * in flight and unmounts it the instant a result is back, so mount/unmount
 * *is* the pending signal — no second boolean to keep in sync with it.
 *
 * The ticker advances on a fixed cadence and holds at the final message
 * rather than looping or stopping dead, so a request that runs long still
 * reads as "working," never "stuck." It does not, on its own, guarantee the
 * ~5s nominal length feels earned: `VinInput` holds the real reveal back by
 * `VERDICT_LOADING_MIN_MS`, so a fast response still gets the full cinematic
 * and a slow one is never cut short or masked.
 */
export function useVerdictLoading(): VerdictLoadingState {
  const reduced = usePrefersReducedMotion();
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (reduced) {
      setTick(LAST_TICK);
      return;
    }

    let cancelled = false;
    let timeoutId: number;

    const scheduleNext = () => {
      timeoutId = window.setTimeout(() => {
        if (cancelled) return;
        setTick((t) => Math.min(t + 1, LAST_TICK));
        scheduleNext();
      }, VERDICT_LOADING_MESSAGE_MS);
    };
    scheduleNext();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [reduced]);

  const totalSteps = VERDICT_LOADING_STEPS.length;
  const stepRatio = (tick + 1) / VERDICT_LOADING_MESSAGES.length;
  const completedSteps = Math.min(
    totalSteps - 1,
    Math.round(stepRatio * totalSteps),
  );

  return {
    message: VERDICT_LOADING_MESSAGES[tick]!,
    messageIndex: tick,
    totalMessages: VERDICT_LOADING_MESSAGES.length,
    completedSteps,
    totalSteps,
    isHolding: tick >= LAST_TICK,
  };
}
