import type { ReportSummary, Recommendation, VerdictStatus } from "./types";
import { DIMENSIONS } from "./constants";
import {
  scoreToRecommendation,
  scoreToStatus,
  seededRandom,
} from "./synthesis";

/**
 * Dashboard model — the shape the command center renders, and the pure builders
 * that produce it.
 *
 * The page (a Server Component) turns the user's RLS-scoped report summaries
 * into a `DashboardModel` and hands it to the widgets as plain, serializable
 * data — so all the client islands (counters, charts, live feed) stay
 * presentational. When an account has no scored reports yet, `SAMPLE_DASHBOARD`
 * stands in so the command center is never a dead, empty screen; it is flagged
 * `isSample` so the UI can label it a preview.
 */

export interface DashboardStats {
  verdictsRun: number;
  avgScore: number;
  clearedCount: number;
  /** Verdicts needing attention (caution + flagged). */
  attentionCount: number;
}

export interface StatusDistribution {
  clear: number;
  caution: number;
  flagged: number;
}

/** A vehicle in the interactive fleet dial. */
export interface FleetVehicle {
  id: string;
  title: string;
  vin: string;
  score: number;
  status: VerdictStatus;
}

/** One recent activity entry on the fleet timeline. */
export interface FleetActivity {
  id: string;
  title: string;
  vin: string;
  score: number | null;
  status: VerdictStatus | null;
  createdAt: string;
}

export interface HealthDimension {
  key: string;
  label: string;
  score: number;
  status: VerdictStatus;
}

/** The spotlighted vehicle whose health is broken out. */
export interface FeaturedVehicle {
  id: string;
  title: string;
  vin: string;
  score: number;
  status: VerdictStatus;
  recommendation: Recommendation;
  health: HealthDimension[];
}

export interface DashboardModel {
  isSample: boolean;
  stats: DashboardStats;
  distribution: StatusDistribution;
  /** Verdict scores in chronological order (oldest → newest), for the trend. */
  trend: number[];
  timeline: FleetActivity[];
  fleet: FleetVehicle[];
  featured: FeaturedVehicle;
  /** Rotating AI insight lines for the live feed. */
  insights: string[];
}

/**
 * Break an overall score into five plausible, stable dimension scores. Seeded
 * by VIN so the same vehicle always reads the same, and centered on the overall
 * so the parts agree with the whole.
 */
function deriveHealth(vin: string, overall: number): HealthDimension[] {
  const rand = seededRandom(`${vin}:health`);
  return DIMENSIONS.map((meta) => {
    const offset = Math.round((rand() - 0.5) * 26); // ±13
    const score = Math.max(8, Math.min(99, overall + offset));
    return {
      key: meta.key,
      label: meta.label,
      score,
      status: scoreToStatus(score),
    };
  });
}

/** Build the live dashboard model from a user's report summaries. Assumes at
 * least one scored report exists (the page falls back to the sample otherwise). */
export function buildDashboardModel(reports: ReportSummary[]): DashboardModel {
  const scored = reports.filter(
    (r): r is ReportSummary & { score: number; status: VerdictStatus } =>
      r.score !== null && r.status !== null,
  );

  const avgScore = Math.round(
    scored.reduce((sum, r) => sum + r.score, 0) / scored.length,
  );
  const clearedCount = scored.filter((r) => r.status === "clear").length;
  const distribution: StatusDistribution = {
    clear: clearedCount,
    caution: scored.filter((r) => r.status === "caution").length,
    flagged: scored.filter((r) => r.status === "flagged").length,
  };

  // Chronological trend (repository returns newest-first).
  const trend = [...scored]
    .reverse()
    .map((r) => r.score)
    .slice(-12);

  const timeline: FleetActivity[] = reports.slice(0, 6).map((r) => ({
    id: r.id,
    title: r.title,
    vin: r.vin,
    score: r.score,
    status: r.status,
    createdAt: r.createdAt,
  }));

  const fleet: FleetVehicle[] = scored.slice(0, 6).map((r) => ({
    id: r.id,
    title: r.title,
    vin: r.vin,
    score: r.score,
    status: r.status,
  }));

  const top = scored[0]!; // newest scored → the spotlight
  const featured: FeaturedVehicle = {
    id: top.id,
    title: top.title,
    vin: top.vin,
    score: top.score,
    status: top.status,
    recommendation: scoreToRecommendation(top.score),
    health: deriveHealth(top.vin, top.score),
  };

  return {
    isSample: false,
    stats: {
      verdictsRun: reports.length,
      avgScore,
      clearedCount,
      attentionCount: distribution.caution + distribution.flagged,
    },
    distribution,
    trend,
    timeline,
    fleet,
    featured,
    insights: buildInsights(avgScore, distribution, featured),
  };
}

/** Compose a few data-aware insight lines for the live AI feed. */
function buildInsights(
  avgScore: number,
  dist: StatusDistribution,
  featured: FeaturedVehicle,
): string[] {
  const lines = [
    `Fleet confidence holding at ${avgScore}/100.`,
    `${dist.clear} vehicle${dist.clear === 1 ? "" : "s"} cleared for purchase.`,
    `Spotlight: ${featured.title} scores ${featured.score} — ${featured.recommendation}.`,
  ];
  if (dist.flagged > 0) {
    lines.push(
      `${dist.flagged} flagged — review title and structural history.`,
    );
  } else {
    lines.push("No flagged vehicles in the current set.");
  }
  return lines;
}

/**
 * A plausible sample fleet shown before a user's own data exists — so the
 * command center demonstrates its full self on first visit. Real-looking VINs,
 * makes, scores, and dates (never lorem), per the dashboard references.
 */
export const SAMPLE_DASHBOARD: DashboardModel = {
  isSample: true,
  stats: { verdictsRun: 24, avgScore: 78, clearedCount: 16, attentionCount: 8 },
  distribution: { clear: 16, caution: 6, flagged: 2 },
  trend: [61, 64, 63, 69, 72, 70, 74, 77, 76, 80, 79, 83],
  fleet: [
    {
      id: "s1",
      title: "2021 Tesla Model 3",
      vin: "5YJ3E1EA7MF000337",
      score: 88,
      status: "clear",
    },
    {
      id: "s2",
      title: "2019 BMW 340i",
      vin: "WBA8B3C5XKA000221",
      score: 81,
      status: "clear",
    },
    {
      id: "s3",
      title: "2020 Audi Q5",
      vin: "WA1BNAFY7L2000144",
      score: 74,
      status: "caution",
    },
    {
      id: "s4",
      title: "2018 Toyota Camry",
      vin: "4T1B11HK9JU000982",
      score: 69,
      status: "caution",
    },
    {
      id: "s5",
      title: "2017 Ford F-150",
      vin: "1FTEW1EG9HF000456",
      score: 47,
      status: "flagged",
    },
    {
      id: "s6",
      title: "2022 Honda Civic",
      vin: "2HGFE2F5XNH000771",
      score: 84,
      status: "clear",
    },
  ],
  timeline: [
    {
      id: "s1",
      title: "2021 Tesla Model 3",
      vin: "5YJ3E1EA7MF000337",
      score: 88,
      status: "clear",
      createdAt: daysAgo(0),
    },
    {
      id: "s6",
      title: "2022 Honda Civic",
      vin: "2HGFE2F5XNH000771",
      score: 84,
      status: "clear",
      createdAt: daysAgo(1),
    },
    {
      id: "s3",
      title: "2020 Audi Q5",
      vin: "WA1BNAFY7L2000144",
      score: 74,
      status: "caution",
      createdAt: daysAgo(2),
    },
    {
      id: "s5",
      title: "2017 Ford F-150",
      vin: "1FTEW1EG9HF000456",
      score: 47,
      status: "flagged",
      createdAt: daysAgo(4),
    },
    {
      id: "s2",
      title: "2019 BMW 340i",
      vin: "WBA8B3C5XKA000221",
      score: 81,
      status: "clear",
      createdAt: daysAgo(5),
    },
    {
      id: "s4",
      title: "2018 Toyota Camry",
      vin: "4T1B11HK9JU000982",
      score: 69,
      status: "caution",
      createdAt: daysAgo(6),
    },
  ],
  featured: {
    id: "s1",
    title: "2021 Tesla Model 3",
    vin: "5YJ3E1EA7MF000337",
    score: 88,
    status: "clear",
    recommendation: "buy",
    health: deriveHealth("5YJ3E1EA7MF000337", 88),
  },
  insights: [
    "Fleet confidence trending up — +7 over the last cycle.",
    "16 vehicles cleared for purchase.",
    "Spotlight: 2021 Tesla Model 3 scores 88 — buy.",
    "2 flagged — review title and structural history.",
  ],
};

/** ISO timestamp for N days before now — keeps the sample timeline relative. */
function daysAgo(n: number): string {
  return new Date(Date.now() - n * 86_400_000).toISOString();
}
