"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { clientEnv } from "@/config/env";
import { err, type Result } from "@/types/common";

import { credentialsSchema } from "./schema";

/**
 * Auth server actions. Thin wrappers over Supabase Auth that validate input and
 * return typed Results so forms can render inline errors. Success paths redirect
 * server-side, so the browser never holds a half-authenticated state.
 */

/** Sign in with email + password. */
export async function signIn(input: unknown): Promise<Result<never, string>> {
  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) {
    return err(parsed.error.issues[0]?.message ?? "Invalid credentials.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return err(error.message);

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/** Create an account. The `handle_new_user` DB trigger provisions the profile. */
export async function signUp(input: unknown): Promise<Result<never, string>> {
  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) {
    return err(parsed.error.issues[0]?.message ?? "Invalid credentials.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    ...parsed.data,
    options: {
      emailRedirectTo: `${clientEnv.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });
  if (error) return err(error.message);

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/** Sign out and return to the landing page. */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
