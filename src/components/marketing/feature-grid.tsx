import {
  History,
  ShieldCheck,
  LineChart,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section, SectionHeading } from "@/components/shared/section";
import { Spotlight } from "@/components/shared/spotlight";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { blurIn, scaleIn } from "@/lib/motion";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: History,
    title: "Title & History",
    description:
      "Accidents, title brands, odometer integrity, and full service records — reconciled across sources.",
  },
  {
    icon: ShieldCheck,
    title: "Risk Assessment",
    description:
      "Open recalls, theft records, liens, and structural concerns, weighted into a single risk signal.",
  },
  {
    icon: LineChart,
    title: "Fair Valuation",
    description:
      "Market value with a confidence band, benchmarked against comparable listings and condition.",
  },
  {
    icon: TrendingUp,
    title: "Market Position",
    description:
      "Demand, days-on-market, and price trajectory so you know exactly where a deal sits.",
  },
  {
    icon: Users,
    title: "Ownership & Usage",
    description:
      "Owner count, usage type, and geographic history that reveal how a vehicle was really lived with.",
  },
  {
    icon: Zap,
    title: "Instant Synthesis",
    description:
      "Every dimension composed into one explainable verdict score — in seconds, not days.",
  },
];

/**
 * FeatureGrid — the "what you get" section. Data-driven cards animate in as a
 * cascade via the reusable Stagger primitive.
 */
export function FeatureGrid() {
  return (
    <Section id="product">
      <Reveal variants={blurIn} className="mx-auto mb-16">
        <SectionHeading
          eyebrow="The intelligence"
          title="Five dimensions. One verdict."
          description="Verdikt reconciles fragmented vehicle data into a single, explainable judgment you can act on with confidence."
          align="center"
        />
      </Reveal>

      <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <StaggerItem key={feature.title} variants={scaleIn}>
            <Card className="group hover-lift h-full">
              <Spotlight contentClassName="flex h-full flex-col gap-6">
                <CardHeader>
                  <div className="mb-2 grid size-11 place-items-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3">
                    <feature.icon className="size-5" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-pretty text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Spotlight>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
