import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Auth shell — a centered, focused surface for sign-in and sign-up, isolated
 * from marketing/app chrome so the only actions are the ones that matter.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-signature/10 via-transparent to-transparent"
      />
      <Link href="/" className="mb-8">
        <Logo />
      </Link>
      <Card className="w-full max-w-sm">
        <CardContent className="pt-2">{children}</CardContent>
      </Card>
    </div>
  );
}
