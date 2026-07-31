import type { Metadata } from "next";
import { Gauge, Eye, Zap, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Section, SectionHeading } from "@/components/shared/section";
import { Spotlight } from "@/components/shared/spotlight";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { blurIn, scaleIn } from "@/lib/motion";
import { CallToAction } from "@/components/marketing";

export const metadata: Metadata = {
  title: "About",
  description:
    "Verdikt exists to turn fragmented vehicle data into one definitive, explainable verdict.",
};

interface Value {
  icon: LucideIcon;
  title: string;
  description: string;
}

const VALUES: Value[] = [
  {
    icon: Eye,
    title: "Transparency",
    description:
      "Every score traces back to the data behind it. If we're uncertain, we say so — a verdict is worthless if you can't trust its reasoning.",
  },
  {
    icon: Gauge,
    title: "Precision",
    description:
      "History, valuation, and risk are reconciled across sources, not guessed at. A verdict is only as good as the discipline behind it.",
  },
  {
    icon: Zap,
    title: "Speed",
    description:
      "The moment before a purchase decision is short. Synthesis happens in seconds, not the days a manual inspection takes.",
  },
  {
    icon: ShieldCheck,
    title: "Trust",
    description:
      "We work for the buyer, never the seller. No dealer pays for a better score — the verdict is the same for everyone.",
  },
];

/**
 * About — the company page. Restates the mission in the site's own voice
 * (short, confident, no marketing filler) and closes on the same conversion
 * band as the landing page, so a visitor who arrives curious about the
 * company leaves with the same clear next action.
 */
export default function AboutPage() {
  return (
    <>
      <Section container="narrow" className="pt-32 md:pt-40">
        <Reveal variants={blurIn}>
          <span className="text-sm font-medium tracking-wide text-primary uppercase">
            Company
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Built for the moment before you buy.
          </h1>
          <p className="mt-6 text-lg text-pretty text-muted-foreground md:text-xl">
            Buying a vehicle sight-unseen — from a listing, an auction, a dealer
            three states away — means deciding on incomplete information.
            Verdikt exists to close that gap: one VIN in, one definitive,
            explainable verdict out. History, condition, fair value, and risk,
            synthesized into a call you can act on.
          </p>
        </Reveal>
      </Section>

      <Section>
        <Reveal variants={blurIn} className="mx-auto mb-16">
          <SectionHeading
            eyebrow="What we believe"
            title="The verdict has to be earned."
            description="Four principles the product is never allowed to compromise on."
            align="center"
          />
        </Reveal>

        <Stagger className="grid gap-5 md:grid-cols-2">
          {VALUES.map((value) => (
            <StaggerItem key={value.title} variants={scaleIn}>
              <Card className="group hover-lift h-full">
                <Spotlight contentClassName="flex h-full flex-col gap-6">
                  <CardHeader>
                    <div className="mb-2 grid size-11 place-items-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-rotate-3">
                      <value.icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-pretty text-muted-foreground">
                      {value.description}
                    </p>
                  </CardContent>
                </Spotlight>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <CallToAction />
    </>
  );
}
