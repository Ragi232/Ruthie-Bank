import { NextResponse } from "next/server";
import { allowAuthAttempt, authConfigurationReady, createOtpChallenge } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { passwordResetStartSchema } from "@/lib/validation";
import { isSameOriginMutation } from "@/lib/security";

export async function POST(request: Request) {
  if (!isSameOriginMutation(request)) return NextResponse.json({ error: { code: "INVALID_ORIGIN", message: "This request origin is not allowed." } }, { status: 403 });
  if (!authConfigurationReady()) return NextResponse.json({ error: { code: "AUTH_NOT_CONFIGURED", message: "Password reset is not configured on this server." } }, { status: 503 });
  const parsed = passwordResetStartSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: { code: "INVALID_INPUT", message: "Enter a valid email address." } }, { status: 400 });
  const email = parsed.data.email.toLowerCase();
  if (!(await allowAuthAttempt(request, email))) return NextResponse.json({ error: { code: "RATE_LIMITED", message: "Too many attempts. Try again later." } }, { status: 429 });
  const user = await prisma.user.findUnique({ where: { email } });
  let developmentCode: string | undefined;
  if (user) developmentCode = (await createOtpChallenge(user.id, "RESET_PASSWORD")).developmentCode;
  return NextResponse.json({ message: "If the account exists, reset instructions will be sent when a delivery provider is connected.", ...(developmentCode ? { developmentCode } : {}) }, { status: 202 });
}
