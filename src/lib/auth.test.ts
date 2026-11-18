import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { loginSchema, registrationSchema } from "@/lib/validation";

describe("password authentication primitives", () => {
  it("hashes passwords with a unique salt and verifies them", async () => {
    const first = await hashPassword("VeryStrongPassword2026");
    const second = await hashPassword("VeryStrongPassword2026");

    expect(first).not.toBe(second);
    expect(await verifyPassword("VeryStrongPassword2026", first)).toBe(true);
    expect(await verifyPassword("DifferentPassword2026", first)).toBe(false);
  });

  it("rejects malformed password hash records", async () => {
    await expect(verifyPassword("anything", "not-a-password-hash")).resolves.toBe(false);
  });
});

describe("auth request validation", () => {
  it("normalizes email and accepts Nigerian phone formats", () => {
    const parsed = registrationSchema.parse({
      firstName: "Ruthie", lastName: "Adebayo", email: "RUTHIE@example.com",
      phone: "08012345678", password: "VeryStrongPassword2026",
    });
    expect(parsed.email).toBe("ruthie@example.com");
    expect(parsed.phone).toBe("08012345678");
  });

  it("rejects short passwords and non-Nigerian phone values", () => {
    const base = { firstName: "Ruthie", lastName: "Adebayo", email: "ruthie@example.com", password: "weak" };
    expect(registrationSchema.safeParse({ ...base, phone: "08012345678" }).success).toBe(false);
    expect(registrationSchema.safeParse({ ...base, password: "VeryStrongPassword2026", phone: "+14155550123" }).success).toBe(false);
  });

  it("accepts a well-formed login request", () => {
    expect(loginSchema.safeParse({ email: "ruthie@example.com", password: "any submitted value" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "not-an-email", password: "x" }).success).toBe(false);
  });
});
