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
  Anchor,
} from "@mantine/core";
import { IconCheck, IconExternalLink } from "@tabler/icons-react";
import { specRendered } from "@/lib/repo-urls";
import classes from "./Spec.module.css";

const schemas = [
  {
    name: "Job Manifest",
    file: "manifest.json",
    specFragment: "manifest",
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
    specFragment: "schema-job-posting",
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
    specFragment: "schema-candidate-context",
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
    specFragment: "schema-agent-declaration",
    description: "Agent self-identification for audit trails",
    fields: [
      "agent_id",
      "acting_on_behalf_of",
      "interaction_mode",
      "user_consent_token",
    ],
  },
  {
    name: "VerificationStep",
    file: "verification-step.json",
    specFragment: "identity-session-initiation",
    description: "Identity verification action for human completion",
    fields: [
      "step_id",
      "type",
      "verifier_id",
      "verification_url",
      "human_required",
    ],
  },
  {
    name: "VerificationProof",
    file: "verification-proof.json",
    specFragment: "identity-proof-format",
    description: "JWS proof with required claims: iss, aud, sub, iat, exp, nonce — no PII",
    fields: [
      "step_id",
      "verifier_id",
      "proof_token (JWS)",
      "subject_hash (SHA-256)",
      "issued_at",
      "expires_at",
    ],
  },
  {
    name: "VerifierManifest",
    file: "verifier-manifest.json",
    specFragment: "identity-discovery",
    description: "Discovery document hosted at /.well-known/ojcp-verifier.json",
    fields: [
      "verifier_id",
      "verification_types",
      "proof_delivery_methods",
      "proof_format (jws|jws+jwe)",
      "signing_algorithms",
      "public_keys_url (JWKS)",
    ],
  },
];

const tools = [
  { name: "search_jobs", required: true, specFragment: "tool-search-jobs" },
  { name: "get_job_detail", required: false, specFragment: "tool-get-job-detail" },
  { name: "get_employer_context", required: false, specFragment: "tool-get-employer-context" },
  { name: "begin_application", required: false, specFragment: "tool-begin-application" },
  { name: "submit_application", required: false, specFragment: "tool-submit-application" },
  { name: "check_application_status", required: false, specFragment: "tool-check-application-status" },
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
            OJCP defines seven core schemas and six standard MCP tools.
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
              <Anchor
                key={tool.name}
                href={`${specRendered}#${tool.specFragment}`}
                target="_blank"
                underline="never"
              >
                <Badge
                  size="lg"
                  radius="sm"
                  variant="light"
                  color="ojcpTeal"
                  className={classes.toolBadge}
                  rightSection={<IconExternalLink size={12} />}
                  style={{ cursor: "pointer" }}
                >
                  {tool.name}
                  {tool.required && " (required)"}
                </Badge>
              </Anchor>
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
                <Anchor
                  href={`${specRendered}#${schema.specFragment}`}
                  target="_blank"
                  underline="hover"
                  c="var(--ojcp-text-light)"
                  fw={600}
                  size="lg"
                >
                  {schema.name}
                  <IconExternalLink
                    size={14}
                    style={{ marginLeft: 6, opacity: 0.5, verticalAlign: "middle" }}
                  />
                </Anchor>
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
