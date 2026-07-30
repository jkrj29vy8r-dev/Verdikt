"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

/**
 * Root error boundary. Catches unhandled errors in the route tree and offers a
 * recovery path. Client Component by requirement (`reset` is a client action).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Wire to your observability sink (Sentry, Logflare) here.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold">Something went wrong.</h1>
        <p className="max-w-md text-muted-foreground">
          An unexpected error occurred while rendering this page. You can try
          again — if it persists, our team has been notified.
        </p>
        {error.digest ? (
          <p className="font-mono text-xs text-muted-foreground/70">
            Ref: {error.digest}
          </p>
        ) : null}
      </div>
      <Button variant="signature" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
