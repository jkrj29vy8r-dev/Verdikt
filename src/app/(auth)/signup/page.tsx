import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthForm } from "@/features/auth";
import { getUser } from "@/features/auth/server";

export const metadata: Metadata = { title: "Create account" };

/** Sign-up page. Reuses the shared AuthForm in sign-up mode. */
export default async function SignupPage() {
  if (await getUser()) redirect("/dashboard");
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold tracking-tight">
        Create your account
      </h1>
      <AuthForm mode="sign-up" />
    </div>
  );
}
