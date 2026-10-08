"use client";

import {
  Container,
  SimpleGrid,
  Title,
  Text,
  Card,
  ThemeIcon,
  Stack,
} from "@mantine/core";
import {
  IconPlugConnected,
  IconSearch,
  IconShieldCheck,
  IconRoute,
  IconBrain,
  IconWorldWww,
  IconFingerprint,
  IconEyeCheck,
  IconTargetArrow,
} from "@tabler/icons-react";
import classes from "./Features.module.css";

const features = [
  {
    icon: IconPlugConnected,
    title: "MCP-Native Tools",
    description:
      "OJCP tools are valid MCP tools. Any MCP client can call search_jobs, get_job_detail, and begin_application out of the box.",
  },
  {
    icon: IconSearch,
    title: "Structured Discovery",
    description:
      "Providers expose a manifest at /.well-known/ojcp.json. Agents discover capabilities, tools, and apply paths automatically.",
  },
  {
    icon: IconRoute,
    title: "Normalized Apply Paths",
    description:
      "A standard taxonomy of application mechanisms — from ATS-direct to agent-ready flows — so agents know exactly how to apply.",
  },
  {
    icon: IconShieldCheck,
    title: "Consent-First Privacy",
    description:
      "Candidate data is opt-in and scoped. Resume embeddings enable fit-scoring without transmitting PII. Visa, relocation, and clearance eligibility is stated explicitly, and an unstated gate is never read as a no.",
  },
  {
    icon: IconBrain,
    title: "Agent-Aware Ranking",
    description:
      "Pass CandidateContext for personalized results. Providers return fit_score and fit_rationale alongside standard job data.",
  },
  {
    icon: IconWorldWww,
    title: "WebMCP Ready",
    description:
      "Browser-native agents can access OJCP tools via navigator.modelContext. Same schemas, same tools, new surface.",
  },
  {
    icon: IconFingerprint,
    title: "Verified Agent Identity",
    description:
      "Agents sign requests and bind agent_id to their own namespace, with delegated signing for third-party hosts. User mandates prove that a person authorized one specific action.",
  },
  {
    icon: IconEyeCheck,
    title: "Agent-Scoped Visibility",
    description:
      "Providers mark jobs public, restricted, or private and enforce visibility server-side against a verified agent_id. Gating depends on the agent, never on the candidate.",
  },
  {
    icon: IconTargetArrow,
    title: "Provider-Derived Attribution",
    description:
      "Providers credit each application from evidence they already hold — an issued attribution_ref or the agent's last impression of the job. No relaying, no fingerprinting.",
  },
];

export function Features() {
  return (
    <section className={classes.root} id="features">
      <Container size="lg">
        <Stack align="center" gap="xs" mb={48}>
          <Text className={classes.overline}>Why OJCP</Text>
          <Title order={2} ta="center" className={classes.title}>
            Built for the agentic web
          </Title>
          <Text
            ta="center"
            className={classes.subtitle}
            maw={600}
          >
            A shared protocol so AI agents and job providers speak the same
            language — structured, discoverable, privacy-respecting.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className={classes.card}
              padding="xl"
              radius="md"
            >
              <ThemeIcon
                size={48}
                radius="md"
                variant="light"
                color="ojcpGold"
                className={classes.icon}
              >
                <feature.icon size={26} />
              </ThemeIcon>
              <Text fw={600} mt="md" size="lg" c="var(--ojcp-text-light)">
                {feature.title}
              </Text>
              <Text mt="xs" size="sm" c="var(--ojcp-text-muted-light)" lh={1.6}>
                {feature.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </section>
  );
}
