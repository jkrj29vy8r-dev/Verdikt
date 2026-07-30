"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles } from "lucide-react";

import { GlassPanel, LivePulse, PanelHeading } from "@/components/shared";
import { usePrefersReducedMotion } from "@/hooks";

/** A live-ish number that jitters around a base on an interval — the "the AI is
 * working right now" tell. Holds steady (no interval) under reduced motion. */
function useLiveNumber(base: number, jitter: number, active: boolean): number {
  const [n, setN] = React.useState(base);
  React.useEffect(() => {
    if (!active) {
      setN(base);
      return;
    }
    const id = window.setInterval(() => {
      setN(base + Math.round((Math.random() - 0.5) * 2 * jitter));
    }, 2400);
    return () => window.clearInterval(id);
  }, [base, jitter, active]);
  return n;
}

const BARS = [0, 1, 2, 3, 4, 5, 6];

/** Static "console" telemetry that dresses the widget as a running system. */
const SYSTEM_STATS = [
  { label: "Models", value: "5 online" },
  { label: "Latency", value: "42ms" },
  { label: "Uptime", value: "99.9%" },
] as const;

/** A small equalizer that bounces to suggest live processing. Frozen mid-height
 * under reduced motion. */
function Equalizer({ animated }: { animated: boolean }) {
  return (
    <div className="flex h-6 items-end gap-1" aria-hidden>
      {BARS.map((i) => (
        <motion.span
          key={i}
          className="w-1 origin-bottom rounded-full bg-signature/70"
          style={{ height: "100%" }}
          initial={{ scaleY: 0.4 }}
          animate={
            animated ? { scaleY: [0.3, 1, 0.5, 0.85, 0.4] } : { scaleY: 0.5 }
          }
          transition={
            animated
              ? {
                  repeat: Infinity,
                  duration: 1.1 + (i % 3) * 0.3,
                  ease: "easeInOut",
                  delay: i * 0.08,
                }
              : { duration: 0 }
          }
        />
      ))}
    </div>
  );
}

/**
 * AiPulse — the live AI widget.
 *
 * The command center's heartbeat: an "online" pulse, a throughput figure that
 * ticks in real time, an equalizer that suggests continuous processing, and a
 * feed of data-aware insights that rotate through on their own. Everything that
 * moves here is gated on reduced motion, where it settles into a calm, static
 * summary that still reads as a working system.
 */
export function AiPulse({ insights }: { insights: string[] }) {
  const reduced = usePrefersReducedMotion();
  const animated = !reduced;
  const throughput = useLiveNumber(1240, 40, animated);
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    if (reduced || insights.length <= 1) return;
    const id = window.setInterval(
      () => setIdx((i) => (i + 1) % insights.length),
      3800,
    );
    return () => window.clearInterval(id);
  }, [reduced, insights.length]);

  const current = insights[idx] ?? insights[0] ?? "";

  return (
    <GlassPanel className="flex h-full flex-col">
      <PanelHeading
        eyebrow="Verdikt Intelligence"
        title="AI activity"
        trailing={<LivePulse label="Online" />}
      />

      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="tabular text-3xl font-semibold tracking-tight">
            {throughput.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">analyses / hour</p>
        </div>
        <Equalizer animated={animated} />
      </div>

      <div className="border-hairline grid grid-cols-3 gap-2 border-t pt-4">
        {SYSTEM_STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-0.5">
            <span className="text-[0.65rem] tracking-wide text-muted-foreground uppercase">
              {stat.label}
            </span>
            <span className="tabular text-sm font-semibold">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4">
        <div className="min-h-[3.5rem] rounded-xl bg-foreground/[0.03] p-3">
          <AnimatePresence mode="wait">
            <motion.p
              key={idx}
              className="flex items-start gap-2 text-sm text-pretty"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <Sparkles className="mt-0.5 size-4 shrink-0 text-signature" />
              <span>{current}</span>
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </GlassPanel>
  );
}
