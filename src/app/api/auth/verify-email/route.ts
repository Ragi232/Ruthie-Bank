import { NextResponse } from "next/server";
import { consumeOtpAnd, setSessionCookie, allowAuthAttempt } from "@/lib/auth";
import { emailChallengeSchema } from "@/lib/validation";
import { isSameOriginMutation } from "@/lib/security";

export async function POST(request: Request) {
  if (!isSameOriginMutation(request)) return NextResponse.json({ error: { code: "INVALID_ORIGIN", message: "This request origin is not allowed." } }, { status: 403 });
  const parsed = emailChallengeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: { code: "INVALID_INPUT", message: "Enter your email and six-digit verification code." } }, { status: 400 });
  const email = parsed.data.email.toLowerCase();
  if (!(await allowAuthAttempt(request, email))) return NextResponse.json({ error: { code: "RATE_LIMITED", message: "Too many attempts. Try again later." } }, { status: 429 });
  const userId = await consumeOtpAnd(email, parsed.data.code, "VERIFY_EMAIL", async (tx, user) => {
    if (user.status !== "PENDING_VERIFICATION") throw new Error("ACCOUNT_NOT_PENDING_VERIFICATION");
    await tx.user.update({ where: { id: user.id }, data: { emailVerifiedAt: new Date(), status: "ACTIVE" } });
    const account = await tx.account.create({ data: { userId: user.id, label: "Personal account", status: "ACTIVE" } });
    await tx.wallet.create({ data: { accountId: account.id, currency: "NGN" } });
    return user.id;
  });
  if (!userId) return NextResponse.json({ error: { code: "INVALID_CHALLENGE", message: "The verification code is invalid or expired." } }, { status: 400 });
  await setSessionCookie(userId);
  return NextResponse.json({ message: "Email verified. Your sandbox profile is ready." });
}
