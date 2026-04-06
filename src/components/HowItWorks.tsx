"use client";

import {
  Container,
  Title,
  Text,
  Stack,
  Timeline,
  ThemeIcon,
  Code,
} from "@mantine/core";
import {
  IconSearch,
  IconFileDescription,
  IconSend,
  IconChecks,
} from "@tabler/icons-react";
import classes from "./HowItWorks.module.css";

const steps = [
  {
    icon: IconSearch,
    title: "Discover",
    description: (
      <>
        Agent probes <Code>/.well-known/ojcp.json</Code> or queries the OJCP
        Registry to find providers. The manifest declares available tools,
        apply paths, and authentication requirements.
      </>
    ),
  },
  {
    icon: IconFileDescription,
    title: "Search & Evaluate",
    description: (
      <>
        Agent calls <Code>search_jobs</Code> with optional{" "}
        <Code>candidate_context</Code> for personalized ranking. Each result
        includes <Code>fit_score</Code>, apply paths, and structured metadata.
      </>
    ),
  },
  {
    icon: IconSend,
    title: "Apply",
    description: (
      <>
        Agent calls <Code>begin_application</Code> with an{" "}
        <Code>agent_declaration</Code> and the candidate&apos;s consent token.
        The provider returns required fields and a session for multi-step flows.
      </>
    ),
  },
  {
    icon: IconChecks,
    title: "Track",
    description: (
      <>
        Agent calls <Code>check_application_status</Code> to monitor
        progress. Providers emit structured status updates throughout the
        hiring pipeline.
      </>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className={classes.root} id="how-it-works">
      <Container size="md">
        <Stack align="center" gap="xs" mb={48}>
          <Text className={classes.overline}>How It Works</Text>
          <Title order={2} ta="center" className={classes.title}>
            Four steps from discovery to application
          </Title>
        </Stack>

        <Timeline
          active={3}
          bulletSize={40}
          lineWidth={2}
          color="ojcpGold"
          className={classes.timeline}
        >
          {steps.map((step) => (
            <Timeline.Item
              key={step.title}
              bullet={
                <ThemeIcon
                  size={40}
                  radius="xl"
                  color="ojcpGold"
                  variant="filled"
                >
                  <step.icon size={20} />
                </ThemeIcon>
              }
              title={
                <Text fw={600} size="lg" c="var(--ojcp-text-light)">
                  {step.title}
                </Text>
              }
            >
              <Text
                size="sm"
                c="var(--ojcp-text-muted-light)"
                lh={1.7}
                mt={4}
              >
                {step.description}
              </Text>
            </Timeline.Item>
          ))}
        </Timeline>
      </Container>
    </section>
  );
}
