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
import classes from "./Governance.module.css";

const pillars = [
  {
    icon: IconScale,
    title: "Open Governance",
    description:
      "OJCP is governed by a 7-seat steering committee representing distinct ecosystem segments via a public RFC process. No single company has veto power. Pre-v1.0 we commit to transferring infrastructure to a neutral foundation.",
  },
  {
    icon: IconUsers,
    title: "Multi-Stakeholder",
    description:
      "The steering committee brings together enterprise employers, ATS vendors, job boards, staffing agencies, and AI agent platforms. Credibility comes from the breadth of representation, not the size of any one member.",
  },
  {
    icon: IconRocket,
    title: "Agent-First Future",
    description:
      "AI agents are becoming the primary way candidates discover and apply to jobs. OJCP exists to ensure this transition happens on open rails — not inside walled gardens controlled by a single platform.",
  },
  {
    icon: IconShieldCheck,
    title: "Interoperable by Default",
    description:
      "An agent that supports OJCP gets every compliant provider. A proprietary API gets one vendor's customer base. Open standards win because they reduce integration cost to zero.",
  },
];

export function Governance() {
  return (
    <>
      <section className={classes.root}>
        <Container size="lg">
          <Stack align="center" gap="xs" mb={48}>
            <Text className={classes.overline}>Governance</Text>
            <Title order={1} ta="center" className={classes.title}>
              How{" "}
              <span className={classes.highlight}>OJCP is governed</span>
            </Title>
            <Text ta="center" className={classes.subtitle} maw={680}>
              OJCP is governed by an independent 7-seat steering committee
              through a public RFC process, with infrastructure committed to
              transfer to a neutral foundation before v1.0. It is being designed
              to compose with broader agent-web standards efforts.
            </Text>
          </Stack>
        </Container>
      </section>

      <section className={classes.sectionAlt}>
        <Container size="lg">
          <Stack gap="xl">
            <Stack align="center" gap="xs">
              <Text className={classes.overline}>How It Works</Text>
              <Title order={2} ta="center" className={classes.sectionTitle}>
                An independent steering committee
              </Title>
            </Stack>
            <Text ta="center" className={classes.body} maw={720} mx="auto">
              Seven seats are allocated across distinct ecosystem segments —
              employers, ATS vendors, job boards, staffing agencies, and agent
              platforms — so no single company controls the standard. Changes
              move through a public RFC process: anyone can propose, the
              committee reviews in the open, and decisions are recorded. Before
              v1.0, we are committed to transferring the standard&apos;s
              infrastructure to a neutral foundation, so OJCP&apos;s long-term
              home is independent of any of its founders.
            </Text>
          </Stack>
        </Container>
      </section>

      <section className={classes.section}>
        <Container size="lg">
          <Stack align="center" gap="xs" mb={48}>
            <Text className={classes.overline}>Principles</Text>
            <Title order={2} ta="center" className={classes.sectionTitle}>
              What the steering committee stands for
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
                    color="ojcpGold"
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
                Help shape the standard
              </Title>
            </Stack>
            <Text ta="center" className={classes.body} maw={600}>
              OJCP is open to employers, ATS vendors, job boards, staffing
              agencies, and agent platforms. Whether you want to implement the
              spec, join the registry, or shape the roadmap through the RFC
              process — we want to hear from you.
            </Text>
            <Group gap="md" mt="sm">
              <Button
                component="a"
                href="/registry"
                size="lg"
                color="ojcpGold"
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
                color="ojcpBlue"
              >
                Start a Discussion
              </Button>
            </Group>
            <Stack align="center" gap={8} mt={48}>
              <Text size="xs" c="var(--ojcp-text-muted)" tt="uppercase" lts="0.1em" fw={600}>
                Authored by
              </Text>
              <Image
                src="/logos/recruitics-primary.svg"
                alt="Recruitics"
                w={160}
                className={classes.rxLogo}
              />
              <Text size="xs" c="var(--ojcp-text-muted)" mt={8} ta="center" maw={520}>
                Recruitics authored the OJCP v0.1 specification. OJCP is governed
                independently by its steering committee — Recruitics holds one
                seat of seven.
              </Text>
            </Stack>
          </Stack>
        </Container>
      </section>
    </>
  );
}
