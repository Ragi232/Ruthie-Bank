import { NextResponse } from "next/server";
import { allowAuthAttempt, hashPassword, setSessionCookie, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: { code: "INVALID_INPUT", message: "Enter a valid email and password." } }, { status: 400 });
  const email = parsed.data.email.toLowerCase();
  if (!(await allowAuthAttempt(request, email))) return NextResponse.json({ error: { code: "RATE_LIMITED", message: "Too many attempts. Try again later." } }, { status: 429 });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) await hashPassword(parsed.data.password); // Keep unknown-email attempts expensive too.
  const passwordValid = user ? await verifyPassword(parsed.data.password, user.passwordHash) : false;
  if (!user || !passwordValid || user.status !== "ACTIVE" || !user.emailVerifiedAt) {
    return NextResponse.json({ error: { code: "SIGN_IN_FAILED", message: "Email or password is incorrect, or the account is not verified." } }, { status: 401 });
  }
  await setSessionCookie(user.id);
  return NextResponse.json({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
}
