import type { DimensionKey } from "./types";

/**
 * Feature constants. The report's analytical dimensions and their relative
 * weights in the composite verdict score live here as data, so the scoring
 * model and the UI's section order are configured in one auditable place.
 */

interface DimensionMeta {
  key: DimensionKey;
  label: string;
  description: string;
  /** Contribution to the composite verdict score (weights sum to 1). */
  weight: number;
}

export const DIMENSIONS: readonly DimensionMeta[] = [
  {
    key: "history",
    label: "Title & History",
    description:
      "Accidents, title brands, odometer integrity, service records.",
    weight: 0.3,
  },
  {
    key: "risk",
    label: "Risk Assessment",
    description: "Recalls, theft records, liens, and structural concerns.",
    weight: 0.25,
  },
  {
    key: "valuation",
    label: "Valuation",
    description: "Fair market value against comparable listings and condition.",
    weight: 0.2,
  },
  {
    key: "market",
    label: "Market Position",
    description: "Demand, days-on-market, and price trajectory for this model.",
    weight: 0.15,
  },
  {
    key: "ownership",
    label: "Ownership & Usage",
    description: "Number of owners, usage type, and geographic history.",
    weight: 0.1,
  },
] as const;

/** Score thresholds that map a 0–100 score to a verdict status. */
export const VERDICT_THRESHOLDS = {
  clear: 75,
  caution: 50,
} as const;

/**
 * Score thresholds for the explicit buy / consider / avoid recommendation.
 * Intentionally stricter than the status bands: a "buy" is a higher bar than a
 * merely "clear" score.
 */
export const RECOMMENDATION_THRESHOLDS = {
  buy: 78,
  consider: 55,
} as const;

/**
 * Component catalog for the repair-prediction model. `baseCost` is the typical
 * parts-plus-labor figure (USD) the reference engine perturbs per vehicle.
 */
export const REPAIR_COMPONENTS = [
  { component: "12V / HV battery", baseCost: 320 },
  { component: "Brake pads & rotors", baseCost: 480 },
  { component: "Suspension bushings", baseCost: 620 },
  { component: "Alternator", baseCost: 540 },
  { component: "Water pump", baseCost: 460 },
  { component: "Transmission service", baseCost: 900 },
  { component: "A/C compressor", baseCost: 780 },
  { component: "Control arm", baseCost: 410 },
] as const;

/** Routine service catalog driving the maintenance estimate. */
export const MAINTENANCE_CATALOG = [
  {
    service: "Oil & filter change",
    intervalMonths: 6,
    intervalMiles: 7500,
    cost: 90,
  },
  {
    service: "Tire rotation",
    intervalMonths: 6,
    intervalMiles: 7500,
    cost: 40,
  },
  {
    service: "Cabin & engine air filters",
    intervalMonths: 12,
    intervalMiles: 15000,
    cost: 110,
  },
  {
    service: "Brake fluid flush",
    intervalMonths: 24,
    intervalMiles: 30000,
    cost: 130,
  },
  {
    service: "Coolant service",
    intervalMonths: 36,
    intervalMiles: 45000,
    cost: 180,
  },
  {
    service: "Spark plugs",
    intervalMonths: 48,
    intervalMiles: 60000,
    cost: 260,
  },
] as const;

/** Cost, in account credits, to generate one report. */
export const REPORT_CREDIT_COST = 1;
