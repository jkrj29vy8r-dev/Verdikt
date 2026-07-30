import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatRelativeTime, formatVin } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { VerdictScore } from "@/components/shared/verdict-score";

import type { ReportSummary } from "../types";

/**
 * ReportCard — a saved report as a compact, linkable row. Used by the dashboard
 * and reports list. Gracefully handles in-flight reports that have no score yet.
 */
export function ReportCard({
  report,
  className,
}: {
  report: ReportSummary;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "group py-0 transition-colors hover:border-ring/40",
        className,
      )}
    >
      <Link
        href={`/reports/${report.id}`}
        className="flex items-center gap-4 rounded-xl p-4 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {report.score !== null && report.status !== null ? (
          <VerdictScore
            score={report.score}
            status={report.status}
            size="sm"
            hideLabel
          />
        ) : (
          <div className="grid size-[72px] place-items-center rounded-full bg-muted text-xs text-muted-foreground">
            {report.reportStatus}
          </div>
        )}

        <CardContent className="flex-1 px-0">
          <p className="font-medium">{report.title}</p>
          <p className="tabular text-xs tracking-wider text-muted-foreground">
            {formatVin(report.vin)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatRelativeTime(report.createdAt)}
          </p>
        </CardContent>

        <ChevronRight className="size-5 text-muted-foreground transition-colors group-hover:text-foreground" />
      </Link>
    </Card>
  );
}
