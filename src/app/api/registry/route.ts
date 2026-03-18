import { NextRequest, NextResponse } from "next/server";
import { findOjcpProviders } from "@/lib/registry-tools";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const result = findOjcpProviders({
    industry: searchParams.get("industry") ?? undefined,
    employer_name: searchParams.get("employer_name") ?? undefined,
    location: searchParams.get("location") ?? undefined,
    has_agent_apply:
      searchParams.get("has_agent_apply") === "true"
        ? true
        : searchParams.get("has_agent_apply") === "false"
          ? false
          : undefined,
  });

  return NextResponse.json(result, { headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
