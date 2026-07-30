import { Sparkles } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion";
import { HeroScene } from "@/components/three";
import { HeroDemo } from "./hero-demo";

/**
 * Hero — the first impression. A Server Component that composes the 3D scene,
 * the headline, and the interactive live-demo client island. The 3D layer sits
 * behind the content and lazy-hydrates, so text and the VIN field are usable
 * immediately.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient 3D backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
      >
        <div className="absolute top-1/2 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2">
          <HeroScene />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-background" />
      </div>

      <Container className="flex flex-col items-center py-24 text-center md:py-32">
        <Reveal>
          <Badge variant="secondary" className="mb-6 gap-1.5 py-1">
            <Sparkles className="size-3.5" />
            AI-powered vehicle intelligence
          </Badge>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-balance md:text-7xl">
            The <span className="text-gradient-signature">verdict</span> on any
            vehicle.
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-lg text-pretty text-muted-foreground md:text-xl">
            Decode any VIN into a definitive verdict — history, valuation, risk
            and market position — synthesized in seconds. No signup required.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 w-full">
          <HeroDemo />
        </Reveal>
      </Container>
    </section>
  );
}
