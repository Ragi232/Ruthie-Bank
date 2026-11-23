import { NextResponse } from "next/server";
import { consumeOtpAnd, hashPassword, allowAuthAttempt } from "@/lib/auth";
import { passwordResetCompleteSchema } from "@/lib/validation";
import { isSameOriginMutation } from "@/lib/security";

export async function POST(request: Request) {
  if (!isSameOriginMutation(request)) return NextResponse.json({ error: { code: "INVALID_ORIGIN", message: "This request origin is not allowed." } }, { status: 403 });
  const parsed = passwordResetCompleteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: { code: "INVALID_INPUT", message: "Check your email, code, and new password." } }, { status: 400 });
  const { email: rawEmail, code, password } = parsed.data;
  const email = rawEmail.toLowerCase();
  if (!(await allowAuthAttempt(request, email))) return NextResponse.json({ error: { code: "RATE_LIMITED", message: "Too many attempts. Try again later." } }, { status: 429 });
  const passwordHash = await hashPassword(password);
  const updated = await consumeOtpAnd(email, code, "RESET_PASSWORD", async (tx, user) => {
    await tx.user.update({ where: { id: user.id }, data: { passwordHash } });
    await tx.authSession.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } });
    return true;
  });
  if (!updated) return NextResponse.json({ error: { code: "INVALID_CHALLENGE", message: "The reset code is invalid or expired." } }, { status: 400 });
  return NextResponse.json({ message: "Password updated. Sign in with your new password." });
}
