import "server-only";

import { randomUUID } from "node:crypto";

import type { VehicleIntelligenceReport } from "../types";
import { synthesizeReport } from "../synthesis";
import { vinDecoder } from "./vin-decoder";

/**
 * Intelligence orchestrator.
 *
 * The single entry point for turning a VIN into a full report. It sequences the
 * pipeline — decode → synthesize → (LLM narrative) — behind one call so callers
 * (server actions, route handlers, jobs) stay ignorant of the internals.
 *
 * The deterministic scoring lives in `synthesis.ts`; this is where the LLM
 * narrative pass belongs. Keeping the composite score deterministic and the
 * *prose* AI-generated gives us an "AI-powered" product whose core judgment is
 * still explainable and reproducible.
 */
export async function generateIntelligenceReport(
  vin: string,
): Promise<VehicleIntelligenceReport> {
  const identity = await vinDecoder.decode(vin);
  const report = synthesizeReport(randomUUID(), identity);

  // ── LLM narrative pass (seam) ──────────────────────────────────────────────
  // const narrative = await narrateReport(report); // uses ANTHROPIC_API_KEY
  // return { ...report, verdict: { ...report.verdict, ...narrative } };

  return report;
}
