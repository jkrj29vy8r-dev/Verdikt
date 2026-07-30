import type {
  ConfidenceLevel,
  IntelligenceDimension,
  MaintenanceSchedule,
  Recommendation,
  RepairForecast,
  VehicleIdentity,
  VehicleIntelligenceReport,
  VehicleValuation,
  VehicleVerdict,
  VerdictConfidence,
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
export function seededRandom(seed: string): () => number {
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
      summary: interpretDimension(meta.label, score, status),
      signals: buildSignals(meta.key, status, rand),
    };
  });

  const verdictScore = composeVerdictScore(dimensions);
  const recommendation = scoreToRecommendation(verdictScore);
  const valuation = estimateValuation(identity, rand);
  const repairForecast = forecastRepairs(identity, rand);
  const maintenance = scheduleMaintenance(rand);
  const confidence = deriveConfidence(identity, verdictScore, rand);

  const verdict: VehicleVerdict = {
    score: verdictScore,
    status: scoreToStatus(verdictScore),
    recommendation,
    headline: buildHeadline(identity, recommendation),
    summary: buildVerdictSummary({
      identity,
      verdictScore,
      recommendation,
      dimensions,
      repairForecast,
      maintenance,
      confidence,
    }),
    confidence,
  };

  return {
    id,
    identity,
    verdict,
    valuation,
    repairForecast,
    maintenance,
    dimensions,
    generatedAt: new Date().toISOString(),
  };
}

/** Compact USD, no cents — for budget framing inside prose. */
function usd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

/** Interpret a dimension's score in an inspector's voice — what it means for the
 * buyer, not a restatement of the dimension's definition. */
function interpretDimension(
  label: string,
  score: number,
  status: VerdictStatus,
): string {
  const read =
    status === "clear"
      ? "nothing here gives me pause"
      : status === "caution"
        ? "a few things I'd want to confirm before signing"
        : "this is where I'd slow the deal down";
  return `${label} scores ${score}/100 — ${read}.`;
}

/**
 * Gauge how firmly the records back the verdict. Borderline scores and thin
 * identity data lower confidence, so an uncertain call is never dressed up as a
 * certain one. Seeded, so a given VIN always reads the same.
 */
function deriveConfidence(
  identity: VehicleIdentity,
  verdictScore: number,
  rand: () => number,
): VerdictConfidence {
  const borderline = [
    VERDICT_THRESHOLDS.clear,
    VERDICT_THRESHOLDS.caution,
  ].some((t) => Math.abs(verdictScore - t) <= 3);
  const completeness = [
    identity.trim,
    identity.engine,
    identity.drivetrain,
  ].filter(Boolean).length;
  const depth = rand();

  let level: ConfidenceLevel;
  if (borderline || (completeness <= 1 && depth < 0.4)) level = "limited";
  else if (completeness >= 3 && depth > 0.55) level = "high";
  else level = "moderate";

  const note =
    level === "high"
      ? "Corroborated across multiple independent records — this reads as a firm call."
      : level === "moderate"
        ? "Backed by a solid record set, though a few data points are lighter than I'd like."
        : borderline
          ? "This one sits right on the line between bands; small new facts could move the verdict, so weigh it carefully."
          : "The available history is thin in places — treat this as a starting read and verify the gaps in person.";

  return { level, note };
}

/**
 * The interpretive, inspector-voiced verdict paragraph the deterministic engine
 * produces. It is also the fallback whenever the live Verdikt AI pass is
 * unavailable, so the product reads the same with or without a model.
 */
function buildVerdictSummary(input: {
  identity: VehicleIdentity;
  verdictScore: number;
  recommendation: Recommendation;
  dimensions: IntelligenceDimension[];
  repairForecast: RepairForecast;
  maintenance: MaintenanceSchedule;
  confidence: VerdictConfidence;
}): string {
  const {
    identity,
    verdictScore,
    recommendation,
    dimensions,
    repairForecast,
    maintenance,
    confidence,
  } = input;

  const ranked = [...dimensions].sort((a, b) => b.score - a.score);
  const strongest = ranked[0];
  const weakest = ranked[ranked.length - 1];

  const lead =
    recommendation === "buy"
      ? "This is a car I'd buy."
      : recommendation === "consider"
        ? "Worth considering, with your eyes open."
        : "I'd walk away from this one.";

  const focus =
    strongest && weakest && strongest.key !== weakest.key
      ? ` Its strongest ground is ${strongest.label.toLowerCase()}; ${weakest.label.toLowerCase()} is where I'd focus a pre-purchase inspection.`
      : "";

  const budget =
    repairForecast.twelveMonthEstimate > 0
      ? `Budget roughly ${usd(maintenance.annualEstimate)} a year in upkeep and about ${usd(repairForecast.twelveMonthEstimate)} in likely repairs over the first year.`
      : `Budget roughly ${usd(maintenance.annualEstimate)} a year in upkeep; nothing major is flagged to fail in the first year.`;

  return `${lead} The ${identity.year} ${identity.make} ${identity.model} scores ${verdictScore}/100 overall.${focus} ${budget} ${confidence.note}`;
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
