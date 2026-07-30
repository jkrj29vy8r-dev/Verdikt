import { cn } from "@/lib/utils";

/**
 * SkipLink — lets keyboard and screen-reader users jump straight to the main
 * content, bypassing the header/nav. Visually hidden until focused, then it
 * appears as a standard focus affordance. Points at an element that must carry
 * a matching `id` (default `#main-content`).
 *
 * Accessibility First: mount this as the first focusable element in any layout
 * that has a persistent header.
 */
export function SkipLink({
  targetId = "main-content",
  className,
}: {
  targetId?: string;
  className?: string;
}) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        "sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:rounded-md focus-visible:bg-primary focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-primary-foreground focus-visible:shadow-lg focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      Skip to content
    </a>
  );
}
