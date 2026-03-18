"use client";

import { useEffect } from "react";

/**
 * Registers OJCP tools via the WebMCP imperative API (navigator.modelContext).
 * When Chrome 146+ with the WebMCP flag is enabled, browser-native agents
 * can discover and call these tools directly from the page.
 */
export function WebMCPProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("modelContext" in window.navigator)) return;

    const mc = window.navigator.modelContext!;

    // ── search_jobs ──
    mc.registerTool({
      name: "search_jobs",
      description:
        "Search for open job opportunities on the OJCP reference provider. Returns ranked jobs with optional fit scoring when candidate context is provided.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "Natural language search query, e.g. 'senior backend engineer remote'",
          },
          remote_ok: {
            type: "string",
            enum: ["true", "false"],
            description: "Filter for remote-friendly positions",
          },
        },
        required: ["query"],
      },
      execute: async (params) => {
        const res = await fetch("/api/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tool: "search_jobs",
            arguments: {
              query: params.query as string,
              location: {
                remote_ok: params.remote_ok === "true",
              },
            },
          }),
        });
        const data = await res.json();
        return {
          content: [
            {
              type: "text" as const,
              text: `Found ${data.total} matching jobs.`,
            },
            { type: "json" as const, data },
          ],
        };
      },
    });

    // ── get_job_detail ──
    mc.registerTool({
      name: "get_job_detail",
      description:
        "Get full details for a specific job posting including responsibilities, qualifications, compensation, team context, and apply paths.",
      inputSchema: {
        type: "object",
        properties: {
          job_id: {
            type: "string",
            description:
              "The OJCP job identifier, e.g. 'acme:sbe-2026-001'",
          },
        },
        required: ["job_id"],
      },
      execute: async (params) => {
        const res = await fetch("/api/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tool: "get_job_detail",
            arguments: {
              job_id: params.job_id,
              include_employer_context: true,
            },
          }),
        });
        const data = await res.json();
        return {
          content: [{ type: "json" as const, data }],
        };
      },
    });

    // ── get_employer_context ──
    mc.registerTool({
      name: "get_employer_context",
      description:
        "Get information about an employer including culture, benefits, team structure, and hiring practices. Available employers: acme, globex, initech.",
      inputSchema: {
        type: "object",
        properties: {
          employer_id: {
            type: "string",
            description: "Employer identifier: 'acme', 'globex', or 'initech'",
          },
        },
        required: ["employer_id"],
      },
      execute: async (params) => {
        const res = await fetch("/api/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tool: "get_employer_context",
            arguments: { employer_id: params.employer_id },
          }),
        });
        const data = await res.json();
        return {
          content: [{ type: "json" as const, data }],
        };
      },
    });

    // ── begin_application ──
    mc.registerTool({
      name: "begin_application",
      description:
        "Start a job application. Returns the apply path, required fields, and a session token. This is a mock endpoint for demonstration.",
      inputSchema: {
        type: "object",
        properties: {
          job_id: {
            type: "string",
            description: "The OJCP job identifier to apply for",
          },
        },
        required: ["job_id"],
      },
      execute: async (params) => {
        const res = await fetch("/api/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tool: "begin_application",
            arguments: {
              job_id: params.job_id,
              agent_declaration: {
                agent_id: "dev.ojcp.webmcp-demo",
                acting_on_behalf_of: "human_user",
                interaction_mode: "assisted",
              },
            },
          }),
        });
        const data = await res.json();
        return {
          content: [
            {
              type: "text" as const,
              text: `Application session created: ${data.application_id || "error"}`,
            },
            { type: "json" as const, data },
          ],
        };
      },
    });

    // ── find_ojcp_providers (registry) ──
    mc.registerTool({
      name: "find_ojcp_providers",
      description:
        "Find OJCP-compliant job data providers by industry, location, or employer name. Use this to discover which employers and job boards support the OJCP protocol.",
      inputSchema: {
        type: "object",
        properties: {
          industry: {
            type: "string",
            description: "Industry to search for (e.g. 'technology', 'healthcare')",
          },
          employer_name: {
            type: "string",
            description: "Provider or employer name to search for",
          },
          location: {
            type: "string",
            description: "Location filter (city, state, or country)",
          },
          has_agent_apply: {
            type: "string",
            enum: ["true", "false"],
            description: "Filter for providers supporting agent apply",
          },
        },
      },
      execute: async (params) => {
        const res = await fetch("/api/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tool: "find_ojcp_providers",
            arguments: {
              industry: params.industry,
              employer_name: params.employer_name,
              location: params.location,
              has_agent_apply: params.has_agent_apply === "true" ? true : undefined,
            },
          }),
        });
        const data = await res.json();
        return {
          content: [
            {
              type: "text" as const,
              text: `Found ${data.total_results} OJCP providers.`,
            },
            { type: "json" as const, data },
          ],
        };
      },
    });

    // Cleanup on unmount
    return () => {
      if (!("modelContext" in window.navigator)) return;
      const ctx = window.navigator.modelContext!;
      ctx.unregisterTool("search_jobs");
      ctx.unregisterTool("get_job_detail");
      ctx.unregisterTool("get_employer_context");
      ctx.unregisterTool("begin_application");
      ctx.unregisterTool("find_ojcp_providers");
    };
  }, []);

  return null;
}
