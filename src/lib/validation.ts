import { z } from "zod";

export const registrationSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  phone: z.string().trim().regex(/^\+234[0-9]{10}$|^0[0-9]{10}$/, "Use a Nigerian mobile number"),
  password: z.string().min(12).max(128)
    .regex(/[a-z]/, "Password needs a lowercase letter")
    .regex(/[A-Z]/, "Password needs an uppercase letter")
    .regex(/[0-9]/, "Password needs a number"),
});

export const idempotencyKeySchema = z.string().uuid();

export const loginSchema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(128) });
export const emailChallengeSchema = z.object({ email: z.string().trim().email().max(254), code: z.string().regex(/^\d{6}$/) });
export const passwordResetStartSchema = z.object({ email: z.string().trim().email().max(254) });
export const passwordResetCompleteSchema = emailChallengeSchema.extend({ password: registrationSchema.shape.password });
