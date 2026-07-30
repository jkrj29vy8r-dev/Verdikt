import "server-only";

import { randomUUID } from "node:crypto";

import type { VehicleIntelligenceReport } from "../types";
import { synthesizeReport } from "../synthesis";
import { vinDecoder } from "./vin-decoder";
import { narrateReport, type ReportNarrative } from "./verdikt-ai";

/**
 * Intelligence orchestrator.
 *
 * The single entry point for turning a VIN into a full report. It sequences the
 * pipeline — decode → synthesize → narrate — behind one call so callers (server
 * actions, route handlers, jobs) stay ignorant of the internals.
 *
 * The deterministic scoring lives in `synthesis.ts`; the *prose* is authored by
 * Verdikt AI (`verdikt-ai.ts`). Keeping the composite score deterministic and
 * the narrative AI-authored gives us an "AI-powered" product whose core
 * judgment is still explainable and reproducible. When no model is configured
 * (e.g. the public "try it live" flow without a key) the narrate pass returns
 * null and the deterministic inspector narrative — written in the same voice —
 * stands in, so a verdict is always produced.
 */
export async function generateIntelligenceReport(
  vin: string,
): Promise<VehicleIntelligenceReport> {
  const identity = await vinDecoder.decode(vin);
  const report = synthesizeReport(randomUUID(), identity);
  const narrative = await narrateReport(report);
  return applyNarrative(report, narrative);
}

/** Merge Verdikt AI's interpretation over the deterministic report. A `null`
 * narrative (no model, failure, or refusal) leaves the report untouched — its
 * deterministic narrative already speaks in the Verdikt AI voice. */
function applyNarrative(
  report: VehicleIntelligenceReport,
  narrative: ReportNarrative | null,
): VehicleIntelligenceReport {
  if (!narrative) return report;

  return {
    ...report,
    verdict: {
      ...report.verdict,
      headline: narrative.headline,
      summary: narrative.summary,
      confidence: {
        level: report.verdict.confidence?.level ?? "moderate",
        note: narrative.confidenceNote,
      },
    },
    dimensions: report.dimensions.map((dimension) => {
      const authored = narrative.dimensions.find(
        (d) => d.key === dimension.key,
      );
      return authored ? { ...dimension, summary: authored.summary } : dimension;
    }),
  };
}
