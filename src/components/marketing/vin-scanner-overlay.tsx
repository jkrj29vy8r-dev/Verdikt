"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Activity, ScanLine, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { duration, easing } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks";

/**
 * Sample VINs cycled by the idle "decoding" readout. Real, structurally valid
 * VINs (see `features/vehicle-intelligence/schema.ts`) so the effect never
 * shows something that looks like a bug — just decorative flavor before the
 * visitor types their own.
 */
const SAMPLE_VINS = [
  "1HGCM82633A004352",
  "5YJ3E1EA7HF000337",
  "JH4KA9650MC000000",
];

const TYPE_SPEED_MS = 55;
const HOLD_MS = 1400;

/**
 * DecodingVinReadout — a small mono, tabular readout above the hero's VIN
 * field that idly "scans" sample VINs character by character, reinforcing the
 * scan motif before a visitor interacts. Pauses the moment the real field is
 * dirty (the caller stops rendering it), and never animates under
 * reduced-motion — it shows one sample, fully typed, statically.
 */
export function DecodingVinReadout({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const [sampleIndex, setSampleIndex] = React.useState(0);
  const [charCount, setCharCount] = React.useState(reduced ? 17 : 0);

  React.useEffect(() => {
    if (reduced) return;

    const sample = SAMPLE_VINS[sampleIndex % SAMPLE_VINS.length]!;
    if (charCount < sample.length) {
      const t = setTimeout(() => setCharCount((c) => c + 1), TYPE_SPEED_MS);
      return () => clearTimeout(t);
    }

    const hold = setTimeout(() => {
      setCharCount(0);
      setSampleIndex((i) => i + 1);
    }, HOLD_MS);
    return () => clearTimeout(hold);
  }, [charCount, sampleIndex, reduced]);

  const sample = SAMPLE_VINS[sampleIndex % SAMPLE_VINS.length]!;
  const visible = sample.slice(0, charCount);

  return (
    <div
      aria-hidden
      className={cn(
        "flex items-center justify-center gap-2 font-mono text-xs tracking-[0.2em] text-muted-foreground/70 md:justify-start",
        className,
      )}
    >
      <ScanLine className="size-3.5 text-signature" />
      <span>SCANNING</span>
      <span className="tabular min-w-[13ch] text-left text-signature/80">
        {visible}
        {!reduced && <span className="animate-pulse">_</span>}
      </span>
    </div>
  );
}

interface HudChip {
  icon: typeof Activity;
  label: string;
  position: string;
  delay: number;
}

const HUD_CHIPS: HudChip[] = [
  {
    icon: Activity,
    label: "5 dimensions analyzed",
    position: "left-[6%] top-[22%]",
    delay: 0.4,
  },
  {
    icon: ShieldCheck,
    label: "Explainable scoring",
    position: "right-[6%] top-[30%]",
    delay: 0.6,
  },
  {
    icon: ScanLine,
    label: "AI-powered valuation",
    position: "right-[10%] bottom-[24%]",
    delay: 0.8,
  },
];

/**
 * HolographicHud — floating glass data chips scattered around the hero,
 * selling "an AI is actively analyzing" without a single word of body copy.
 * Purely decorative (`aria-hidden`); hidden entirely below `lg` so it never
 * competes with the headline or VIN field on small screens (Mercedes-style
 * restraint: most of the hero should stay quiet). Static (no float loop) under
 * reduced-motion.
 */
export function HolographicHud() {
  const reduced = usePrefersReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 hidden lg:block"
    >
      {HUD_CHIPS.map((chip) => (
        <motion.div
          key={chip.label}
          className={cn(
            "surface-glass border-hairline absolute rounded-full border px-3 py-1.5",
            chip.position,
          )}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: [0, 1, 1, 0.6], y: 0 }}
          transition={{
            duration: duration.slower,
            delay: chip.delay,
            ease: easing.outExpo,
            ...(reduced
              ? {}
              : {
                  times: [0, 0.15, 0.85, 1],
                  repeat: Infinity,
                  repeatDelay: 3,
                }),
          }}
        >
          <span className="flex items-center gap-1.5 text-xs font-medium text-foreground/80">
            <chip.icon className="size-3.5 text-signature" />
            {chip.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
