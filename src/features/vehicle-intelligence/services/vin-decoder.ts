import "server-only";

import type { VehicleIdentity } from "../types";
import { normalizeVin } from "../schema";

/**
 * VIN decoding service.
 *
 * Abstracts the upstream vehicle-data provider behind a narrow interface so the
 * rest of the app never couples to a vendor. Swap `referenceDecoder` for a real
 * provider adapter (NHTSA vPIC, a commercial feed) without touching callers —
 * the seam that keeps vendor churn from rippling through the codebase.
 */
export interface VinDecoder {
  decode(vin: string): Promise<VehicleIdentity>;
}

const MAKES = [
  "Audi",
  "BMW",
  "Genesis",
  "Lexus",
  "Mercedes-Benz",
  "Porsche",
  "Tesla",
  "Volvo",
] as const;
const MODELS = ["Series 5", "Q7", "GV80", "RX", "Model S", "Taycan", "XC90"];
const DRIVETRAINS = ["AWD", "RWD", "FWD"];

/**
 * Reference decoder. Deterministic from the VIN so behavior is reproducible in
 * development and tests without a paid API call. Replace in production.
 */
export const referenceDecoder: VinDecoder = {
  async decode(rawVin: string): Promise<VehicleIdentity> {
    const vin = normalizeVin(rawVin);
    // The 10th character encodes model year per ISO 3779; derive plausibly.
    const yearChar = vin.charCodeAt(9);
    const year = 2015 + (yearChar % 11);
    const make = MAKES[yearChar % MAKES.length]!;
    const model = MODELS[vin.charCodeAt(3) % MODELS.length]!;

    return {
      vin,
      year,
      make,
      model,
      trim: "Premium",
      bodyStyle: "SUV",
      engine: "Turbocharged I6",
      drivetrain: DRIVETRAINS[vin.charCodeAt(7) % DRIVETRAINS.length]!,
    };
  },
};

/** The decoder the app uses. Centralized here for one-line provider swaps. */
export const vinDecoder: VinDecoder = referenceDecoder;
