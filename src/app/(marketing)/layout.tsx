import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SkipLink } from "@/components/layout/skip-link";
import { ScrollProgress } from "@/components/shared";

/**
 * Marketing shell. Wraps every public page in the header/footer chrome, plus
 * two page-wide ambient layers: `.aurora-veil` (one continuous, slowly
 * drifting glow, rather than a gradient repeated per section — it's what
 * makes scrolling through the page read as one continuous space instead of a
 * stack of seams) and `.grain-veil` (a static film-grain texture that keeps
 * large dark surfaces from reading as flat digital gradient). Both are pure
 * CSS, so this stays a Server Component; `ScrollProgress` is the one client
 * island, isolated to its own leaf.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div
        aria-hidden
        className="aurora-veil pointer-events-none fixed inset-0 -z-10"
      />
      <div
        aria-hidden
        className="grain-veil pointer-events-none fixed inset-0 z-30"
      />
      <ScrollProgress />
      <SkipLink />
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
