import { ChevronDown, Sparkles } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { blurIn } from "@/lib/motion";
import { HeroScene } from "@/components/three";
import { HeroDemo } from "./hero-demo";
import { DecodingVinReadout, HolographicHud } from "./vin-scanner-overlay";

interface HeadlineWord {
  text: string;
  signature?: boolean;
}

/** Headline split into kinetic units — the gradient word is its own unit so
 * the signature treatment survives the word-by-word reveal. */
const HEADLINE: HeadlineWord[] = [
  { text: "The" },
  { text: "verdict", signature: true },
  { text: "on" },
  { text: "any" },
  { text: "vehicle." },
];

/**
 * Hero — the first five seconds of Verdikt.
 *
 * A full-viewport Server Component: the original `VehicleSilhouette` 3D scene
 * fills the frame edge-to-edge behind top-anchored copy, so the vehicle owns
 * the lower field and the glass search bar reads as resting on it (the
 * RideLux "glass search over the vehicle" principle, in Verdikt's own
 * language) — headline and text never fight the 3D subject for the same
 * vertical center. The 3D layer, the holographic HUD, and the decoding VIN
 * readout are all client islands; the shell, copy, and layout stay
 * server-rendered and interactive immediately.
 */
export function Hero() {
  return (
    <section className="relative flex h-dvh min-h-[720px] flex-col overflow-hidden">
      {/* Full-bleed 3D backdrop */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <HeroScene className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <HolographicHud />

      <Container className="relative z-10 flex flex-1 flex-col items-center justify-start pt-28 pb-16 text-center md:pt-36">
        <Reveal>
          <Badge variant="secondary" className="mb-6 gap-1.5 py-1">
            <Sparkles className="size-3.5" />
            AI-powered vehicle intelligence
          </Badge>
        </Reveal>

        <Stagger
          gap={0.06}
          delay={0.05}
          className="flex max-w-5xl flex-wrap justify-center gap-x-3 gap-y-1"
        >
          {HEADLINE.map((word) => (
            <StaggerItem
              key={word.text}
              variants={blurIn}
              className="text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
            >
              <span
                className={
                  word.signature ? "text-gradient-signature" : undefined
                }
              >
                {word.text}
              </span>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.35}>
          <p className="mt-6 max-w-2xl text-lg text-pretty text-muted-foreground md:text-xl">
            Decode any VIN into a definitive verdict — history, valuation, risk
            and market position — synthesized in seconds. No signup required.
          </p>
        </Reveal>

        <Reveal delay={0.42} className="mt-10 w-full max-w-xl">
          <DecodingVinReadout className="mb-3" />
          <HeroDemo />
        </Reveal>
      </Container>

      <ScrollCue />
    </section>
  );
}

/** Bottom-center affordance signaling more content below. Static under
 * reduced-motion; a slow, gentle bounce otherwise. */
function ScrollCue() {
  return (
    <div
      aria-hidden
      className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 motion-safe:animate-bounce"
    >
      <ChevronDown className="size-5 text-muted-foreground/60" />
    </div>
  );
}
