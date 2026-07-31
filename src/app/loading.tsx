/**
 * Root loading UI, shown during route-level Suspense while a page streams.
 * A branded gradient ring rather than a generic spinner — the wait itself feels
 * like part of the product. Pure CSS, so it stays a Server Component and the
 * global reduced-motion rule freezes it for users who opt out.
 */
export default function Loading() {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center gap-5">
      <div className="relative size-12">
        <div
          aria-hidden
          className="absolute inset-0 rounded-full bg-signature/25 blur-xl"
        />
        <div
          aria-hidden
          className="size-12 animate-spin rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, var(--signature), var(--signature-2))",
            WebkitMask:
              "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
            mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
            animationDuration: "0.9s",
          }}
        />
      </div>
      <span className="text-sm tracking-wide text-muted-foreground">
        Synthesizing…
      </span>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
