import { z } from "zod";

/**
 * Validation schemas & VIN algorithms for the vehicle-intelligence feature.
 *
 * A VIN isn't just a 17-char string — it carries an ISO 3779 check digit. We
 * validate it properly so garbage never reaches the (metered, paid) upstream
 * decode API. The same schemas are reused on the client (instant feedback) and
 * server (trust boundary), so validation logic lives in exactly one place.
 */

/** Characters permitted in a VIN (I, O, Q are excluded by standard). */
const VIN_ALLOWED = /^[A-HJ-NPR-Z0-9]{17}$/;

const TRANSLITERATION: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  J: 1,
  K: 2,
  L: 3,
  M: 4,
  N: 5,
  P: 7,
  R: 9,
  S: 2,
  T: 3,
  U: 4,
  V: 5,
  W: 6,
  X: 7,
  Y: 8,
  Z: 9,
  "0": 0,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
};

const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

/** Normalize user input: strip separators, uppercase. */
export function normalizeVin(input: string): string {
  return input.replace(/[\s-]/g, "").toUpperCase();
}

/** Verify the 9th-position ISO 3779 check digit. */
export function hasValidCheckDigit(vin: string): boolean {
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const value = TRANSLITERATION[vin[i]!];
    if (value === undefined) return false;
    sum += value * WEIGHTS[i]!;
  }
  const remainder = sum % 11;
  const expected = remainder === 10 ? "X" : String(remainder);
  return vin[8] === expected;
}

/** Whole-string VIN validity: shape + check digit. */
export function isValidVin(input: string): boolean {
  const vin = normalizeVin(input);
  return VIN_ALLOWED.test(vin) && hasValidCheckDigit(vin);
}

/** Zod schema for a single VIN, applied at every trust boundary. */
export const vinSchema = z
  .string()
  .trim()
  .transform(normalizeVin)
  .refine((v) => VIN_ALLOWED.test(v), {
    message: "A VIN is 17 characters (letters and numbers, excluding I, O, Q).",
  })
  .refine(hasValidCheckDigit, {
    message: "That VIN's check digit is invalid — please re-check it.",
  });

/** Payload for requesting a new intelligence report. */
export const decodeRequestSchema = z.object({
  vin: vinSchema,
  save: z.boolean().default(true),
});

export type DecodeRequest = z.infer<typeof decodeRequestSchema>;
