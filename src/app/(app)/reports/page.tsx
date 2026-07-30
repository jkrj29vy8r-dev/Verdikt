import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { requireUser } from "@/features/auth/server";
import { listReports } from "@/features/vehicle-intelligence/services/reports.repository";
import { ReportCard } from "@/features/vehicle-intelligence";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stagger, StaggerItem } from "@/components/motion";

export const metadata: Metadata = { title: "Reports" };

/** Reports — the full, RLS-scoped list of a user's saved verdicts. */
export default async function ReportsPage() {
  const user = await requireUser();
  const result = await listReports(user.id);
  const reports = result.ok ? result.data : [];

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Reports"
        description={`${reports.length} saved ${
          reports.length === 1 ? "verdict" : "verdicts"
        }.`}
        actions={
          <Button variant="signature" asChild>
            <Link href="/decode">
              <Plus className="size-4" />
              New verdict
            </Link>
          </Button>
        }
      />

      {reports.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            No reports yet. Run your first verdict to see it here.
          </CardContent>
        </Card>
      ) : (
        <Stagger className="grid gap-3">
          {reports.map((report) => (
            <StaggerItem key={report.id}>
              <ReportCard report={report} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
