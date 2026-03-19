"use client";

import {
  Container,
  Image,
  Title,
  Text,
  Stack,
  SimpleGrid,
  Card,
  ThemeIcon,
  Group,
  Button,
} from "@mantine/core";
import {
  IconUsers,
  IconScale,
  IconRocket,
  IconShieldCheck,
  IconArrowRight,
} from "@tabler/icons-react";
import { specDiscussions } from "@/lib/repo-urls";
import classes from "./About.module.css";

const pillars = [
  {
    icon: IconScale,
    title: "Open Governance",
    description:
      "OJCP is governed by a steering committee of founding members via an RFC process. No single company has veto power. At v1.0 we commit to transitioning spec governance to a neutral foundation.",
  },
  {
    icon: IconUsers,
    title: "Multi-Stakeholder Coalition",
    description:
      "OAJI brings together enterprise employers, ATS vendors, job boards, staffing agencies, and AI agent platforms. Credibility comes from the breadth of the coalition, not the size of any one member.",
  },
  {
    icon: IconRocket,
    title: "Agent-First Future",
    description:
      "AI agents are becoming the primary way candidates discover and apply to jobs. OAJI ensures this transition happens on open rails — not inside walled gardens controlled by a single platform.",
  },
  {
    icon: IconShieldCheck,
    title: "Interoperable by Default",
    description:
      "An agent that supports OJCP gets every compliant provider. A proprietary API gets one vendor's customer base. Open standards win because they reduce integration cost to zero.",
  },
];

export function About() {
  return (
    <>
      <section className={classes.root}>
        <Container size="lg">
          <Stack align="center" gap="xs" mb={48}>
            <Text className={classes.overline}>About</Text>
            <Title order={1} ta="center" className={classes.title}>
              The{" "}
              <span className={classes.highlight}>
                Open Agent Jobs Initiative
              </span>
            </Title>
            <Text ta="center" className={classes.subtitle} maw={680}>
              OAJI is an industry coalition dedicated to making job data
              agent-accessible through open standards. OJCP — the Open Job
              Context Protocol — is the technical foundation.
            </Text>
          </Stack>
        </Container>
      </section>

      <section className={classes.sectionAlt}>
        <Container size="lg">
          <Stack gap="xl">
            <Stack align="center" gap="xs">
              <Text className={classes.overline}>Why This Matters</Text>
              <Title order={2} ta="center" className={classes.sectionTitle}>
                The hiring ecosystem needs a shared protocol
              </Title>
            </Stack>
            <Text ta="center" className={classes.body} maw={720} mx="auto">
              AI agents are rapidly changing how people find and apply to jobs.
              Today, every job board, ATS, and employer exposes job data
              differently — forcing agent developers to build custom
              integrations for each source. OAJI exists to solve this with a
              single, open protocol that any provider can implement and any
              agent can consume.
            </Text>
          </Stack>
        </Container>
      </section>

      <section className={classes.section}>
        <Container size="lg">
          <Stack align="center" gap="xs" mb={48}>
            <Text className={classes.overline}>Principles</Text>
            <Title order={2} ta="center" className={classes.sectionTitle}>
              How OAJI operates
            </Title>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
            {pillars.map((pillar) => (
              <Card
                key={pillar.title}
                className={classes.card}
                padding="xl"
                radius="md"
              >
                <Group gap="md" mb="sm">
                  <ThemeIcon
                    size={40}
                    radius="md"
                    variant="light"
                    color="ojcpCyan"
                    className={classes.icon}
                  >
                    <pillar.icon size={22} />
                  </ThemeIcon>
                  <Text
                    fw={600}
                    size="lg"
                    className={classes.pillarTitle}
                  >
                    {pillar.title}
                  </Text>
                </Group>
                <Text
                  size="sm"
                  c="var(--ojcp-text-muted-light)"
                  lh={1.7}
                >
                  {pillar.description}
                </Text>
              </Card>
            ))}
          </SimpleGrid>
        </Container>
      </section>

      <section className={classes.sectionAlt}>
        <Container size="lg">
          <Stack align="center" gap="lg">
            <Stack align="center" gap="xs">
              <Text className={classes.overline}>Get Involved</Text>
              <Title order={2} ta="center" className={classes.sectionTitle}>
                Join the initiative
              </Title>
            </Stack>
            <Text ta="center" className={classes.body} maw={600}>
              OAJI is open to employers, ATS vendors, job boards, staffing
              agencies, and agent platforms. Whether you want to implement the
              spec, join the registry, or shape the roadmap — we want to hear
              from you.
            </Text>
            <Group gap="md" mt="sm">
              <Button
                component="a"
                href="/registry"
                size="lg"
                color="ojcpCyan"
                variant="filled"
                rightSection={<IconArrowRight size={18} />}
              >
                View the Registry
              </Button>
              <Button
                component="a"
                href={specDiscussions}
                target="_blank"
                size="lg"
                variant="outline"
                color="ojcpTeal"
              >
                Start a Discussion
              </Button>
            </Group>
            <Stack align="center" gap={8} mt={48}>
              <Text size="xs" c="var(--ojcp-text-muted)" tt="uppercase" lts="0.1em" fw={600}>
                Founded by
              </Text>
              <Image
                src="/logos/recruitics-primary.svg"
                alt="Recruitics"
                w={160}
                className={classes.rxLogo}
              />
            </Stack>
          </Stack>
        </Container>
      </section>
    </>
  );
}
