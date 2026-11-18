import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { authConfigurationReady, createOtpChallenge, hashPassword, allowAuthAttempt } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registrationSchema } from "@/lib/validation";

export async function POST(request: Request) {
  if (!authConfigurationReady()) return NextResponse.json({ error: { code: "AUTH_NOT_CONFIGURED", message: "Account verification is not configured on this server." } }, { status: 503 });
  const parsed = registrationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: { code: "INVALID_INPUT", message: "Check your details and try again." } }, { status: 400 });
  const data = parsed.data;
  if (!(await allowAuthAttempt(request, data.email))) return NextResponse.json({ error: { code: "RATE_LIMITED", message: "Too many attempts. Try again later." } }, { status: 429 });
  const phone = data.phone.startsWith("+234") ? data.phone : `+234${data.phone.slice(1)}`;
  try {
    const user = await prisma.user.create({ data: { email: data.email, phone, firstName: data.firstName, lastName: data.lastName, passwordHash: await hashPassword(data.password) } });
    const challenge = await createOtpChallenge(user.id, "VERIFY_EMAIL");
    const verification = challenge.developmentCode
      ? { status: "developer_code", code: challenge.developmentCode }
      : { status: "delivery_unavailable" };
    return NextResponse.json({ message: "Your account is created and awaiting email verification.", verification }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: { code: "ACCOUNT_EXISTS", message: "An account could not be created with those details." } }, { status: 409 });
    }
    return NextResponse.json({ error: { code: "REGISTRATION_FAILED", message: "We could not create your account right now." } }, { status: 500 });
  }
}
