import type { Enums, Tables } from "@/lib/supabase/database.types";

/**
 * Vehicle-intelligence domain model.
 *
 * The vocabulary of the feature. Enum-like types are derived from the database
 * types so the app layer and the schema can never drift. The rich report shape
 * (`VehicleIntelligenceReport`) is what we persist in the `payload` JSON column
 * and hydrate on read.
 */

/** Canonical verdict states — sourced from the DB enum. */
export type VerdictStatus = Enums<"verdict_status">;

/** Lifecycle of an intelligence request. */
export type ReportStatus = Enums<"report_status">;

/** The decoded, canonical identity of a vehicle. */
export interface VehicleIdentity {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  bodyStyle?: string;
  engine?: string;
  drivetrain?: string;
}

/** Estimated market value with a confidence band. */
export interface VehicleValuation {
  estimate: number;
  low: number;
  high: number;
  currency: "USD";
}

/** One scored analytical dimension of the report (history, risk, market…). */
export interface IntelligenceDimension {
  key: DimensionKey;
  label: string;
  score: number;
  status: VerdictStatus;
  summary: string;
  /** Salient findings surfaced to the user as bullets. */
  signals: string[];
}

export type DimensionKey =
  "history" | "valuation" | "risk" | "market" | "ownership";

/** The synthesized top-line judgment — the "verdict". */
export interface VehicleVerdict {
  score: number;
  status: VerdictStatus;
  headline: string;
  summary: string;
}

/** The complete intelligence report. Serialized into `vehicle_reports.payload`. */
export interface VehicleIntelligenceReport {
  id: string;
  identity: VehicleIdentity;
  verdict: VehicleVerdict;
  valuation: VehicleValuation;
  dimensions: IntelligenceDimension[];
  generatedAt: string;
}

/** Lightweight row shape for list/grid surfaces. */
export interface ReportSummary {
  id: string;
  vin: string;
  title: string;
  score: number | null;
  status: VerdictStatus | null;
  reportStatus: ReportStatus;
  createdAt: string;
}

/** Maps a persisted DB row to the lightweight summary used in list views. */
export function toReportSummary(row: Tables<"vehicle_reports">): ReportSummary {
  const title = [row.year, row.make, row.model, row.trim]
    .filter(Boolean)
    .join(" ");
  return {
    id: row.id,
    vin: row.vin,
    title: title || row.vin,
    score: row.verdict_score,
    status: row.verdict_status,
    reportStatus: row.status,
    createdAt: row.created_at,
  };
}
