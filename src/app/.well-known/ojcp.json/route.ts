import { NextResponse } from "next/server";

const manifest = {
  ojcp_version: "0.1",
  provider: {
    name: "OJCP Reference Provider",
    url: "https://ojcp.dev",
    contact_email: "hello@ojcp.dev",
    description:
      "A reference OJCP provider serving mock job data for testing and demonstration. This is the official OJCP dogfood endpoint.",
  },
  mcp_endpoint: "https://ojcp.dev/api/mcp",
  tools: [
    "search_jobs",
    "get_job_detail",
    "get_employer_context",
    "begin_application",
    "check_application_status",
  ],
  feed_endpoints: {
    jobs: "https://ojcp.dev/api/jobs",
  },
  apply_paths: ["adaptive_apply", "apply_anywhere", "ats_direct"],
  auth: {
    type: "none",
    note: "This reference provider requires no authentication.",
  },
  rate_limits: {
    requests_per_minute: 60,
    requests_per_day: 10000,
  },
};

export async function GET() {
  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
