"use client";

import * as React from "react";
import { motion } from "motion/react";
import { BatteryCharging, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { duration, easing } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks";
import { VerdictScore } from "@/components/shared/verdict-score";
import { Badge } from "@/components/ui/badge";

import type { VerdictStatus } from "../types";
import {
  ANALYSIS_CHECKS,
  DAMAGE_POINTS,
  DEMO_IDENTITY,
  DEMO_VERDICT,
  POWERTRAIN,
} from "../analysis";
import { RecommendationPill } from "./recommendation-pill";

/** Status → semantic dot color. `flagged` maps to the `--verdict-flag` token. */
const DOT: Record<VerdictStatus, string> = {
  clear: "bg-verdict-clear",
  caution: "bg-verdict-caution",
  flagged: "bg-verdict-flag",
};

/**
 * A glass panel that blurs/rises into place when the analysis result is
 * revealed, staggered by `index`. Static under reduced motion. Non-interactive
 * (`pointer-events-none` is applied by the overlay) so the 3D car keeps
 * receiving the cursor beneath it.
 */
function Panel({
  children,
  index,
  visible,
  className,
}: {
  children: React.ReactNode;
  index: number;
  visible: boolean;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      className={cn(
        "surface-glass border-hairline rounded-2xl border p-5",
        className,
      )}
      initial={false}
      animate={
        visible
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 18, filter: "blur(8px)" }
      }
      transition={
        reduced
          ? { duration: 0 }
          : {
              duration: duration.slow,
              ease: easing.outExpo,
              delay: visible ? index * 0.12 : 0,
            }
      }
    >
      {children}
    </motion.div>
  );
}

/** One findings row: a status dot, a label, and a short note. */
function FindingRow({
  status,
  label,
  note,
}: {
  status: VerdictStatus;
  label: string;
  note: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={cn("mt-1.5 size-2 shrink-0 rounded-full", DOT[status])}
        aria-hidden
      />
      <span className="flex flex-1 flex-wrap items-baseline justify-between gap-x-3">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">{note}</span>
      </span>
    </li>
  );
}

/**
 * AnalysisHud — the holographic result overlay for the interactive analysis.
 *
 * Three glass panels — the verdict (signature score ring + buy/consider/avoid
 * call), the powertrain readout, and the scan findings — that materialize once
 * the body x-rays open (`visible`). Built entirely from the design system, so
 * it reads as the same product as the real report and stays fully legible and
 * screen-reader accessible over the 3D scene.
 */
export function AnalysisHud({ visible }: { visible: boolean }) {
  return (
    <div className="flex w-full flex-col gap-3">
      {/* Verdict */}
      <Panel index={0} visible={visible}>
        <div className="flex items-center gap-4">
          <VerdictScore
            score={DEMO_VERDICT.score}
            status={DEMO_VERDICT.status}
            size="sm"
          />
          <div className="flex flex-col gap-1.5">
            <span className="text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
              {DEMO_IDENTITY.year} {DEMO_IDENTITY.make} {DEMO_IDENTITY.model} ·{" "}
              {DEMO_IDENTITY.trim}
            </span>
            <RecommendationPill
              recommendation={DEMO_VERDICT.recommendation}
              showPrefix={false}
            />
            <p className="text-sm font-semibold text-balance">
              {DEMO_VERDICT.headline}
            </p>
            <p className="tabular text-xs text-muted-foreground">
              {DEMO_VERDICT.valuation}
            </p>
          </div>
        </div>
      </Panel>

      {/* Powertrain */}
      <Panel index={1} visible={visible}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2 text-sm font-medium">
            <BatteryCharging className="size-4 text-signature" />
            {POWERTRAIN.title}
          </span>
          <Badge variant="clear" className="uppercase">
            Healthy
          </Badge>
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
          {POWERTRAIN.metrics.map((metric) => (
            <div key={metric.label} className="flex flex-col gap-0.5">
              <dt className="text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
                {metric.label}
              </dt>
              <dd className="tabular text-sm font-semibold">{metric.value}</dd>
            </div>
          ))}
        </dl>
      </Panel>

      {/* Findings */}
      <Panel index={2} visible={visible}>
        <div className="mb-3 flex items-center gap-2 text-sm font-medium">
          <ShieldCheck className="size-4 text-signature" />
          Scan findings
        </div>
        <ul className="flex flex-col gap-2.5">
          {ANALYSIS_CHECKS.map((check) => (
            <FindingRow
              key={check.label}
              status={check.status}
              label={check.label}
              note={check.note}
            />
          ))}
          {DAMAGE_POINTS.map((point) => (
            <FindingRow
              key={point.id}
              status={point.severity}
              label={point.label}
              note={point.detail}
            />
          ))}
        </ul>
      </Panel>
    </div>
  );
}
