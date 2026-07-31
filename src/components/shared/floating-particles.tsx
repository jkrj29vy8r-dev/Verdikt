import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

/**
 * Fixed, deterministic particle layout — never `Math.random()` at render time,
 * which would mismatch between the server and client render and cause a
 * hydration error. Values are hand-tuned for an organic, non-grid scatter.
 */
const PARTICLES = [
  { left: "8%", top: "18%", size: 3, duration: 9, delay: 0 },
  { left: "16%", top: "68%", size: 2, duration: 11, delay: 1.2 },
  { left: "27%", top: "32%", size: 2.5, duration: 8, delay: 2.4 },
  { left: "38%", top: "78%", size: 3, duration: 12, delay: 0.6 },
  { left: "48%", top: "14%", size: 2, duration: 10, delay: 3.1 },
  { left: "58%", top: "58%", size: 3.5, duration: 9.5, delay: 1.8 },
  { left: "67%", top: "24%", size: 2, duration: 11.5, delay: 0.3 },
  { left: "76%", top: "72%", size: 2.5, duration: 8.5, delay: 2.9 },
  { left: "84%", top: "40%", size: 3, duration: 10.5, delay: 1.5 },
  { left: "92%", top: "16%", size: 2, duration: 9, delay: 3.6 },
  { left: "12%", top: "88%", size: 2.5, duration: 12.5, delay: 2.1 },
  { left: "62%", top: "90%", size: 2, duration: 10, delay: 0.9 },
] as const;

/**
 * FloatingParticles — a decorative, deterministic drift of small signature-lit
 * motes for surfaces that want the "AI is alive" feeling without a WebGL
 * canvas (the 3D hero already owns real Sparkles; this is the cheap CSS
 * equivalent for everywhere else). Pure CSS animation on `transform`/`opacity`
 * only, so it costs nothing beyond one paint layer per particle; the
 * `motion-safe:` variant means reduced-motion users simply see still dots, no
 * animation applied at all. Purely decorative — `aria-hidden`.
 */
export function FloatingParticles({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-signature/60 motion-safe:animate-[particle-drift_var(--particle-duration)_ease-in-out_var(--particle-delay)_infinite]"
          style={
            {
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              boxShadow: "0 0 8px 1px var(--signature)",
              "--particle-duration": `${p.duration}s`,
              "--particle-delay": `${p.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
