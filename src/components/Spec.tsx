"use client";

import {
  Container,
  Title,
  Text,
  Stack,
  SimpleGrid,
  Card,
  Group,
  Badge,
  List,
  ThemeIcon,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import classes from "./Spec.module.css";

const schemas = [
  {
    name: "Job Manifest",
    file: "manifest.json",
    description: "Discovery endpoint at /.well-known/ojcp.json",
    fields: [
      "ojcp_version",
      "provider",
      "tools",
      "mcp_endpoint",
      "auth",
      "rate_limits",
    ],
  },
  {
    name: "JobPosting",
    file: "job-posting.json",
    description: "Extends schema.org/JobPosting with agent-specific fields",
    fields: [
      "ojcp_id",
      "skills_required",
      "experienceLevel",
      "apply_paths",
      "urgency",
    ],
  },
  {
    name: "CandidateContext",
    file: "candidate-context.json",
    description: "Consent-scoped candidate profile for personalized results",
    fields: [
      "consent_scope",
      "skills",
      "experience_years",
      "employment_type_preference",
    ],
  },
  {
    name: "AgentDeclaration",
    file: "agent-declaration.json",
    description: "Agent self-identification for audit trails",
    fields: [
      "agent_id",
      "acting_on_behalf_of",
      "interaction_mode",
      "user_consent_token",
    ],
  },
];

const tools = [
  { name: "search_jobs", required: true },
  { name: "get_job_detail", required: false },
  { name: "get_employer_context", required: false },
  { name: "begin_application", required: false },
  { name: "check_application_status", required: false },
];

export function Spec() {
  return (
    <section className={classes.root} id="spec">
      <Container size="lg">
        <Stack align="center" gap="xs" mb={48}>
          <Text className={classes.overline}>Specification</Text>
          <Title order={2} ta="center" className={classes.title}>
            Schemas & Tools
          </Title>
          <Text ta="center" className={classes.subtitle} maw={600}>
            OJCP defines four core schemas and five standard MCP tools.
            Providers MUST implement <code>search_jobs</code>; all others are
            recommended. Custom tools use namespaced names
            (e.g., <code>acme:get_referral_link</code>).
          </Text>
        </Stack>

        {/* Tools list */}
        <Card className={classes.toolsCard} padding="xl" radius="md" mb="xl">
          <Text fw={600} size="lg" c="var(--ojcp-text-light)" mb="md">
            MCP Tools
          </Text>
          <Group gap="sm" wrap="wrap">
            {tools.map((tool) => (
              <Badge
                key={tool.name}
                size="lg"
                radius="sm"
                variant="light"
                color="ojcpTeal"
                className={classes.toolBadge}
              >
                {tool.name}
                {tool.required && " (required)"}
              </Badge>
            ))}
          </Group>
        </Card>

        {/* Schema cards */}
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {schemas.map((schema) => (
            <Card
              key={schema.name}
              className={classes.card}
              padding="xl"
              radius="md"
            >
              <Group justify="space-between" mb="sm">
                <Text fw={600} size="lg" c="var(--ojcp-text-light)">
                  {schema.name}
                </Text>
                <Badge
                  variant="outline"
                  color="ojcpTeal"
                  size="xs"
                  radius="sm"
                  className={classes.fileBadge}
                >
                  {schema.file}
                </Badge>
              </Group>
              <Text size="sm" c="var(--ojcp-text-muted-light)" mb="md" lh={1.6}>
                {schema.description}
              </Text>
              <List
                spacing="xs"
                size="sm"
                icon={
                  <ThemeIcon size={18} radius="xl" color="ojcpCyan" variant="light">
                    <IconCheck size={12} />
                  </ThemeIcon>
                }
              >
                {schema.fields.map((field) => (
                  <List.Item key={field}>
                    <code className={classes.fieldCode}>{field}</code>
                  </List.Item>
                ))}
              </List>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </section>
  );
}
