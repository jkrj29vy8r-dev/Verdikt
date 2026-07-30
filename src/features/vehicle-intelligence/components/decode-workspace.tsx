"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";

import { duration, easing } from "@/lib/motion";
import { VinInput } from "./vin-input";
import { VerdictReport } from "./verdict-report";
import type { RunVerdictResult } from "../actions";
import type { VehicleIntelligenceReport } from "../types";

/**
 * DecodeWorkspace — the authenticated decode surface. Runs a *saved* verdict
 * (save=true) and reveals the report inline. Encapsulates the input↔result state
 * so the /decode page is a one-line composition.
 */
export function DecodeWorkspace() {
  const [report, setReport] = React.useState<VehicleIntelligenceReport | null>(
    null,
  );

  const handleComplete = React.useCallback((result: RunVerdictResult) => {
    setReport(result.report);
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <VinInput save onComplete={handleComplete} autoFocus />

      <AnimatePresence mode="wait">
        {report ? (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.slow, ease: easing.outExpo }}
          >
            <VerdictReport report={report} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
