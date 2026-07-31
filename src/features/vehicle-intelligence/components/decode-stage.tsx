"use client";

import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";

import { duration, easing } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks";
import { Badge } from "@/components/ui/badge";
import { FloatingParticles } from "@/components/shared/floating-particles";

import { AiOrb } from "./ai-orb";

/**
 * DecodeStage — the premium container the VIN input sits inside on /decode.
 *
 * Before this existed, /decode was a plain heading and an input field over
 * empty space — the same "click Run a verdict, get nothing" gap the loading
 * cinematic fixes for the *submit* moment, just one screen earlier, for the
 * page itself. This gives the destination the same presence as the rest of
 * the product: an idle `AiOrb` (the calm variant — present, not working yet),
 * ambient particles, and a line of copy, all inside the same glass surface
 * the input lives in.
 *
 * The idle content hides the instant a request starts or a report exists —
 * `VinInput`'s own loading cinematic and then the report take over the
 * moment, and showing both at once would be clutter, not polish.
 */
export function DecodeStage({
  active,
  children,
}: {
  /** Show the idle orb/copy. Pass `false` while a verdict is pending or a
   * report is already on screen. */
  active: boolean;
  children: React.ReactNode;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="surface-glass border-hairline relative overflow-hidden rounded-3xl border px-6 py-10 sm:px-10 sm:py-12">
      {!reduced ? (
        <div
          aria-hidden
          className="aurora-veil absolute inset-0 -z-10 opacity-60"
        />
      ) : null}
      <FloatingParticles className="opacity-50" />

      <div className="relative flex flex-col items-center gap-6">
        <AnimatePresence initial={false}>
          {active ? (
            <motion.div
              key="idle"
              initial={reduced ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: duration.base, ease: easing.outExpo }}
              className="flex w-full flex-col items-center gap-5"
            >
              <AiOrb variant="idle" />
              <div className="flex flex-col items-center gap-3 text-center">
                <Badge variant="secondary" className="gap-1.5 py-1">
                  <Sparkles className="size-3.5" />
                  AI-powered vehicle intelligence
                </Badge>
                <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                  Your next verdict starts here.
                </h2>
                <p className="max-w-md text-pretty text-muted-foreground">
                  Enter a VIN below — history, valuation, risk, and market
                  position, synthesized into one definitive call.
                </p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <motion.div layout="position" className="w-full max-w-xl">
          {children}
        </motion.div>
      </div>
    </div>
  );
}
