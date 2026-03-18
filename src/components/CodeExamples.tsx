"use client";

import {
  Container,
  Title,
  Text,
  Stack,
  Tabs,
  Box,
} from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import { useSiteStore } from "@/store";
import classes from "./CodeExamples.module.css";

const manifestExample = `// /.well-known/ojcp.json
{
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

const searchExample = `// MCP tool call: search_jobs
{
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
      "consent_scope": "search_personalization",
      "skills": ["Go", "Kubernetes", "PostgreSQL"],
      "experience_years": 8
    },
    "pagination": { "limit": 5 }
  }
}`;

const responseExample = `// search_jobs response
{
  "total": 23,
  "jobs": [
    {
      "ojcp_id": "careers.acme.com:sbe-2024-001",
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
      "fit_score": 0.91,
      "fit_rationale": "Strong overlap on Go and PostgreSQL.",
      "apply_paths": [
        {
          "type": "adaptive_apply",
          "supports_agent_submission": true,
          "url": "https://careers.acme.com/apply/sbe-2024-001",
          "required_fields": ["resume", "email", "name"],
          "estimated_completion_minutes": 2
        }
      ]
    }
  ]
}`;

const applyExample = `// MCP tool call: begin_application
{
  "name": "begin_application",
  "arguments": {
    "job_id": "careers.acme.com:sbe-2024-001",
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
    }
  }
}`;

const tabs = [
  { value: "manifest", label: "Manifest", code: manifestExample, language: "json" },
  { value: "search", label: "Search", code: searchExample, language: "json" },
  { value: "response", label: "Response", code: responseExample, language: "json" },
  { value: "apply", label: "Apply", code: applyExample, language: "json" },
];

export function CodeExamples() {
  const { activeCodeTab, setActiveCodeTab } = useSiteStore();

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
            onChange={(v) => setActiveCodeTab(v || "manifest")}
            variant="pills"
            color="ojcpCyan"
            classNames={{ tab: classes.tab }}
          >
            <Tabs.List mb="md" justify="center">
              {tabs.map((t) => (
                <Tabs.Tab key={t.value} value={t.value}>
                  {t.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {tabs.map((t) => (
              <Tabs.Panel key={t.value} value={t.value}>
                <CodeHighlight
                  code={t.code}
                  language={t.language}
                  withCopyButton
                  className={classes.code}
                />
              </Tabs.Panel>
            ))}
          </Tabs>
        </Box>
      </Container>
    </section>
  );
}
