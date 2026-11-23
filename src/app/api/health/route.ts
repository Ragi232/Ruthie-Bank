import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      database: "ready",
      environment: process.env.APP_ENV ?? "sandbox",
      financialOperations: "unavailable",
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({
      status: "unavailable",
      database: "unavailable",
      environment: process.env.APP_ENV ?? "sandbox",
      financialOperations: "unavailable",
    }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
