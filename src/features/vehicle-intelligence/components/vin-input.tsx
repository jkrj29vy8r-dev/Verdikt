"use client";

import * as React from "react";
import { ArrowRight, Loader2, ScanLine } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useVinInput } from "../hooks/use-vin-input";
import { runVerdict, type RunVerdictResult } from "../actions";

interface VinInputProps {
  /** Persist the resulting report to the user's account (default true). */
  save?: boolean;
  /** Called with the result on a successful verdict. */
  onComplete?: (result: RunVerdictResult) => void;
  className?: string;
  autoFocus?: boolean;
}

/**
 * VinInput — the product's front door.
 *
 * A single, reusable VIN entry control: live client validation (shared with the
 * server via `schema.ts`), an optimistic pending state via `useTransition`, and
 * a typed action call. Reused verbatim by the hero and the /decode page; the
 * `onComplete` callback lets each host decide what happens next.
 */
export function VinInput({
  save = true,
  onComplete,
  className,
  autoFocus,
}: VinInputProps) {
  const { value, setValue, normalized, isValid, isDirty } = useVinInput();
  const [isPending, startTransition] = React.useTransition();

  const showError = isDirty && !isValid;

  function submit() {
    if (!isValid || isPending) return;
    startTransition(async () => {
      const result = await runVerdict({ vin: normalized, save });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Verdict ready", {
        description: `${result.data.report.identity.year} ${result.data.report.identity.make} ${result.data.report.identity.model}`,
      });
      onComplete?.(result.data);
    });
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border border-input bg-card/60 p-2 shadow-sm backdrop-blur transition-colors focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/40",
          showError && "border-destructive focus-within:ring-destructive/30",
        )}
      >
        <ScanLine className="ml-2 size-5 shrink-0 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Enter a 17-digit VIN"
          aria-label="Vehicle Identification Number"
          aria-invalid={showError}
          autoFocus={autoFocus}
          spellCheck={false}
          autoComplete="off"
          className="tabular h-11 border-0 bg-transparent text-base tracking-widest shadow-none focus-visible:ring-0"
        />
        <Button
          type="button"
          variant="signature"
          size="lg"
          onClick={submit}
          disabled={!isValid || isPending}
          className="shrink-0"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Analyzing
            </>
          ) : (
            <>
              Run verdict
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>

      <p
        className={cn(
          "mt-2 h-4 px-2 text-xs transition-colors",
          showError ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {showError
          ? "That VIN doesn't look right — check the characters and try again."
          : `${normalized.length}/17`}
      </p>
    </div>
  );
}
