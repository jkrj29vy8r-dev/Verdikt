"use client";

import * as React from "react";

import { isValidVin, normalizeVin } from "../schema";

interface UseVinInput {
  /** Raw, user-facing value (uppercased, separators stripped). */
  value: string;
  setValue: (next: string) => void;
  /** Normalized 17-char VIN. */
  normalized: string;
  /** True once the input is a structurally valid VIN with a good check digit. */
  isValid: boolean;
  /** True when there is enough input to bother showing a validation state. */
  isDirty: boolean;
  reset: () => void;
}

/**
 * Encapsulates VIN entry state and live validation, reusing the exact same
 * `schema.ts` rules the server enforces. Keeping this in a hook lets the field
 * component stay presentational and makes the behavior independently testable.
 */
export function useVinInput(initial = ""): UseVinInput {
  const [value, setValueRaw] = React.useState(() => normalizeVin(initial));

  const setValue = React.useCallback((next: string) => {
    // Enforce VIN charset as the user types; cap at 17.
    setValueRaw(normalizeVin(next).slice(0, 17));
  }, []);

  const normalized = value;
  const isValid = React.useMemo(() => isValidVin(normalized), [normalized]);
  const isDirty = normalized.length >= 17;

  const reset = React.useCallback(() => setValueRaw(""), []);

  return { value, setValue, normalized, isValid, isDirty, reset };
}
