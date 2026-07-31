import { CalendarClock, Car, Coins, Gauge, Wrench } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatCurrency, formatVin } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VerdictScore } from "@/components/shared/verdict-score";
import { Stagger, StaggerItem } from "@/components/motion";

import type { ConfidenceLevel, VerdictConfidence } from "../types";
import type { VehicleIntelligenceReport } from "../types";
import { DimensionCard } from "./dimension-card";
import { RecommendationPill } from "./recommendation-pill";

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
  const {
    identity,
    verdict,
    valuation,
    repairForecast,
    maintenance,
    dimensions,
  } = report;

  return (
    // Each major block cascades in — Verdict, then Identity, then the
    // dimension grid — rather than the whole report appearing at once. The
    // outer `gap` is generous enough that `whileInView` on later blocks
    // triggers naturally as the report is already visible on mount.
    <Stagger gap={0.15} className={cn("flex flex-col gap-8", className)}>
      {/* Verdict header */}
      <StaggerItem>
        <Card className="overflow-hidden">
          <CardContent className="flex flex-col items-center gap-8 py-8 md:flex-row md:items-center md:py-6">
            <VerdictScore
              score={verdict.score}
              status={verdict.status}
              size="lg"
            />
            <div className="flex flex-1 flex-col gap-3 text-center md:text-left">
              <RecommendationPill
                recommendation={verdict.recommendation}
                className="justify-center md:justify-start"
              />
              <h1 className="text-2xl font-semibold tracking-tight text-balance md:text-3xl">
                {verdict.headline}
              </h1>
              <p className="text-pretty text-muted-foreground">
                {verdict.summary}
              </p>
              {verdict.confidence ? (
                <ConfidenceNote confidence={verdict.confidence} />
              ) : null}
              <p className="tabular text-xs tracking-widest text-muted-foreground">
                VIN {formatVin(identity.vin)}
              </p>
            </div>
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Identity + valuation strip */}
      <StaggerItem>
        <Card>
          <CardContent className="grid grid-cols-2 gap-6 py-6 md:grid-cols-3">
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
            <Fact icon={Coins} label="12-mo repairs">
              ~{formatCurrency(repairForecast.twelveMonthEstimate)}
            </Fact>
            <Fact icon={CalendarClock} label="Annual upkeep">
              ~{formatCurrency(maintenance.annualEstimate)}
            </Fact>
          </CardContent>
        </Card>
      </StaggerItem>

      <StaggerItem>
        <Separator />
      </StaggerItem>

      {/* Dimensions — its own nested cascade (History, Ownership, Risk,
       * Valuation, Market), one tier down from the outer section-level one. */}
      <StaggerItem>
        <Stagger className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dimensions.map((dimension) => (
            <StaggerItem key={dimension.key}>
              <DimensionCard dimension={dimension} />
            </StaggerItem>
          ))}
        </Stagger>
      </StaggerItem>
    </Stagger>
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

const CONFIDENCE_LABEL: Record<ConfidenceLevel, string> = {
  high: "High",
  moderate: "Moderate",
  limited: "Limited",
};

const CONFIDENCE_DOT: Record<ConfidenceLevel, string> = {
  high: "bg-verdict-clear",
  moderate: "bg-verdict-caution",
  limited: "bg-verdict-flag",
};

/**
 * The transparency line: how firmly the records back this verdict, in the
 * inspector's own words — so an uncertain call is never presented as a certain
 * one.
 */
function ConfidenceNote({ confidence }: { confidence: VerdictConfidence }) {
  return (
    <div className="surface-glass border-hairline flex items-start gap-2.5 rounded-xl border p-3 text-left">
      <span
        className={cn(
          "mt-1 size-2 shrink-0 rounded-full",
          CONFIDENCE_DOT[confidence.level],
        )}
        aria-hidden
      />
      <p className="text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">
          Data confidence: {CONFIDENCE_LABEL[confidence.level]}.
        </span>{" "}
        {confidence.note}
      </p>
    </div>
  );
}
