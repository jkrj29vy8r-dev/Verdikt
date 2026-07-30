import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Json, TablesInsert } from "@/lib/supabase/database.types";
import { err, ok, type Result } from "@/types/common";

import type { ReportSummary, VehicleIntelligenceReport } from "../types";
import { toReportSummary } from "../types";

/**
 * Reports repository — the ONLY place that talks to the `vehicle_reports` table.
 *
 * Centralizing persistence keeps SQL/PostgREST concerns out of feature logic and
 * gives us one spot to reason about the read/write shape. Authorization is
 * enforced in the database via Row Level Security, so these queries are scoped
 * to the caller automatically; we still pass `userId` for the write columns.
 *
 * Denormalization strategy: the rich report is stored whole in `payload`, while
 * a few hot fields (vin, make/model/year, verdict score/status) are lifted into
 * columns so list views and filters never deserialize JSON.
 */

/** Persist a freshly generated report for a user. */
export async function saveReport(
  userId: string,
  report: VehicleIntelligenceReport,
): Promise<Result<ReportSummary>> {
  const supabase = await createClient();

  const row: TablesInsert<"vehicle_reports"> = {
    user_id: userId,
    vin: report.identity.vin,
    year: report.identity.year,
    make: report.identity.make,
    model: report.identity.model,
    trim: report.identity.trim ?? null,
    verdict_score: report.verdict.score,
    verdict_status: report.verdict.status,
    summary: report.verdict.summary,
    payload: report as unknown as Json,
    status: "complete",
  };

  const { data, error } = await supabase
    .from("vehicle_reports")
    .insert(row)
    .select()
    .single();

  if (error) return err(new Error(error.message));
  return ok(toReportSummary(data));
}

/** List a user's reports, newest first, as lightweight summaries. */
export async function listReports(
  userId: string,
): Promise<Result<ReportSummary[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicle_reports")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return err(new Error(error.message));
  return ok(data.map(toReportSummary));
}

/** Fetch and hydrate a single full report by id. */
export async function getReport(
  id: string,
): Promise<Result<VehicleIntelligenceReport | null>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicle_reports")
    .select("payload")
    .eq("id", id)
    .maybeSingle();

  if (error) return err(new Error(error.message));
  if (!data) return ok(null);
  return ok(data.payload as unknown as VehicleIntelligenceReport);
}

/** Delete a report. RLS ensures only the owner can. */
export async function deleteReport(id: string): Promise<Result<true>> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("vehicle_reports")
    .delete()
    .eq("id", id);

  if (error) return err(new Error(error.message));
  return ok(true);
}
