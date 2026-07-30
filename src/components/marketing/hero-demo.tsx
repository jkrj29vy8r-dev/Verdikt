"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";

import { duration, easing } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import {
  VinInput,
  VerdictReport,
  type RunVerdictResult,
  type VehicleIntelligenceReport,
} from "@/features/vehicle-intelligence";

/**
 * HeroDemo — the interactive core of the landing hero.
 *
 * Runs a real, unauthenticated verdict (save=false) and reveals the report
 * inline: the product sells itself in one interaction, no signup wall. Isolated
 * as a client component so the surrounding hero stays a Server Component.
 */
export function HeroDemo() {
  const [report, setReport] = React.useState<VehicleIntelligenceReport | null>(
    null,
  );

  const handleComplete = React.useCallback((result: RunVerdictResult) => {
    setReport(result.report);
  }, []);

  return (
    <div className="w-full">
      <VinInput
        save={false}
        onComplete={handleComplete}
        className="mx-auto max-w-xl"
      />

      <AnimatePresence mode="wait">
        {report ? (
          <motion.div
            key="report"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.slow, ease: easing.outExpo }}
            className="mt-12 text-left"
          >
            <VerdictReport report={report} />
            <div className="mt-8 flex justify-center">
              <Button variant="outline" asChild>
                <Link href="/decode">
                  Save & run another
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
