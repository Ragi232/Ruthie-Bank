import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  return user
    ? NextResponse.json({ user }, { headers: { "Cache-Control": "no-store, private" } })
    : NextResponse.json({ error: { code: "UNAUTHENTICATED", message: "Sign in to continue." } }, { status: 401, headers: { "Cache-Control": "no-store, private" } });
}
