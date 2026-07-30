import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

import type { VehicleIntelligenceReport } from "../types";

/**
 * Verdikt AI — the product's intelligence voice.
 *
 * The deterministic engine (`synthesis.ts`) owns the *numbers* — scores,
 * valuation, repair and maintenance forecasts — because a judgment about
 * someone's purchase must be explainable and reproducible. Verdikt AI owns the
 * *interpretation*: it reads that analysis the way a seasoned inspector would
 * and writes the verdict in plain, decisive language. It never restates raw
 * data; it explains what the data means, what to expect, and how much to trust
 * the call.
 *
 * The persona below is the single source of truth for that voice. It is used as
 * the model's system prompt here, and it is mirrored by the deterministic
 * fallback narrator so the product sounds the same with or without a live model.
 */

/** The model that authors verdict narratives. */
const VERDIKT_AI_MODEL = "claude-opus-5";

/** Bump when the persona's contract changes, so narratives are traceable. */
export const VERDIKT_AI_PERSONA_VERSION = "1.0.0";

/**
 * The Verdikt AI contract. Every directive here is a product requirement:
 * interpret, explain, predict, estimate, judge — in an inspector's voice, and
 * be honest about uncertainty.
 */
export const VERDIKT_AI_SYSTEM_PROMPT = `You are Verdikt AI, the intelligence behind Verdikt — a premium vehicle-intelligence platform. A buyer hands you the decoded analysis of a vehicle and trusts you to tell them, plainly, whether to buy it.

Write like an experienced vehicle inspector who has walked a thousand cars — direct, grounded, and unafraid to give a straight answer. You are talking to the person about to spend their money, not filing a lab report.

Your rules, without exception:

1. NEVER simply display raw data. A number on its own ("score 74", "$480 brake job") is not an insight. Interpret every figure: what does it mean for this buyer, and why.
2. EXPLAIN your reasoning. When you land on a verdict, say what drove it — which findings carried the most weight and which you discounted.
3. PREDICT what ownership will feel like. Translate the repair and maintenance outlook into what's likely to come due, roughly when, and what it signals about the vehicle's condition.
4. ESTIMATE costs in plain terms. Frame repair and upkeep figures as what the buyer should budget, not as a table read-back.
5. GENERATE a clear verdict. Buy, consider, or avoid — commit to it and stand behind it. No hedging for its own sake.
6. BE TRANSPARENT WHEN DATA IS UNCERTAIN. If the records are thin or a finding is borderline, say so in the buyer's interest. Never present a shaky call as a confident one. Calibrate your certainty to the data confidence you're given.

Hard constraints:
- Work only from the analysis provided. Never invent a make, a mileage, an accident, a recall, or any fact not present in the input.
- Interpret the provided numbers; do not parrot them back verbatim.
- Be concise and high-signal. A buyer wants the read, not an essay — a few sentences per field, no filler, no preamble.
- Stay in Verdikt's voice: confident, precise, and plainspoken. No marketing gloss, no emoji.

You will return only the structured narrative requested — nothing else.`;

/** The interpretive prose Verdikt AI produces over the deterministic analysis. */
const reportNarrativeSchema = z.object({
  /** One decisive line — the verdict a buyer would repeat to a friend. */
  headline: z.string(),
  /** A few sentences: the call, what drove it, and what to expect owning it. */
  summary: z.string(),
  /** An honest read on how firmly the records back the verdict. */
  confidenceNote: z.string(),
  /** Per-dimension interpretation — what each score means, not a restatement. */
  dimensions: z.array(
    z.object({
      key: z.enum(["history", "valuation", "risk", "market", "ownership"]),
      summary: z.string(),
    }),
  ),
});

export type ReportNarrative = z.infer<typeof reportNarrativeSchema>;

/**
 * The JSON Schema handed to the model's structured-output constraint. It mirrors
 * `reportNarrativeSchema` (which validates the reply on the way back). Kept as
 * hand-written JSON Schema rather than derived from Zod because the SDK's Zod
 * helper targets a different Zod major than this project pins.
 */
const NARRATIVE_JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    headline: { type: "string" },
    summary: { type: "string" },
    confidenceNote: { type: "string" },
    dimensions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          key: {
            type: "string",
            enum: ["history", "valuation", "risk", "market", "ownership"],
          },
          summary: { type: "string" },
        },
        required: ["key", "summary"],
      },
    },
  },
  required: ["headline", "summary", "confidenceNote", "dimensions"],
};

/** Assemble the analysis into the brief Verdikt AI interprets. Structured so the
 * model reasons over facts, not prose. */
function buildNarrativeInput(report: VehicleIntelligenceReport): string {
  const {
    identity,
    verdict,
    valuation,
    dimensions,
    repairForecast,
    maintenance,
  } = report;

  const brief = {
    vehicle: [identity.year, identity.make, identity.model, identity.trim]
      .filter(Boolean)
      .join(" "),
    powertrain: [identity.engine, identity.drivetrain]
      .filter(Boolean)
      .join(" · "),
    verdict: {
      score: verdict.score,
      status: verdict.status,
      recommendation: verdict.recommendation,
    },
    dataConfidence: verdict.confidence?.level ?? "moderate",
    valuation: {
      estimate: valuation.estimate,
      low: valuation.low,
      high: valuation.high,
    },
    dimensions: dimensions.map((d) => ({
      key: d.key,
      label: d.label,
      score: d.score,
      status: d.status,
      signals: d.signals,
    })),
    repairOutlook: {
      twelveMonthBudget: repairForecast.twelveMonthEstimate,
      likely: repairForecast.items.map((i) => ({
        component: i.component,
        likelihood: i.likelihood,
        monthsOut: i.horizonMonths,
        cost: i.estimatedCost,
      })),
    },
    maintenance: {
      annualBudget: maintenance.annualEstimate,
      soonest: maintenance.items.map((m) => ({
        service: m.service,
        monthsOut: m.dueInMonths,
        cost: m.estimatedCost,
      })),
    },
  };

  return `Here is the decoded analysis for one vehicle. Write the verdict narrative.\n\n${JSON.stringify(brief, null, 2)}`;
}

/**
 * narrateReport — the live Verdikt AI pass over a deterministic report.
 *
 * Returns interpretive prose (headline, summary, confidence note, per-dimension
 * reads) authored by the model under the Verdikt AI persona, or `null` when no
 * model is configured, the request fails, or safety classifiers decline it. A
 * `null` is not an error path to surface — it is the signal for the caller to
 * keep the deterministic inspector narrative, so the free "try it live" flow and
 * the production build never depend on a key or a network round-trip.
 */
export async function narrateReport(
  report: VehicleIntelligenceReport,
): Promise<ReportNarrative | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;

  try {
    const client = new Anthropic({ timeout: 30_000, maxRetries: 1 });

    const response = await client.messages.create({
      model: VERDIKT_AI_MODEL,
      max_tokens: 2048,
      system: VERDIKT_AI_SYSTEM_PROMPT,
      output_config: {
        format: { type: "json_schema", schema: NARRATIVE_JSON_SCHEMA },
      },
      messages: [{ role: "user", content: buildNarrativeInput(report) }],
    });

    // Safety classifiers can decline (HTTP 200, stop_reason "refusal") — treat
    // it as "no narrative" and fall back, never as a thrown error.
    if (response.stop_reason === "refusal") return null;

    const block = response.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") return null;

    // Structured output constrains the shape, but validate anyway before it
    // reaches the UI — a schema miss falls back rather than rendering garbage.
    const parsed = reportNarrativeSchema.safeParse(JSON.parse(block.text));
    return parsed.success ? parsed.data : null;
  } catch {
    // Any failure (missing/invalid key, network, timeout, schema miss) falls
    // back to the deterministic narrator. The verdict itself is never at risk.
    return null;
  }
}
