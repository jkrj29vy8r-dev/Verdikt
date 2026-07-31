import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import type { Recommendation } from "../types";

/** Recommendation → copy and semantic verdict color. Config as data, so a
 * label or color change happens here rather than in JSX. */
const RECOMMENDATION_META: Record<
  Recommendation,
  { label: string; variant: "clear" | "caution" | "flagged" }
> = {
  buy: { label: "Buy", variant: "clear" },
  consider: { label: "Consider", variant: "caution" },
  avoid: { label: "Avoid", variant: "flagged" },
};

/**
 * RecommendationPill — the explicit buy / consider / avoid call, in the
 * verdict's semantic color. This is Verdikt's headline output: the whole
 * product resolves to this one word. Extracted so the full report, the
 * holographic analysis HUD, and any future surface render it identically —
 * the recommendation must never disagree with itself across two screens.
 */
export function RecommendationPill({
  recommendation,
  showPrefix = true,
  className,
}: {
  recommendation: Recommendation;
  /** Show the "Verdikt recommends" eyebrow before the pill. */
  showPrefix?: boolean;
  className?: string;
}) {
  const meta = RECOMMENDATION_META[recommendation];
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showPrefix ? (
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Verdikt recommends
        </span>
      ) : null}
      <Badge variant={meta.variant} className="uppercase">
        {meta.label}
      </Badge>
    </div>
  );
}
