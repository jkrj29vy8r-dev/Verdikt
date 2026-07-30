import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { requireUser } from "@/features/auth/server";
import { getReport } from "@/features/vehicle-intelligence/services/reports.repository";
import { VerdictReport } from "@/features/vehicle-intelligence";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Report" };

/**
 * Report detail. Awaits the full report (RLS ensures ownership — a non-owned or
 * missing id resolves to null → 404). Rendered with the same VerdictReport used
 * on the decode surface, so the report looks identical everywhere.
 */
export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;

  const result = await getReport(id);
  if (!result.ok || !result.data) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
        <Link href="/reports">
          <ArrowLeft className="size-4" />
          Back to reports
        </Link>
      </Button>
      <VerdictReport report={result.data} />
    </div>
  );
}
