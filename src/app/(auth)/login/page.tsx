import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthForm } from "@/features/auth";
import { getUser } from "@/features/auth/server";

export const metadata: Metadata = { title: "Sign in" };

/** Sign-in page. Already-authenticated users are bounced to the dashboard. */
export default async function LoginPage() {
  if (await getUser()) redirect("/dashboard");
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
      <AuthForm mode="sign-in" />
    </div>
  );
}
