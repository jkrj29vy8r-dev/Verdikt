import Link from "next/link";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section, SectionHeading } from "@/components/shared/section";
import { Reveal } from "@/components/motion";

interface Tier {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

const TIERS: Tier[] = [
  {
    name: "Explorer",
    price: "$0",
    cadence: "forever",
    description: "For the occasional buyer checking a single vehicle.",
    features: [
      "3 verdicts included",
      "Full five-dimension report",
      "Valuation & risk signals",
    ],
    cta: "Start free",
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "per month",
    description: "For enthusiasts and shoppers comparing many vehicles.",
    features: [
      "Unlimited verdicts",
      "Watchlist & price alerts",
      "Saved report history",
      "Priority synthesis",
    ],
    cta: "Go Pro",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "annual",
    description: "For dealers and marketplaces operating at scale.",
    features: [
      "API access & bulk decode",
      "Team workspaces",
      "SLA & dedicated support",
      "Custom data providers",
    ],
    cta: "Talk to sales",
  },
];

/** Pricing — three tiers with the recommended plan emphasized. */
export function Pricing() {
  return (
    <Section id="pricing">
      <SectionHeading
        eyebrow="Pricing"
        title="Confidence at every scale."
        description="Start free. Upgrade when the stakes are higher."
        align="center"
        className="mx-auto mb-16"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {TIERS.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 0.08}>
            <Card
              className={cn(
                "relative h-full",
                tier.featured &&
                  "border-primary/40 shadow-lg ring-1 ring-primary/20",
              )}
            >
              {tier.featured ? (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most popular
                </Badge>
              ) : null}
              <CardHeader>
                <CardTitle className="text-lg">{tier.name}</CardTitle>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-4xl font-semibold tracking-tight">
                    {tier.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {tier.cadence}
                  </span>
                </div>
                <p className="mt-2 text-sm text-pretty text-muted-foreground">
                  {tier.description}
                </p>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <ul className="flex flex-col gap-3">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2.5 text-sm"
                    >
                      <Check className="size-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={tier.featured ? "signature" : "outline"}
                  size="lg"
                  asChild
                  className="w-full"
                >
                  <Link href="/decode">{tier.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
