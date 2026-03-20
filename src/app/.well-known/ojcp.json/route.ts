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
    "submit_application",
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
    anonymous_rps: 10,
    authenticated_rps: 100,
  },
  // supported_verifiers: No confirmed verifier partnerships yet.
  // Uncomment when ID.me / Checkr / Clear integrations are confirmed.
  // supported_verifiers: [
  //   {
  //     verifier_id: "id.me",
  //     verifier_name: "ID.me",
  //     verifier_manifest_url: "https://id.me/.well-known/ojcp-verifier.json",
  //     verification_types: ["identity", "government_id"],
  //     required_for_paths: ["adaptive_apply"],
  //   },
  //   {
  //     verifier_id: "checkr",
  //     verifier_name: "Checkr",
  //     verifier_manifest_url: "https://checkr.com/.well-known/ojcp-verifier.json",
  //     verification_types: ["background_check"],
  //     required_for_paths: ["adaptive_apply"],
  //   },
  // ],
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
