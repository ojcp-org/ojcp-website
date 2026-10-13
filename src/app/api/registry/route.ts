import { NextRequest, NextResponse } from "next/server";
import { findOjcpProviders } from "@/lib/registry-tools";
import { RegistryUnavailableError } from "@/lib/registry-data";
import { TrustTierSchema } from "@/lib/schemas";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const minTier = searchParams.get("min_trust_tier");
  const parsedMinTier = minTier === null ? undefined : TrustTierSchema.safeParse(minTier);
  if (parsedMinTier && !parsedMinTier.success) {
    return NextResponse.json(
      {
        error: "invalid_request",
        message: `min_trust_tier must be one of: ${TrustTierSchema.options.join(", ")}`,
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  try {
    const result = await findOjcpProviders({
      industry: searchParams.get("industry") ?? undefined,
      employer_name: searchParams.get("employer_name") ?? undefined,
      location: searchParams.get("location") ?? undefined,
      has_agent_apply:
        searchParams.get("has_agent_apply") === "true"
          ? true
          : searchParams.get("has_agent_apply") === "false"
            ? false
            : undefined,
      min_trust_tier: parsedMinTier?.data,
    });
    return NextResponse.json(result, { headers: CORS_HEADERS });
  } catch (err) {
    if (!(err instanceof RegistryUnavailableError)) throw err;
    return NextResponse.json(
      { error: "registry_unavailable", message: err.message },
      { status: 503, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
