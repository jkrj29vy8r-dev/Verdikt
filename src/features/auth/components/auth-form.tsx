"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signIn, signUp } from "../actions";
import type { AuthMode } from "../schema";

const COPY: Record<
  AuthMode,
  { title: string; cta: string; alt: string; altHref: string; altLabel: string }
> = {
  "sign-in": {
    title: "Welcome back",
    cta: "Sign in",
    alt: "New to Verdikt?",
    altHref: "/signup",
    altLabel: "Create an account",
  },
  "sign-up": {
    title: "Create your account",
    cta: "Create account",
    alt: "Already have an account?",
    altHref: "/login",
    altLabel: "Sign in",
  },
};

/**
 * AuthForm — one form, both modes. The `mode` prop selects copy and action, so
 * /login and /signup reuse the exact same control. Server actions return typed
 * Results; success redirects server-side, failure surfaces a toast.
 */
export function AuthForm({ mode }: { mode: AuthMode }) {
  const [isPending, startTransition] = React.useTransition();
  const copy = COPY[mode];

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const input = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    startTransition(async () => {
      const action = mode === "sign-in" ? signIn : signUp;
      const result = await action(input);
      // Only reached on failure — success redirects server-side.
      if (result && !result.ok) toast.error(result.error);
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete={
            mode === "sign-in" ? "current-password" : "new-password"
          }
          placeholder="••••••••"
          required
        />
      </div>

      <Button
        type="submit"
        variant="signature"
        size="lg"
        disabled={isPending}
        className="mt-1 w-full"
      >
        {isPending ? <Loader2 className="size-4 animate-spin" /> : copy.cta}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {copy.alt}{" "}
        <Link
          href={copy.altHref}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          {copy.altLabel}
        </Link>
      </p>
    </form>
  );
}
