import type { VerdictStatus } from "../../types";

/**
 * Verdict-status → visual tokens, shared across the command center's widgets so
 * a status is always drawn in the same semantic color. CSS-variable strings feed
 * SVG/inline styles (charts); the class maps feed Tailwind (dots, text).
 */
export const STATUS_TOKEN: Record<VerdictStatus, string> = {
  clear: "var(--verdict-clear)",
  caution: "var(--verdict-caution)",
  flagged: "var(--verdict-flag)",
};

export const STATUS_LABEL: Record<VerdictStatus, string> = {
  clear: "Clear",
  caution: "Caution",
  flagged: "Flagged",
};

export const STATUS_DOT: Record<VerdictStatus, string> = {
  clear: "bg-verdict-clear",
  caution: "bg-verdict-caution",
  flagged: "bg-verdict-flag",
};

export const STATUS_TEXT: Record<VerdictStatus, string> = {
  clear: "text-verdict-clear",
  caution: "text-verdict-caution",
  flagged: "text-verdict-flag",
};
