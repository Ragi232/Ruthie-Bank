import { NextResponse } from "next/server";
import { revokeCurrentSession } from "@/lib/auth";
import { isSameOriginMutation } from "@/lib/security";

export async function POST(request: Request) {
  if (!isSameOriginMutation(request)) return NextResponse.json({ error: { code: "INVALID_ORIGIN", message: "This request origin is not allowed." } }, { status: 403 });
  await revokeCurrentSession();
  return NextResponse.json({ message: "Signed out." });
}
