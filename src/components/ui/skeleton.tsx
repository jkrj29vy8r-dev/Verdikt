import { cn } from "@/lib/utils";

/** Skeleton — content placeholder for loading states. Pair with Suspense
 * boundaries so perceived performance stays high. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("shimmer rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
