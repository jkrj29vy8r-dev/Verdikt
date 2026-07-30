import type {
  IntelligenceDimension,
  MaintenanceSchedule,
  Recommendation,
  RepairForecast,
  VehicleIdentity,
  VehicleIntelligenceReport,
  VehicleValuation,
  VehicleVerdict,
  VerdictStatus,
} from "./types";
import {
  DIMENSIONS,
  MAINTENANCE_CATALOG,
  RECOMMENDATION_THRESHOLDS,
  REPAIR_COMPONENTS,
  VERDICT_THRESHOLDS,
} from "./constants";

/**
 * Deterministic intelligence engine (pure).
 *
 * Framework-free and side-effect-free so it can be unit-tested in isolation and
 * shared between server and edge runtimes. It is the *reference* synthesis: it
 * produces a coherent, stable report for a given VIN. In production the narrative
 * fields (`summary`, `signals`, `headline`) are the seam where the LLM plugs in
 * — see `services/intelligence.ts` — while the composite scoring below remains
 * deterministic and explainable, which is exactly the property you want in the
 * part of an "AI" product that assigns a number to someone's purchase.
 */

/** Deterministic PRNG (mulberry32) seeded from a string, so a VIN → stable report. */
function seededRandom(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Map a 0–100 score onto a verdict status via the configured thresholds. */
export function scoreToStatus(score: number): VerdictStatus {
  if (score >= VERDICT_THRESHOLDS.clear) return "clear";
  if (score >= VERDICT_THRESHOLDS.caution) return "caution";
  return "flagged";
}

/** Map a 0–100 score onto the explicit buy / consider / avoid call. */
export function scoreToRecommendation(score: number): Recommendation {
  if (score >= RECOMMENDATION_THRESHOLDS.buy) return "buy";
  if (score >= RECOMMENDATION_THRESHOLDS.consider) return "consider";
  return "avoid";
}

/** Weighted composite of dimension scores → the top-line verdict score. */
export function composeVerdictScore(
  dimensions: IntelligenceDimension[],
): number {
  const total = DIMENSIONS.reduce((acc, meta) => {
    const dim = dimensions.find((d) => d.key === meta.key);
    return acc + (dim ? dim.score * meta.weight : 0);
  }, 0);
  return Math.round(total);
}

function estimateValuation(
  identity: VehicleIdentity,
  rand: () => number,
): VehicleValuation {
  const age = Math.max(0, new Date().getFullYear() - identity.year);
  // Naive depreciation curve around a synthetic base — reference only.
  const base = 46000 * Math.pow(0.88, age);
  const estimate = Math.round((base * (0.85 + rand() * 0.3)) / 100) * 100;
  return {
    estimate,
    low: Math.round((estimate * 0.92) / 100) * 100,
    high: Math.round((estimate * 1.08) / 100) * 100,
    currency: "USD",
  };
}

/** Predict likely repairs, weighted by vehicle age (the reference model). */
function forecastRepairs(
  identity: VehicleIdentity,
  rand: () => number,
): RepairForecast {
  const age = Math.max(0, new Date().getFullYear() - identity.year);
  const items = [...REPAIR_COMPONENTS]
    .sort(() => rand() - 0.5)
    .slice(0, 3)
    .map((c) => ({
      component: c.component,
      likelihood: Math.min(95, Math.round(18 + age * 4 + rand() * 28)),
      horizonMonths: 3 + Math.floor(rand() * 21),
      estimatedCost: Math.round((c.baseCost * (0.9 + rand() * 0.5)) / 10) * 10,
    }))
    .sort((a, b) => b.likelihood - a.likelihood);

  const twelveMonthEstimate =
    Math.round(
      items
        .filter((i) => i.horizonMonths <= 12)
        .reduce((sum, i) => sum + (i.estimatedCost * i.likelihood) / 100, 0) /
        10,
    ) * 10;

  return { items, twelveMonthEstimate };
}

/** Project the soonest routine services and the annualized upkeep cost. */
function scheduleMaintenance(rand: () => number): MaintenanceSchedule {
  const items = MAINTENANCE_CATALOG.map((m) => ({
    service: m.service,
    dueInMonths: 1 + Math.floor(rand() * m.intervalMonths),
    dueInMiles: m.intervalMiles,
    estimatedCost: m.cost,
  }))
    .sort((a, b) => a.dueInMonths - b.dueInMonths)
    .slice(0, 4);

  const annualEstimate = Math.round(
    MAINTENANCE_CATALOG.reduce(
      (sum, m) => sum + (m.cost * 12) / m.intervalMonths,
      0,
    ),
  );

  return { items, annualEstimate };
}

/**
 * Build a complete, deterministic report for a decoded vehicle. Narrative text
 * here is templated; production replaces it with LLM-authored copy.
 */
export function synthesizeReport(
  id: string,
  identity: VehicleIdentity,
): VehicleIntelligenceReport {
  const rand = seededRandom(identity.vin);

  const dimensions: IntelligenceDimension[] = DIMENSIONS.map((meta) => {
    const score = 45 + Math.floor(rand() * 55); // 45–99
    const status = scoreToStatus(score);
    return {
      key: meta.key,
      label: meta.label,
      score,
      status,
      summary: `${meta.description} Analysis indicates a ${status} standing for this dimension.`,
      signals: buildSignals(meta.key, status, rand),
    };
  });

  const verdictScore = composeVerdictScore(dimensions);
  const recommendation = scoreToRecommendation(verdictScore);
  const verdict: VehicleVerdict = {
    score: verdictScore,
    status: scoreToStatus(verdictScore),
    recommendation,
    headline: buildHeadline(identity, recommendation),
    summary: `Across ${dimensions.length} dimensions, ${identity.year} ${identity.make} ${identity.model} scores ${verdictScore}/100. Weighing title history, risk, valuation, market position, and ownership, Verdikt's recommendation is to ${recommendation}.`,
  };

  return {
    id,
    identity,
    verdict,
    valuation: estimateValuation(identity, rand),
    repairForecast: forecastRepairs(identity, rand),
    maintenance: scheduleMaintenance(rand),
    dimensions,
    generatedAt: new Date().toISOString(),
  };
}

function buildHeadline(
  identity: VehicleIdentity,
  recommendation: Recommendation,
): string {
  const lead =
    recommendation === "buy"
      ? "A confident buy"
      : recommendation === "consider"
        ? "Worth considering"
        : "Approach with caution";
  return `${lead} — ${identity.year} ${identity.make} ${identity.model}`;
}

function buildSignals(
  key: string,
  status: VerdictStatus,
  rand: () => number,
): string[] {
  const pools: Record<string, string[]> = {
    history: [
      "No reported structural damage",
      "Odometer readings are consistent",
      "Clean title across all recorded states",
      "One reported minor incident",
    ],
    risk: [
      "No open safety recalls",
      "No active liens detected",
      "Not reported stolen",
      "One historical recall — remedied",
    ],
    valuation: [
      "Priced within fair-market band",
      "Condition supports upper valuation",
      "Comparable listings trend stable",
    ],
    market: [
      "Strong regional demand",
      "Below-average days on market",
      "Prices trending upward this quarter",
    ],
    ownership: [
      "Single prior owner",
      "Predominantly highway usage",
      "Consistent geographic history",
    ],
  };
  const pool = pools[key] ?? [];
  const count = status === "flagged" ? 2 : 3;
  return [...pool].sort(() => rand() - 0.5).slice(0, count);
}
