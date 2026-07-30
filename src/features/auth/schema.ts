import { z } from "zod";

/** Shared credential validation for sign-in and sign-up. */
export const credentialsSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type Credentials = z.infer<typeof credentialsSchema>;

export type AuthMode = "sign-in" | "sign-up";
