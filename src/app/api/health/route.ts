import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    environment: process.env.APP_ENV ?? "sandbox",
    financialOperations: "sandbox-unavailable",
  });
}
