import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/shared/animated-counter";

import type { IntelligenceDimension } from "../types";

/**
 * DimensionCard — renders one analytical dimension of a report. Pure and
 * data-driven; the grid of these composes the report body.
 */
export function DimensionCard({
  dimension,
  className,
}: {
  dimension: IntelligenceDimension;
  className?: string;
}) {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">{dimension.label}</CardTitle>
          <Badge variant={dimension.status}>
            <AnimatedCounter value={dimension.score} />
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-pretty text-muted-foreground">
          {dimension.summary}
        </p>
        <ul className="flex flex-col gap-2">
          {dimension.signals.map((signal) => (
            <li key={signal} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-verdict-clear" />
              <span>{signal}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
