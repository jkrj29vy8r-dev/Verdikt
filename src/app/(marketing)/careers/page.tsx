import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";

import { Section } from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion";
import { blurIn } from "@/lib/motion";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Verdikt is a small, product-obsessed team building explainable vehicle intelligence.",
};

const PRINCIPLES = [
  "Small team, high ownership — everyone shapes the product, not just their corner of it.",
  "Remote-first. We hire for judgment and output, not time zone.",
  "Quality over velocity. A verdict that's wrong is worse than a verdict that's late.",
];

const DEPARTMENTS = ["Engineering", "Design", "Data & AI"];

/**
 * Careers — deliberately honest about scale: no fabricated job listings or
 * headcount claims. Departments are presented as areas of interest with a
 * direct email path, the same pattern early-stage product teams (Linear,
 * Vercel) use before running a formal ATS.
 */
export default function CareersPage() {
  return (
    <>
      <Section container="narrow" className="pt-32 md:pt-40">
        <Reveal variants={blurIn}>
          <span className="text-sm font-medium tracking-wide text-primary uppercase">
            Careers
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance md:text-5xl">
            Help write the verdict.
          </h1>
          <p className="mt-6 text-lg text-pretty text-muted-foreground md:text-xl">
            We&rsquo;re a small, product-obsessed team building the platform we
            wish existed the last time we bought a car sight-unseen. If that
            sounds like your kind of problem, we want to hear from you — even
            without an open role listed below.
          </p>
        </Reveal>
      </Section>

      <Section container="narrow">
        <Reveal delay={0.1}>
          <h2 className="text-xl font-semibold tracking-tight">How we work</h2>
          <ul className="mt-5 flex flex-col gap-4">
            {PRINCIPLES.map((principle) => (
              <li key={principle} className="flex gap-3 text-muted-foreground">
                <span
                  aria-hidden
                  className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary"
                />
                <span className="text-pretty">{principle}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.18} className="mt-16">
          <Card className="hover-lift">
            <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Open to hearing from</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {DEPARTMENTS.join(" · ")}
                </p>
              </div>
              <Button variant="signature" asChild>
                <Link href="mailto:careers@verdikt.app">
                  <Mail className="size-4" />
                  careers@verdikt.app
                </Link>
              </Button>
            </CardContent>
          </Card>
        </Reveal>
      </Section>
    </>
  );
}
