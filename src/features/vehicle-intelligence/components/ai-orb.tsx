"use client";

import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks";

const INNER_PULSE = {
  idle: { duration: 2.6, scale: 1.025 },
  working: { duration: 1.8, scale: 1.03 },
  holding: { duration: 1.1, scale: 1.06 },
} as const;

interface AiOrbProps {
  /**
   * `idle` — present but not yet doing anything (the decode page before a
   * VIN is submitted): a slower ring, a dimmer glow, a barely-there pulse.
   * `working` — actively analyzing (the loading cinematic).
   * `holding` — working past the cinematic's nominal length; pulses a touch
   * faster so a slow response still reads as "still going," never stuck.
   */
  variant?: "idle" | "working" | "holding";
  className?: string;
}

/**
 * AiOrb — Verdikt's "an AI is here" signal: a rotating conic-gradient ring
 * around a pulsing glass core, with two motes drifting in counter-rotating
 * orbits. Pure CSS + a couple of transform-only Framer tweens — no WebGL, so
 * mounting it (twice, if the decode page's idle state and its loading
 * cinematic are both on screen across a transition) never costs a second live
 * 3D context. Collapses to a single static glow under reduced-motion.
 *
 * Shared by the decode workspace's idle stage (`variant="idle"`) and
 * `VerdictLoadingExperience` (`"working"`/`"holding"`), so the product's one
 * "AI presence" reads as the same object throughout the flow, just more or
 * less awake.
 */
export function AiOrb({ variant = "working", className }: AiOrbProps) {
  const reduced = usePrefersReducedMotion();
  const pulse = INNER_PULSE[variant];

  return (
    <div className={cn("relative size-28 shrink-0 sm:size-32", className)}>
      <motion.div
        aria-hidden
        className="absolute inset-[-30%] rounded-full bg-gradient-to-br from-signature/40 via-signature-2/25 to-transparent blur-2xl"
        animate={
          reduced
            ? undefined
            : {
                opacity:
                  variant === "idle" ? [0.35, 0.6, 0.35] : [0.5, 0.9, 0.5],
                scale: [1, 1.08, 1],
              }
        }
        transition={
          reduced
            ? undefined
            : {
                duration: variant === "idle" ? 3.4 : 2.6,
                repeat: Infinity,
                ease: "easeInOut",
              }
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
            animationDuration: variant === "idle" ? "7s" : "3s",
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
        animate={reduced ? undefined : { scale: [1, pulse.scale, 1] }}
        transition={
          reduced
            ? undefined
            : { duration: pulse.duration, repeat: Infinity, ease: "easeInOut" }
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
                "--orbit-duration": variant === "idle" ? "7s" : "4.2s",
              } as React.CSSProperties
            }
          />
          <span
            aria-hidden
            className="orbit-particle"
            style={
              {
                "--orbit-radius": "48px",
                "--orbit-duration": variant === "idle" ? "9s" : "5.6s",
                animationDirection: "reverse",
              } as React.CSSProperties
            }
          />
        </>
      ) : null}
    </div>
  );
}
