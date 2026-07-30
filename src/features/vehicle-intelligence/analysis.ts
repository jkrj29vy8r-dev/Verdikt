import type { Recommendation, VehicleIdentity, VerdictStatus } from "./types";

/**
 * Interactive analysis experience — configuration as data.
 *
 * The landing page's signature "Analyze" demo (a 3D vehicle that gets scanned,
 * x-rayed, and resolved to a verdict) is driven entirely by the typed constants
 * here: the phase timings, the 3D anchor points for the powertrain and damage
 * markers, and the plausible demo verdict shown in the holographic HUD. Keeping
 * it as data means the choreography and the story are tuned in one auditable
 * place, never hardcoded across the scene and the overlay.
 *
 * The vehicle and its "findings" are an illustrative sample — not a real scan —
 * so the VIN is an obvious in-house placeholder (`VDKT…`).
 */

/** The four beats of the analysis cinematic. */
export type AnalysisPhase = "idle" | "scanning" | "revealing" | "complete";

/**
 * Durations (ms) the sequence dwells in each transient phase before advancing.
 * `complete` is terminal (holds until reset). Honored only for full motion;
 * under reduced-motion the sequence jumps straight to `complete`.
 */
export const ANALYSIS_TIMINGS = {
  scanning: 2000,
  revealing: 900,
} as const;

/** A 3D point in body-local space (the shared vehicle-geometry frame). */
export type BodyAnchor = readonly [number, number, number];

/**
 * The internal powertrain "core" revealed once the body turns transparent.
 * `position` anchors it inside the body (front-of-cabin, on the vehicle's
 * centerline); the metrics populate the holographic powertrain panel.
 */
export const POWERTRAIN = {
  label: "Powertrain core",
  title: "Dual-motor AWD",
  position: [0.55, 0.02, 0] as BodyAnchor,
  health: "clear" as VerdictStatus,
  metrics: [
    { label: "Output", value: "455 hp" },
    { label: "Battery health", value: "96%" },
    { label: "Fault codes", value: "None" },
    { label: "Est. range", value: "302 mi" },
  ],
} as const;

/** A flagged region on the body, anchored in body-local space. */
export interface DamagePoint {
  id: string;
  label: string;
  detail: string;
  severity: Extract<VerdictStatus, "caution" | "flagged">;
  /** Body-local anchor, kept on the camera-facing (+z) flank so the marker
   * reads at the held 3/4 angle. */
  position: BodyAnchor;
}

/**
 * The scan's flagged findings. Deliberately minor and cosmetic — the story is a
 * structurally clean car with an honest, documented history (a "Buy" that still
 * has something to disclose), which is more credible than a flawless sample.
 */
export const DAMAGE_POINTS: readonly DamagePoint[] = [
  {
    id: "front-bumper",
    label: "Front bumper",
    detail: "Repainted — cosmetic, no structural repair",
    severity: "caution",
    position: [1.42, 0.04, 0.52],
  },
  {
    id: "driver-rocker",
    label: "Driver rocker",
    detail: "Paint-depth anomaly — minor blend",
    severity: "caution",
    position: [-0.35, -0.08, 0.55],
  },
] as const;

/** A pass/flag checkpoint shown in the holographic findings panel. */
export interface AnalysisCheck {
  label: string;
  status: VerdictStatus;
  note: string;
}

/** Title/odometer/recall checkpoints — the positive counterweight to the two
 * cosmetic flags, so the findings panel reads as a real report, not a warning. */
export const ANALYSIS_CHECKS: readonly AnalysisCheck[] = [
  { label: "Title", status: "clear", note: "Clean · single owner" },
  { label: "Odometer", status: "clear", note: "Consistent · 41,200 mi" },
  { label: "Open recalls", status: "caution", note: "1 minor · software" },
] as const;

/** The demo vehicle's decoded identity. */
export const DEMO_IDENTITY: VehicleIdentity = {
  vin: "VDKT21EA7MZ004821",
  year: 2021,
  make: "Premium EV",
  model: "Long Range",
  trim: "AWD",
  bodyStyle: "Sedan",
  engine: "Dual-motor · 82 kWh",
  drivetrain: "AWD",
};

/**
 * The synthesized top-line verdict shown when analysis completes. Score sits
 * just over the "buy" line (see `RECOMMENDATION_THRESHOLDS`): clean structure,
 * minor cosmetics — a confident but honest call.
 */
export const DEMO_VERDICT = {
  score: 81,
  status: "clear" as VerdictStatus,
  recommendation: "buy" as Recommendation,
  headline: "Structurally clean, minor cosmetic history.",
  summary:
    "Powertrain healthy and title clear. Two documented cosmetic repairs, no structural damage — a confident buy at fair market.",
  valuation: "Est. $24,800 · fair market",
} as const;
