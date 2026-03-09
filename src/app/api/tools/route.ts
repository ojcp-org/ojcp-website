import { NextResponse } from "next/server";
import {
  searchJobs,
  getJobDetail,
  getEmployerContext,
  beginApplication,
  checkApplicationStatus,
} from "@/lib/ojcp-tools";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Simple REST wrapper for the playground UI.
// POST /api/tools with { tool: "search_jobs", arguments: { ... } }
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tool, arguments: args } = body;

    if (!tool || !args) {
      return NextResponse.json(
        { error: "Missing 'tool' or 'arguments' in request body" },
        { status: 400, headers: cors }
      );
    }

    let result: unknown;

    switch (tool) {
      case "search_jobs":
        result = searchJobs(args);
        break;
      case "get_job_detail":
        result = getJobDetail(args);
        break;
      case "get_employer_context":
        result = getEmployerContext(args);
        break;
      case "begin_application":
        result = beginApplication(args);
        break;
      case "check_application_status":
        result = checkApplicationStatus(args);
        break;
      default:
        return NextResponse.json(
          {
            error: "unknown_tool",
            message: `Unknown tool: ${tool}. Available: search_jobs, get_job_detail, get_employer_context, begin_application, check_application_status`,
          },
          { status: 400, headers: cors }
        );
    }

    return NextResponse.json(result, { headers: cors });
  } catch (err) {
    return NextResponse.json(
      { error: "invalid_request", message: String(err) },
      { status: 400, headers: cors }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: cors });
}
