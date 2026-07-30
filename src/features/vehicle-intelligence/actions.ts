"use server";

import { revalidatePath } from "next/cache";

import { err, ok, type Result } from "@/types/common";
import { requireUser } from "@/features/auth/server";

import type { ReportSummary, VehicleIntelligenceReport } from "./types";
import { decodeRequestSchema } from "./schema";
import { generateIntelligenceReport } from "./services/intelligence";
import { deleteReport, saveReport } from "./services/reports.repository";

/**
 * Server Actions — the feature's write API, callable directly from components.
 *
 * Every action follows the same spine: authenticate → validate at the trust
 * boundary → do work → revalidate affected caches → return a typed `Result`.
 * We return Results rather than throwing so client components can render field
 * errors instead of hitting an error boundary.
 */

export interface RunVerdictResult {
  report: VehicleIntelligenceReport;
  summary: ReportSummary | null;
}

/**
 * Decode a VIN, synthesize the verdict, and (optionally) persist it.
 *
 * Auth is required only to *save*: this lets the public landing page offer a
 * genuine "try it live, no signup" verdict while keeping writes behind auth.
 */
export async function runVerdict(
  input: unknown,
): Promise<Result<RunVerdictResult, string>> {
  const parsed = decodeRequestSchema.safeParse(input);
  if (!parsed.success) {
    return err(parsed.error.issues[0]?.message ?? "Please enter a valid VIN.");
  }

  try {
    const report = await generateIntelligenceReport(parsed.data.vin);

    let summary: ReportSummary | null = null;
    if (parsed.data.save) {
      const user = await requireUser();
      const saved = await saveReport(user.id, report);
      if (!saved.ok) return err(saved.error.message);
      summary = saved.data;
      revalidatePath("/reports");
      revalidatePath("/dashboard");
    }

    return ok({ report, summary });
  } catch (error) {
    return err(
      error instanceof Error
        ? error.message
        : "We couldn't generate that verdict. Please try again.",
    );
  }
}

/** Remove a saved report. */
export async function removeReport(id: string): Promise<Result<true, string>> {
  await requireUser();

  const result = await deleteReport(id);
  if (!result.ok) return err(result.error.message);

  revalidatePath("/reports");
  revalidatePath("/dashboard");
  return ok(true);
}
