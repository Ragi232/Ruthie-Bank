import { NextResponse } from "next/server";
import { consumeOtp, hashPassword, allowAuthAttempt } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { passwordResetCompleteSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = passwordResetCompleteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: { code: "INVALID_INPUT", message: "Check your email, code, and new password." } }, { status: 400 });
  const { email: rawEmail, code, password } = parsed.data;
  const email = rawEmail.toLowerCase();
  if (!(await allowAuthAttempt(request, email))) return NextResponse.json({ error: { code: "RATE_LIMITED", message: "Too many attempts. Try again later." } }, { status: 429 });
  const user = await consumeOtp(email, code, "RESET_PASSWORD");
  if (!user) return NextResponse.json({ error: { code: "INVALID_CHALLENGE", message: "The reset code is invalid or expired." } }, { status: 400 });
  const passwordHash = await hashPassword(password);
  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { passwordHash } }),
    prisma.authSession.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } }),
  ]);
  return NextResponse.json({ message: "Password updated. Sign in with your new password." });
}
