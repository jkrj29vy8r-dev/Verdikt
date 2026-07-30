import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import type { Recommendation } from "../types";

/**
 * The explicit buy / consider / avoid call, in the verdict's semantic color —
 * Verdikt's headline output. Extracted so the full report, the holographic
 * analysis HUD, and any future surface render the recommendation identically.
 */
const RECOMMENDATION_META: Record<
  Recommendation,
  { label: string; variant: "clear" | "caution" | "flagged" }
> = {
  buy: { label: "Buy", variant: "clear" },
  consider: { label: "Consider", variant: "caution" },
  avoid: { label: "Avoid", variant: "flagged" },
};

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
