"use client";

import {
  Container,
  Title,
  Text,
  Stack,
  SimpleGrid,
  Card,
  ThemeIcon,
  Button,
  Group,
} from "@mantine/core";
import {
  IconBook,
  IconBrandGitlab,
  IconCode,
  IconUsers,
} from "@tabler/icons-react";
import {
  specBlob,
  specTree,
  specIssues,
  specDiscussions,
} from "@/lib/repo-urls";
import classes from "./Community.module.css";

const cards = [
  {
    icon: IconBook,
    title: "Read the Spec",
    description:
      "The full OJCP v0.1 specification covers tools, schemas, apply paths, and security requirements.",
    action: "View Specification",
    href: specBlob("spec/ojcp-v0.1.md"),
  },
  {
    icon: IconCode,
    title: "Explore Schemas",
    description:
      "JSON Schemas for JobPosting, CandidateContext, AgentDeclaration, and the Manifest.",
    action: "Browse Schemas",
    href: specTree("schemas"),
  },
  {
    icon: IconBrandGitlab,
    title: "Contribute",
    description:
      "OJCP is open. File issues, propose changes, or build a reference implementation.",
    action: "Open an Issue",
    href: specIssues,
  },
  {
    icon: IconUsers,
    title: "Join the Discussion",
    description:
      "Shape the future of agent-ready hiring. We welcome ATS vendors, job boards, and agent developers.",
    action: "Get Involved",
    href: specDiscussions,
  },
];

export function Community() {
  return (
    <section className={classes.root} id="community">
      <Container size="lg">
        <Stack align="center" gap="xs" mb={48}>
          <Text className={classes.overline}>Get Started</Text>
          <Title order={2} ta="center" className={classes.title}>
            Build with OJCP
          </Title>
          <Text ta="center" className={classes.subtitle} maw={580}>
            Whether you&apos;re a job board, ATS, or agent developer — the
            spec is open and contributions are welcome.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {cards.map((card) => (
            <Card
              key={card.title}
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
                >
                  <card.icon size={22} />
                </ThemeIcon>
                <Text fw={600} size="lg" c="var(--ojcp-text-light)">
                  {card.title}
                </Text>
              </Group>
              <Text size="sm" c="var(--ojcp-text-muted-light)" lh={1.7} mb="lg">
                {card.description}
              </Text>
              <Button
                component="a"
                href={card.href}
                target="_blank"
                variant="light"
                color="ojcpCyan"
                size="sm"
              >
                {card.action}
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </section>
  );
}
