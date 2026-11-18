import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    user: { findUnique: vi.fn() },
    otpChallenge: { findFirst: vi.fn(), updateMany: vi.fn() },
    $transaction: vi.fn(),
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("next/headers", () => ({ cookies: vi.fn(), headers: vi.fn() }));

import { consumeOtpAnd, hashOtp } from "@/lib/auth";

const user = { id: "user_1", email: "ruthie@example.com" };
const challenge = { id: "otp_1", codeHash: "", attempts: 0 };
const tx = {
  otpChallenge: { updateMany: vi.fn() },
};

describe("atomic OTP consumption", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.AUTH_SECRET = "test-secret-that-is-at-least-32-characters-long";
    prismaMock.user.findUnique.mockResolvedValue(user);
    prismaMock.otpChallenge.findFirst.mockResolvedValue(challenge);
    prismaMock.$transaction.mockImplementation(async (callback) => callback(tx));
    tx.otpChallenge.updateMany.mockResolvedValue({ count: 1 });
  });

  it("runs the protected action only after the challenge is claimed", async () => {
    challenge.codeHash = hashOtp("123456", user.id, "RESET_PASSWORD");
    const action = vi.fn().mockResolvedValue("done");

    await expect(consumeOtpAnd(user.email, "123456", "RESET_PASSWORD", action)).resolves.toBe("done");

    expect(prismaMock.$transaction).toHaveBeenCalledOnce();
    expect(tx.otpChallenge.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ id: challenge.id, consumedAt: null }),
      data: expect.objectContaining({ consumedAt: expect.any(Date) }),
    }));
    expect(action).toHaveBeenCalledWith(tx, user);
  });

  it("does not run the protected action when another request already consumed the challenge", async () => {
    challenge.codeHash = hashOtp("123456", user.id, "RESET_PASSWORD");
    tx.otpChallenge.updateMany.mockResolvedValue({ count: 0 });
    const action = vi.fn();

    await expect(consumeOtpAnd(user.email, "123456", "RESET_PASSWORD", action)).resolves.toBeNull();

    expect(action).not.toHaveBeenCalled();
  });

  it("records a failed attempt without entering the protected transaction", async () => {
    challenge.codeHash = hashOtp("654321", user.id, "RESET_PASSWORD");
    const action = vi.fn();

    await expect(consumeOtpAnd(user.email, "123456", "RESET_PASSWORD", action)).resolves.toBeNull();

    expect(prismaMock.otpChallenge.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ id: challenge.id, attempts: { lt: 5 } }),
      data: { attempts: { increment: 1 } },
    }));
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
    expect(action).not.toHaveBeenCalled();
  });
});
