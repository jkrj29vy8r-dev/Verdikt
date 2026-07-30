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

/** Cost, in account credits, to generate one report. */
export const REPORT_CREDIT_COST = 1;
