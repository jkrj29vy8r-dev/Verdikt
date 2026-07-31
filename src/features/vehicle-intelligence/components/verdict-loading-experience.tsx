"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { duration, easing } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks";
import { FloatingParticles } from "@/components/shared/floating-particles";

import { VERDICT_LOADING_STEPS } from "../verdict-loading";
import { useVerdictLoading } from "../hooks/use-verdict-loading";

/**
 * AiOrb — the loading cinematic's centerpiece: a rotating conic-gradient ring
 * around a pulsing glass core, with two motes drifting in counter-rotating
 * orbits. Pure CSS + a couple of transform-only Framer tweens (no WebGL — a
 * second live 3D context on every verdict submission would cost far more than
 * this moment is worth). Collapses to a single static glow under
 * reduced-motion.
 */
function AiOrb({ isHolding }: { isHolding: boolean }) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="relative size-28 shrink-0 sm:size-32">
      <motion.div
        aria-hidden
        className="absolute inset-[-30%] rounded-full bg-gradient-to-br from-signature/40 via-signature-2/25 to-transparent blur-2xl"
        animate={
          reduced
            ? undefined
            : { opacity: [0.5, 0.9, 0.5], scale: [1, 1.08, 1] }
        }
        transition={
          reduced
            ? undefined
            : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {!reduced ? (
        <div
          aria-hidden
          className="absolute inset-0 animate-spin rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, var(--signature), var(--signature-2), transparent)",
            WebkitMask:
              "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
            animationDuration: "3s",
          }}
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, var(--signature), var(--signature-2), var(--signature))",
            WebkitMask:
              "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
          }}
        />
      )}

      <motion.div
        aria-hidden
        className="surface-glass border-hairline absolute inset-[14%] overflow-hidden rounded-full border"
        style={{ boxShadow: "var(--shadow-glow)" }}
        animate={
          reduced
            ? undefined
            : { scale: isHolding ? [1, 1.06, 1] : [1, 1.03, 1] }
        }
        transition={
          reduced
            ? undefined
            : {
                duration: isHolding ? 1.1 : 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      >
        <div className="absolute inset-0 bg-gradient-to-br from-signature/30 via-transparent to-signature-2/25" />
      </motion.div>

      {!reduced ? (
        <>
          <span
            aria-hidden
            className="orbit-particle"
            style={
              {
                "--orbit-radius": "58px",
                "--orbit-duration": "4.2s",
              } as React.CSSProperties
            }
          />
          <span
            aria-hidden
            className="orbit-particle"
            style={
              {
                "--orbit-radius": "48px",
                "--orbit-duration": "5.6s",
                animationDirection: "reverse",
              } as React.CSSProperties
            }
          />
        </>
      ) : null}
    </div>
  );
}

/** The rotating activity caption and its progress bar. */
function LoadingTicker({
  message,
  progress,
}: {
  message: string;
  progress: number;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-3">
      <div className="flex h-5 items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={message}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: duration.fast, ease: easing.outExpo }}
            className="text-sm font-medium text-pretty text-muted-foreground"
          >
            {message}
          </motion.p>
        </AnimatePresence>
      </div>
      <span className="relative h-1 w-full overflow-hidden rounded-full bg-muted">
        <motion.span
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-signature to-signature-2"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: easing.outExpo }}
        />
      </span>
    </div>
  );
}

/** One row of the persistent checklist: a status dot/checkmark, a connecting
 * line to the next row, and a label. */
function TimelineRow({
  label,
  isDone,
  isCurrent,
  isLast,
}: {
  label: string;
  isDone: boolean;
  isCurrent: boolean;
  isLast: boolean;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <li className="flex gap-3">
      <div className="flex flex-col items-center">
        <motion.span
          className={cn(
            "grid size-6 shrink-0 place-items-center rounded-full border",
            isDone
              ? "border-verdict-clear bg-verdict-clear/15 text-verdict-clear"
              : isCurrent
                ? "border-signature bg-signature/10 text-signature"
                : "border-border text-muted-foreground/40",
          )}
          initial={false}
          animate={isDone ? { scale: [0.6, 1.15, 1] } : { scale: 1 }}
          transition={
            reduced ? { duration: 0 } : { duration: 0.4, ease: easing.outBack }
          }
        >
          {isDone ? (
            <Check className="size-3.5" />
          ) : isCurrent ? (
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-current motion-safe:animate-pulse"
            />
          ) : null}
        </motion.span>
        {!isLast ? (
          <span className="relative my-1 w-px flex-1 overflow-hidden bg-border">
            <motion.span
              className="absolute inset-x-0 top-0 bg-verdict-clear"
              initial={false}
              animate={{ height: isDone ? "100%" : "0%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </span>
        ) : null}
      </div>
      <span
        className={cn(
          "pb-6 text-sm",
          isDone || isCurrent
            ? "font-medium text-foreground"
            : "text-muted-foreground/50",
        )}
      >
        {label}
      </span>
    </li>
  );
}

/**
 * VerdictLoadingExperience — replaces the blank wait after "Run verdict" with
 * a paced cinematic: a rotating AI orb, a console-style activity ticker, and
 * a persistent checklist that checks off as the (simulated) analysis
 * progresses. Mount this only while the real request is in flight — its
 * lifetime *is* the loading signal (see `useVerdictLoading`).
 *
 * Reduced motion drops the orb's spin/pulse and the ticker's per-message
 * animation, but keeps the same layout and a live status line, so the wait is
 * still legible — just quiet.
 */
export function VerdictLoadingExperience({
  className,
}: {
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const state = useVerdictLoading();
  const progress = Math.round(
    ((state.messageIndex + 1) / state.totalMessages) * 100,
  );

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0 }}
      transition={{ duration: duration.slow, ease: easing.outExpo }}
      className={cn(
        "surface-glass border-hairline relative overflow-hidden rounded-3xl border px-6 py-10 sm:px-10 sm:py-12",
        className,
      )}
    >
      {!reduced ? (
        <div
          aria-hidden
          className="aurora-veil absolute inset-0 -z-10 opacity-70"
        />
      ) : null}
      <FloatingParticles className="opacity-60" />

      <div className="relative flex flex-col items-center gap-8">
        <AiOrb isHolding={state.isHolding} />
        <LoadingTicker
          message={reduced ? "Synthesizing your verdict…" : state.message}
          progress={reduced ? 96 : progress}
        />
        <ol className="flex w-full max-w-xs flex-col">
          {VERDICT_LOADING_STEPS.map((step, i) => (
            <TimelineRow
              key={step.key}
              label={step.label}
              isDone={i < state.completedSteps}
              isCurrent={i === state.completedSteps}
              isLast={i === VERDICT_LOADING_STEPS.length - 1}
            />
          ))}
        </ol>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {reduced ? "Synthesizing your verdict." : state.message}
      </p>
    </motion.div>
  );
}
