import { afterAll, beforeAll, describe, expect, it } from "vitest";

const databaseUrl = process.env.AUTH_TEST_DATABASE_URL;
const integration = databaseUrl ? describe : describe.skip;

integration("PostgreSQL OTP and password reset", () => {
  let prisma: typeof import("@/lib/prisma").prisma;
  let consumeOtpAnd: typeof import("@/lib/auth").consumeOtpAnd;
  let hashOtp: typeof import("@/lib/auth").hashOtp;
  let userId: string;
  let email: string;
  let challengeId: string;
  let sessionId: string;

  beforeAll(async () => {
    process.env.DATABASE_URL = databaseUrl;
    process.env.AUTH_SECRET ??= "integration-test-secret-at-least-32-characters";
    ({ prisma } = await import("@/lib/prisma"));
    ({ consumeOtpAnd, hashOtp } = await import("@/lib/auth"));
    const user = await prisma.user.create({
      data: { email: `otp-${crypto.randomUUID()}@example.test`, firstName: "Test", lastName: "User", passwordHash: "old-hash", status: "ACTIVE" },
    });
    userId = user.id;
    email = user.email;
    const challenge = await prisma.otpChallenge.create({
      data: { userId, purpose: "RESET_PASSWORD", codeHash: hashOtp("123456", userId, "RESET_PASSWORD"), expiresAt: new Date(Date.now() + 60_000) },
    });
    challengeId = challenge.id;
    const session = await prisma.authSession.create({ data: { userId, tokenHash: `test-${crypto.randomUUID()}`, expiresAt: new Date(Date.now() + 60_000) } });
    sessionId = session.id;
  });

  afterAll(async () => {
    if (userId) await prisma.user.delete({ where: { id: userId } });
    if (prisma) await prisma.$disconnect();
  });

  it("rolls back challenge consumption if the protected operation fails", async () => {
    await expect(consumeOtpAnd(email, "123456", "RESET_PASSWORD", async (tx, user) => {
      await tx.user.update({ where: { id: user.id }, data: { passwordHash: "new-hash" } });
      throw new Error("simulated operation failure");
    })).rejects.toThrow("simulated operation failure");

    const [challenge, user] = await Promise.all([
      prisma.otpChallenge.findUniqueOrThrow({ where: { id: challengeId } }),
      prisma.user.findUniqueOrThrow({ where: { id: userId } }),
    ]);
    expect(challenge.consumedAt).toBeNull();
    expect(user.passwordHash).toBe("old-hash");
  });

  it("consumes an OTP once, changes the password, and revokes active sessions", async () => {
    const results = await Promise.all([
      consumeOtpAnd(email, "123456", "RESET_PASSWORD", async (tx, user) => {
        await tx.user.update({ where: { id: user.id }, data: { passwordHash: "new-hash" } });
        await tx.authSession.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } });
        return true;
      }),
      consumeOtpAnd(email, "123456", "RESET_PASSWORD", async () => true),
    ]);

    expect(results.filter(Boolean)).toHaveLength(1);
    const [challenge, user, session] = await Promise.all([
      prisma.otpChallenge.findUniqueOrThrow({ where: { id: challengeId } }),
      prisma.user.findUniqueOrThrow({ where: { id: userId } }),
      prisma.authSession.findUniqueOrThrow({ where: { id: sessionId } }),
    ]);
    expect(challenge.consumedAt).toBeInstanceOf(Date);
    expect(user.passwordHash).toBe("new-hash");
    expect(session.revokedAt).toBeInstanceOf(Date);
  });
});
