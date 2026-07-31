import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { FloatingParticles } from "@/components/shared/floating-particles";
import { Reveal, Magnetic, Parallax } from "@/components/motion";

/**
 * CTA — the closing conversion band. A signature-gradient surface with a
 * parallax-drifting glow, a scatter of floating particles, and a magnetic
 * primary action, to end the page on a high, tactile note.
 */
export function CallToAction() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <Reveal>
          <div className="border-hairline relative overflow-hidden rounded-3xl border px-8 py-20 text-center">
            <Parallax
              speed={-0.25}
              aria-hidden
              className="absolute inset-x-0 -inset-y-32 bg-gradient-to-br from-signature/20 via-transparent to-signature-2/15"
            />
            <FloatingParticles />
            <h2 className="relative mx-auto max-w-2xl text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Know before you buy.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-pretty text-muted-foreground">
              Run your first verdict now — no account, no card, no wait.
            </p>
            <Magnetic className="relative mt-10 inline-block" strength={16}>
              <Button variant="signature" size="xl" asChild>
                <Link href="/decode">
                  Run a verdict
                  <ArrowRight className="size-5" />
                </Link>
              </Button>
            </Magnetic>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
