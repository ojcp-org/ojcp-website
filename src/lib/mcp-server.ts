import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  searchJobs,
  getJobDetail,
  getEmployerContext,
  beginApplication,
  checkApplicationStatus,
} from "./ojcp-tools";
import { z } from "zod/v4";

export function createOjcpServer() {
  const server = new McpServer({
    name: "ojcp-reference-provider",
    version: "0.1.0",
  });

  // ── search_jobs ──
  server.tool(
    "search_jobs",
    "Search for open job opportunities. Returns a ranked list of jobs matching the provided criteria. Pass candidate_context for personalized ranking.",
    {
      query: z.string().describe(
        "Natural language search query, e.g. 'senior backend engineer remote'"
      ),
      location: z
        .object({
          city: z.string().optional(),
          state: z.string().optional(),
          country: z.string().optional(),
          remote_ok: z.boolean().optional(),
          radius_miles: z.number().optional(),
        })
        .optional(),
      filters: z
        .object({
          employment_type: z
            .enum([
              "full_time",
              "part_time",
              "contract",
              "internship",
              "temporary",
            ])
            .optional(),
          salary_min: z.number().optional(),
          salary_max: z.number().optional(),
          experience_level: z
            .enum(["entry", "mid", "senior", "director", "executive"])
            .optional(),
          posted_within_days: z.number().optional(),
        })
        .optional(),
      candidate_context: z
        .object({
          ojcp_candidate_context_version: z.string().default("0.1"),
          consent_scope: z.enum(["search_and_match", "apply", "full_profile"]),
          skills: z.array(z.string()).optional(),
          years_experience: z.number().optional(),
        })
        .optional(),
      pagination: z
        .object({
          limit: z.number().max(50).default(10),
          offset: z.number().default(0),
        })
        .optional(),
    },
    async (params) => {
      const result = searchJobs(params);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );

  // ── get_job_detail ──
  server.tool(
    "get_job_detail",
    "Retrieve full details for a specific job posting, including responsibilities, qualifications, compensation, team context, and available apply paths.",
    {
      job_id: z.string().describe("The unique OJCP job identifier"),
      include_employer_context: z.boolean().default(true),
      candidate_context: z
        .object({
          ojcp_candidate_context_version: z.string().default("0.1"),
          consent_scope: z.enum(["search_and_match", "apply", "full_profile"]),
          skills: z.array(z.string()).optional(),
          years_experience: z.number().optional(),
        })
        .optional(),
    },
    async (params) => {
      const result = getJobDetail(params);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );

  // ── get_employer_context ──
  server.tool(
    "get_employer_context",
    "Retrieve contextual information about an employer including culture, team structure, benefits, and hiring practices.",
    {
      employer_id: z
        .string()
        .describe("The OJCP employer identifier (e.g. 'acme', 'globex', 'initech')"),
    },
    async (params) => {
      const result = getEmployerContext(params);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );

  // ── begin_application ──
  server.tool(
    "begin_application",
    "Initiate an application for a job. Returns an apply path descriptor including required fields, the preferred apply mechanism, and a session token for multi-step apply flows.",
    {
      job_id: z.string(),
      apply_path: z
        .enum([
          "ats_direct",
          "adaptive_apply",
          "apply_anywhere",
          "indeed_apply",
          "custom",
        ])
        .optional()
        .describe(
          "Preferred application mechanism. If omitted, the provider selects the optimal path."
        ),
      candidate_context: z
        .object({
          ojcp_candidate_context_version: z.string().default("0.1"),
          consent_scope: z.enum(["search_and_match", "apply", "full_profile"]),
          name: z.string().optional(),
          email: z.string().optional(),
          resume_url: z.string().optional(),
        })
        .optional(),
      agent_declaration: z
        .object({
          agent_id: z.string(),
          agent_version: z.string().optional(),
          acting_on_behalf_of: z.enum([
            "human_user",
            "recruiter",
            "autonomous_workflow",
          ]),
          interaction_mode: z
            .enum(["assisted", "autonomous", "supervised"])
            .optional(),
          user_consent_token: z.string().optional(),
        })
        .optional(),
    },
    async (params) => {
      const result = beginApplication(params);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );

  // ── check_application_status ──
  server.tool(
    "check_application_status",
    "Check the status of a previously initiated application.",
    {
      application_id: z
        .string()
        .describe(
          "The application session ID returned by begin_application"
        ),
    },
    async (params) => {
      const result = checkApplicationStatus(params);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );

  return server;
}
