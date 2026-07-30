import type { Metadata } from "next";

import { requireUser } from "@/features/auth/server";
import { listReports } from "@/features/vehicle-intelligence/services/reports.repository";
import {
  buildDashboardModel,
  SAMPLE_DASHBOARD,
} from "@/features/vehicle-intelligence/dashboard";
import { CommandCenter } from "@/features/vehicle-intelligence/components/dashboard";

export const metadata: Metadata = { title: "Dashboard" };

/**
 * Dashboard — the authenticated home, rendered as a futuristic command center.
 *
 * A Server Component: it awaits the user's reports at request time (RLS-scoped),
 * derives the dashboard model, and hands it to the command center as plain data.
 * Until the account has at least one scored verdict, a labeled sample fleet
 * stands in so the command center demonstrates its full self on first visit.
 */
export default async function DashboardPage() {
  const user = await requireUser();
  const result = await listReports(user.id);
  const reports = result.ok ? result.data : [];
  const hasScored = reports.some((r) => r.score !== null);

  const model = hasScored ? buildDashboardModel(reports) : SAMPLE_DASHBOARD;

  return <CommandCenter model={model} />;
}
