"use client";

import { useState } from "react";
import {
  Container,
  Title,
  Text,
  Stack,
  Tabs,
  Box,
  Group,
  SegmentedControl,
  Badge,
} from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import { useSiteStore } from "@/store";
import classes from "./CodeExamples.module.css";

/* ── Discover ── */

const discoverManifest = `{
  "ojcp_version": "0.1",
  "provider": {
    "name": "Acme Careers",
    "employer_id": "acme",
    "description": "Global leader in industrial innovation",
    "industries": ["manufacturing", "engineering"],
    "hq_location": { "city": "Chicago", "state": "IL", "country": "US" }
  },
  "mcp_endpoint": "https://careers.acme.com/ojcp/mcp",
  "tools": [
    "search_jobs",
    "get_job_detail",
    "get_employer_context",
    "begin_application",
    "check_application_status"
  ],
  "apply_paths": ["ats_direct", "adaptive_apply"],
  "auth": {
    "required": true,
    "optional_scopes": ["apply", "candidate_data"]
  },
  "rate_limits": {
    "anonymous_rps": 10,
    "authenticated_rps": 50,
    "burst_limit": 100
  }
}`;

/* ── Search ── */

const searchRequest = `{
  "name": "search_jobs",
  "arguments": {
    "query": "senior backend engineer remote",
    "location": {
      "remote_ok": true,
      "country": "US"
    },
    "filters": {
      "employment_type": "full_time",
      "experience_level": "senior",
      "salary_min": 150000
    },
    "candidate_context": {
      "ojcp_candidate_context_version": "0.1",
      "consent_scope": "fit_scoring",
      "skills": ["Go", "Kubernetes", "PostgreSQL"],
      "experience_years": 8
    },
    "pagination": { "limit": 5 }
  }
}`;

const searchResponse = `{
  "total": 23,
  "offset": 0,
  "limit": 5,
  "jobs": [
    {
      "ojcp_id": "acme:sbe-2026-001",
      "title": "Senior Backend Engineer",
      "employer": {
        "name": "Acme Corp",
        "ojcp_employer_id": "acme"
      },
      "employmentType": "full_time",
      "experienceLevel": "senior",
      "datePosted": "2026-03-01",
      "baseSalary": {
        "currency": "USD",
        "minValue": 170000,
        "maxValue": 210000
      },
      "skills_required": ["Go", "PostgreSQL", "gRPC"],
      "requisition_id": "REQ-2026-0142",
      "department": "Engineering",
      "hiring_manager": "Dana Park",
      "remote_policy": "fully_remote",
      "fit_score": 0.91,
      "fit_rationale": "Strong overlap on Go and PostgreSQL.",
      "apply_paths": [
        {
          "type": "adaptive_apply",
          "supports_agent_submission": true,
          "url": "https://careers.acme.com/apply/sbe-2026-001",
          "required_fields": ["resume", "email", "name"],
          "estimated_completion_minutes": 2
        }
      ]
    }
  ]
}`;

/* ── Apply ── */

const applyRequest = `{
  "name": "begin_application",
  "arguments": {
    "job_id": "acme:sbe-2026-001",
    "apply_path": "adaptive_apply",
    "candidate_context": {
      "ojcp_candidate_context_version": "0.1",
      "consent_scope": "application_prefill",
      "skills": ["Go", "Kubernetes", "PostgreSQL"],
      "experience_years": 8,
      "current_title": "Staff Engineer",
      "work_authorization": "us_citizen"
    },
    "agent_declaration": {
      "agent_id": "com.example.jobagent",
      "agent_version": "2.1.0",
      "acting_on_behalf_of": "human_user",
      "interaction_mode": "assisted",
      "user_consent_token": "uct_abc123..."
    },
    "source_attribution": {
      "referrer": "indeed.com",
      "reference_id": "IND-2026-abc123"
    }
  }
}`;

const applyResponse = `{
  "application_id": "app_abc123",
  "status": "pending_verification",
  "apply_path": {
    "type": "adaptive_apply",
    "supports_agent_submission": true,
    "requires_verification": true,
    "accepted_verifiers": ["id.me"]
  },
  "verification_steps": [
    {
      "step_id": "vs_1",
      "type": "identity",
      "verifier_id": "id.me",
      "verifier_name": "ID.me",
      "proof_delivery": "agent_submitted",
      "verification_url": "https://verify.id.me/ojcp?session=xyz789",
      "human_required": true,
      "estimated_completion_minutes": 5,
      "instructions": "Complete identity verification via ID.me"
    }
  ],
  "screening_questions": [
    {
      "question_id": "work_auth",
      "question_text": "Are you authorized to work in the US?",
      "answer_type": "boolean",
      "required": true
    },
    {
      "question_id": "aml_experience",
      "question_text": "Years of AML/compliance experience?",
      "answer_type": "number",
      "required": true,
      "min": 0,
      "max": 50
    },
    {
      "question_id": "clearance",
      "question_text": "Do you hold any financial regulatory certifications?",
      "answer_type": "single_select",
      "options": ["CAMS", "CFE", "CRCM", "None"],
      "required": false
    }
  ],
  "session_token": "sess_def456",
  "expires_at": "2026-03-20T12:00:00Z"
}`;

/* ── Verify ── */

const verifyRequest = `{
  "name": "submit_application",
  "arguments": {
    "application_id": "app_abc123",
    "session_token": "sess_def456",
    "application_data": {
      "answers": {
        "work_auth": true,
        "clearance": "CAMS"
      },
      "resume_url": "https://example.com/jdoe-resume.pdf"
    },
    "verification_proofs": [
      {
        "step_id": "vs_1",
        "verifier_id": "id.me",
        "verification_type": "identity",
        "proof_token": "eyJhbGciOiJFUzI1NiIsImtpZCI6...",
        "subject_hash": "a1b2c3d4e5f6...sha256_hex",
        "issued_at": "2026-03-18T14:30:00Z",
        "expires_at": "2026-03-19T14:30:00Z"
      }
    ]
  }
}`;

const verifyResponse = `{
  "application_id": "app_abc123",
  "status": "submitted",
  "submitted_at": "2026-03-18T14:35:00Z",
  "confirmation_message": "Application received. Acme Corp will review and respond within 5 business days.",
  "estimated_review_days": 5,
  "next_steps": [
    "You will receive email confirmation shortly.",
    "The hiring team typically responds within one week."
  ]
}`;

/* ── Tab data ── */

interface Example {
  value: string;
  label: string;
  requestLabel: string;
  responseLabel: string | null;
  request: string;
  response: string | null;
}

const examples: Example[] = [
  {
    value: "discover",
    label: "Discover",
    requestLabel: "/.well-known/ojcp.json",
    responseLabel: null,
    request: discoverManifest,
    response: null,
  },
  {
    value: "search",
    label: "Search",
    requestLabel: "search_jobs",
    responseLabel: "23 results",
    request: searchRequest,
    response: searchResponse,
  },
  {
    value: "apply",
    label: "Apply",
    requestLabel: "begin_application",
    responseLabel: "pending_verification",
    request: applyRequest,
    response: applyResponse,
  },
  {
    value: "verify",
    label: "Verify",
    requestLabel: "submit_application",
    responseLabel: "submitted",
    request: verifyRequest,
    response: verifyResponse,
  },
];

export function CodeExamples() {
  const { activeCodeTab, setActiveCodeTab } = useSiteStore();
  const [viewMode, setViewMode] = useState<"request" | "response">("request");

  return (
    <section className={classes.root} id="examples">
      <Container size="lg">
        <Stack align="center" gap="xs" mb={48}>
          <Text className={classes.overline}>Examples</Text>
          <Title order={2} ta="center" className={classes.title}>
            See it in action
          </Title>
          <Text ta="center" className={classes.subtitle} maw={550}>
            From discovery to application — real OJCP payloads your agents
            can use today.
          </Text>
        </Stack>

        <Box className={classes.codeBox}>
          <Tabs
            value={activeCodeTab}
            onChange={(v) => setActiveCodeTab(v || "discover")}
            variant="pills"
            color="ojcpCyan"
            classNames={{ tab: classes.tab }}
          >
            <Tabs.List mb="md" justify="center">
              {examples.map((e) => (
                <Tabs.Tab key={e.value} value={e.value}>
                  {e.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {examples.map((e) => {
              const isActive = e.value === activeCodeTab;
              const eHasResponse = e.response !== null;
              const eShowResponse = viewMode === "response" && eHasResponse;
              const eCode = eShowResponse ? e.response! : e.request;
              const eBadge = eShowResponse ? e.responseLabel : e.requestLabel;

              return (
                <Tabs.Panel key={e.value} value={e.value}>
                  {isActive && (
                    <>
                      <Group justify="space-between" align="center" mb="xs">
                        <Badge
                          variant="light"
                          color={eShowResponse ? "teal" : "ojcpCyan"}
                          size="sm"
                          className={classes.codeBadge}
                        >
                          {eShowResponse ? "←" : "→"} {eBadge}
                        </Badge>

                        {eHasResponse && (
                          <SegmentedControl
                            value={viewMode}
                            onChange={(v) =>
                              setViewMode(v as "request" | "response")
                            }
                            data={[
                              { label: "Request", value: "request" },
                              { label: "Response", value: "response" },
                            ]}
                            size="xs"
                            color="ojcpCyan"
                            className={classes.toggle}
                          />
                        )}
                      </Group>

                      <CodeHighlight
                        code={eCode}
                        language="json"
                        withCopyButton
                        className={classes.code}
                      />
                    </>
                  )}
                </Tabs.Panel>
              );
            })}
          </Tabs>
        </Box>
      </Container>
    </section>
  );
}
