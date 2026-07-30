import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { Reveal, Magnetic } from "@/components/motion";

/**
 * CTA — the closing conversion band. A signature-gradient surface with a
 * magnetic primary action to end the page on a high, tactile note.
 */
export function CallToAction() {
  return (
    <section className="py-24">
      <Container>
        <Reveal>
          <div className="border-hairline relative overflow-hidden rounded-3xl border bg-gradient-to-br from-signature/15 via-transparent to-signature-2/10 px-8 py-20 text-center">
            <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Know before you buy.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-pretty text-muted-foreground">
              Run your first verdict now — no account, no card, no wait.
            </p>
            <Magnetic className="mt-10 inline-block" strength={16}>
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
