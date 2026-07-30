import { Car, Gauge, Wrench } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatCurrency, formatVin } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VerdictScore } from "@/components/shared/verdict-score";
import { Stagger, StaggerItem } from "@/components/motion";

import type { VehicleIntelligenceReport } from "../types";
import { DimensionCard } from "./dimension-card";

/**
 * VerdictReport — the full report view. Composes the signature VerdictScore, the
 * vehicle identity, valuation, and the dimension grid into the canonical report
 * layout, reused by the /decode result and a saved report's detail page.
 */
export function VerdictReport({
  report,
  className,
}: {
  report: VehicleIntelligenceReport;
  className?: string;
}) {
  const { identity, verdict, valuation, dimensions } = report;

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {/* Verdict header */}
      <Card className="overflow-hidden">
        <CardContent className="flex flex-col items-center gap-8 py-8 md:flex-row md:items-center md:py-6">
          <VerdictScore
            score={verdict.score}
            status={verdict.status}
            size="lg"
          />
          <div className="flex flex-1 flex-col gap-3 text-center md:text-left">
            <h1 className="text-2xl font-semibold tracking-tight text-balance md:text-3xl">
              {verdict.headline}
            </h1>
            <p className="text-pretty text-muted-foreground">
              {verdict.summary}
            </p>
            <p className="tabular text-xs tracking-widest text-muted-foreground">
              VIN {formatVin(identity.vin)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Identity + valuation strip */}
      <Card>
        <CardContent className="grid grid-cols-2 gap-6 py-6 md:grid-cols-4">
          <Fact icon={Car} label="Vehicle">
            {identity.year} {identity.make} {identity.model}
          </Fact>
          <Fact icon={Wrench} label="Powertrain">
            {identity.engine} · {identity.drivetrain}
          </Fact>
          <Fact icon={Gauge} label="Est. market value">
            {formatCurrency(valuation.estimate)}
          </Fact>
          <Fact label="Value range">
            {formatCurrency(valuation.low)} – {formatCurrency(valuation.high)}
          </Fact>
        </CardContent>
      </Card>

      <Separator />

      {/* Dimensions */}
      <Stagger className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dimensions.map((dimension) => (
          <StaggerItem key={dimension.key}>
            <DimensionCard dimension={dimension} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

function Fact({
  icon: Icon,
  label,
  children,
}: {
  icon?: typeof Car;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {Icon ? <Icon className="size-3.5" /> : null}
        {label}
      </span>
      <span className="text-sm font-medium text-pretty">{children}</span>
    </div>
  );
}
