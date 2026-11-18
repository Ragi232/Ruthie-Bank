import { NextResponse } from "next/server";
import { consumeOtp, setSessionCookie, allowAuthAttempt } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { emailChallengeSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = emailChallengeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: { code: "INVALID_INPUT", message: "Enter your email and six-digit verification code." } }, { status: 400 });
  const email = parsed.data.email.toLowerCase();
  if (!(await allowAuthAttempt(request, email))) return NextResponse.json({ error: { code: "RATE_LIMITED", message: "Too many attempts. Try again later." } }, { status: 429 });
  const user = await consumeOtp(email, parsed.data.code, "VERIFY_EMAIL");
  if (!user || user.status !== "PENDING_VERIFICATION") return NextResponse.json({ error: { code: "INVALID_CHALLENGE", message: "The verification code is invalid or expired." } }, { status: 400 });
  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: user.id }, data: { emailVerifiedAt: new Date(), status: "ACTIVE" } });
    const account = await tx.account.create({ data: { userId: user.id, label: "Personal account", status: "ACTIVE" } });
    await tx.wallet.create({ data: { accountId: account.id, currency: "NGN" } });
  });
  await setSessionCookie(user.id);
  return NextResponse.json({ message: "Email verified. Your sandbox profile is ready." });
}
