import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";

/** Global 404. Rendered for any unmatched route or `notFound()` call. */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <Logo />
      <div className="flex flex-col gap-2">
        <p className="text-6xl font-semibold tracking-tight text-signature">
          404
        </p>
        <h1 className="text-xl font-semibold">This page took a wrong turn.</h1>
        <p className="text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
      </div>
      <Button variant="signature" asChild>
        <Link href="/">Back home</Link>
      </Button>
    </div>
  );
}
