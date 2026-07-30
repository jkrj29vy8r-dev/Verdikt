import type { Metadata } from "next";
import Link from "next/link";
import { Plus, FileText, ShieldCheck, Gauge } from "lucide-react";

import { requireUser } from "@/features/auth/server";
import { listReports } from "@/features/vehicle-intelligence/services/reports.repository";
import { ReportCard } from "@/features/vehicle-intelligence";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stagger, StaggerItem } from "@/components/motion";

export const metadata: Metadata = { title: "Dashboard" };

/**
 * Dashboard — the authenticated home. A Server Component: it awaits the user's
 * reports at request time (RLS-scoped), derives headline stats, and renders the
 * recent activity. No client data fetching, no loading spinner on first paint.
 */
export default async function DashboardPage() {
  const user = await requireUser();
  const result = await listReports(user.id);
  const reports = result.ok ? result.data : [];

  const scored = reports.filter((r) => r.score !== null);
  const avgScore = scored.length
    ? Math.round(
        scored.reduce((sum, r) => sum + (r.score ?? 0), 0) / scored.length,
      )
    : null;
  const clearCount = reports.filter((r) => r.status === "clear").length;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Dashboard"
        description="Your vehicle intelligence at a glance."
        actions={
          <Button variant="signature" asChild>
            <Link href="/decode">
              <Plus className="size-4" />
              New verdict
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={FileText} label="Verdicts run" value={reports.length} />
        <Stat
          icon={Gauge}
          label="Average score"
          value={avgScore !== null ? `${avgScore}` : "—"}
        />
        <Stat icon={ShieldCheck} label="Cleared" value={clearCount} />
      </div>

      <h2 className="mt-10 mb-4 text-lg font-semibold">Recent verdicts</h2>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-muted-foreground">
              You haven&apos;t run a verdict yet.
            </p>
            <Button variant="signature" asChild>
              <Link href="/decode">
                <Plus className="size-4" />
                Run your first verdict
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Stagger className="grid gap-3">
          {reports.slice(0, 6).map((report) => (
            <StaggerItem key={report.id}>
              <ReportCard report={report} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 py-5">
        <div className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="tabular text-2xl font-semibold tracking-tight">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
