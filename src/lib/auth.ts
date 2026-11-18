import { createHash, createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const scrypt = promisify(scryptCallback) as (password: string, salt: Buffer, keylen: number, options: { N: number; r: number; p: number; maxmem: number }) => Promise<Buffer>;
const SESSION_COOKIE = "ruthie_session";
const SESSION_HOURS = 12;
const SCRYPT = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

function authSecret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error("AUTH_SECRET must be configured with at least 32 characters");
  return value;
}

export function authConfigurationReady() {
  return Boolean(process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 32);
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derivedKey = await scrypt(password, salt, 64, SCRYPT);
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString("base64url")}$${derivedKey.toString("base64url")}`;
}

export async function verifyPassword(password: string, encoded: string) {
  const [scheme, n, r, p, saltText, keyText] = encoded.split("$");
  if (scheme !== "scrypt" || !saltText || !keyText || Number(n) !== SCRYPT.N || Number(r) !== SCRYPT.r || Number(p) !== SCRYPT.p) return false;
  const salt = Buffer.from(saltText, "base64url");
  const expected = Buffer.from(keyText, "base64url");
  if (expected.length !== 64) return false;
  const actual = await scrypt(password, salt, expected.length, SCRYPT);
  return timingSafeEqual(actual, expected);
}

export function hashOpaque(value: string) { return createHash("sha256").update(value).digest("hex"); }

export function hashOtp(code: string, userId: string, purpose: string) {
  return createHmac("sha256", authSecret()).update(`${userId}:${purpose}:${code}`).digest("hex");
}

export async function createOtpChallenge(userId: string, purpose: "VERIFY_EMAIL" | "RESET_PASSWORD" | "LOGIN_STEP_UP") {
  const code = String(randomBytes(4).readUInt32BE(0) % 1_000_000).padStart(6, "0");
  const challenge = await prisma.otpChallenge.create({
    data: { userId, purpose, codeHash: hashOtp(code, userId, purpose), expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
  });
  // Only expose a challenge code when a developer explicitly opts into local testing.
  const expose = process.env.APP_ENV === "sandbox" && process.env.NODE_ENV !== "production" && process.env.EXPOSE_DEV_OTP === "true";
  return { challengeId: challenge.id, developmentCode: expose ? code : undefined };
}

export async function setSessionCookie(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiry = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  const forwarded = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim();
  const userAgent = (await headers()).get("user-agent")?.slice(0, 512);
  await prisma.authSession.create({
    data: {
      userId,
      tokenHash: hashOpaque(token),
      expiresAt: expiry,
      ipHash: forwarded ? hashOpaque(forwarded) : undefined,
      userAgent,
    },
  });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: expiry,
  });
}

export async function getCurrentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.authSession.findUnique({ where: { tokenHash: hashOpaque(token) }, include: { user: true } });
  if (!session || session.revokedAt || session.expiresAt <= new Date() || session.user.status !== "ACTIVE") return null;
  return { id: session.user.id, email: session.user.email, firstName: session.user.firstName, lastName: session.user.lastName };
}

export async function revokeCurrentSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await prisma.authSession.updateMany({ where: { tokenHash: hashOpaque(token), revokedAt: null }, data: { revokedAt: new Date() } });
  store.set(SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", expires: new Date(0) });
}

export async function allowAuthAttempt(request: Request, identity: string) {
  const forwarded = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const windowMs = 15 * 60 * 1000;
  const windowStart = new Date(Math.floor(Date.now() / windowMs) * windowMs);
  const identifiers = [hashOpaque(`ip:${forwarded}`), hashOpaque(`identity:${identity.toLowerCase()}`)];
  const rows = await Promise.all(identifiers.map((identifierHash) => prisma.authRateLimit.upsert({
    where: { identifierHash_windowStart: { identifierHash, windowStart } },
    create: { identifierHash, windowStart, count: 1 },
    update: { count: { increment: 1 } },
  })));
  return rows.every((row) => row.count <= 10);
}

export async function consumeOtp(email: string, code: string, purpose: "VERIFY_EMAIL" | "RESET_PASSWORD") {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const challenge = await prisma.otpChallenge.findFirst({
    where: { userId: user.id, purpose, consumedAt: null, expiresAt: { gt: new Date() }, attempts: { lt: 5 } },
    orderBy: { createdAt: "desc" },
  });
  if (!challenge) return null;
  const supplied = Buffer.from(hashOtp(code, user.id, purpose), "hex");
  const expected = Buffer.from(challenge.codeHash, "hex");
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    await prisma.otpChallenge.updateMany({ where: { id: challenge.id, consumedAt: null, attempts: { lt: 5 } }, data: { attempts: { increment: 1 } } });
    return null;
  }
  const consumed = await prisma.otpChallenge.updateMany({ where: { id: challenge.id, consumedAt: null, expiresAt: { gt: new Date() }, attempts: { lt: 5 } }, data: { consumedAt: new Date() } });
  return consumed.count === 1 ? user : null;
}
