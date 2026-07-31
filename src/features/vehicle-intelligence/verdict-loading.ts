/**
 * Verdict loading cinematic — configuration as data.
 *
 * Two clocks drive the loading experience at different granularities: a
 * granular activity ticker (what the console-style caption says right now)
 * and a coarse checklist (the persistent, checkmarked timeline). Keeping both
 * as typed data means the pacing and the copy are tuned in one place, and the
 * hook that drives them (`useVerdictLoading`) stays purely mechanical.
 */

/** The rotating "what's happening now" caption, cycled one at a time. */
export const VERDICT_LOADING_MESSAGES: readonly string[] = [
  "Connecting to vehicle databases…",
  "Verifying VIN…",
  "Checking ownership history…",
  "Searching accident databases…",
  "Checking mileage records…",
  "Running AI risk analysis…",
  "Comparing market value…",
  "Building final verdict…",
];

/** The persistent checklist shown as a timeline with checkmarks. Coarser than
 * the message ticker above — each step corresponds to a run of messages. */
export interface VerdictLoadingStep {
  key: string;
  label: string;
}

export const VERDICT_LOADING_STEPS: readonly VerdictLoadingStep[] = [
  { key: "vin", label: "VIN Verified" },
  { key: "ownership", label: "Ownership" },
  { key: "damage", label: "Damage Records" },
  { key: "market", label: "Market Analysis" },
  { key: "verdict", label: "AI Verdict" },
];

/** Milliseconds the ticker dwells on each message. Eight messages at this pace
 * land the cinematic's nominal length at ~5s — deliberately paced (not just
 * "as fast as possible") so the AI genuinely reads as working, the way a
 * real multi-source lookup would. `VinInput` holds the real reveal back by
 * this same total, so a fast backend response never cuts the cinematic short;
 * a slow one is never masked — see `useVerdictLoading`'s hold-at-final-message
 * behavior. */
export const VERDICT_LOADING_MESSAGE_MS = 620;

/** The cinematic's nominal total length — the "around 4–6 seconds" target. */
export const VERDICT_LOADING_MIN_MS =
  VERDICT_LOADING_MESSAGES.length * VERDICT_LOADING_MESSAGE_MS;
