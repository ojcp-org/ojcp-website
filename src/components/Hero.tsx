"use client";

import {
  Anchor,
  Container,
  Title,
  Text,
  Button,
  Group,
  Image,
  Stack,
  Badge,
} from "@mantine/core";
import { IconArrowRight, IconBrandGitlab } from "@tabler/icons-react";
import { specRepo, repoHostLabel } from "@/lib/repo-urls";
import classes from "./Hero.module.css";

export function Hero() {
  return (
    <section className={classes.root} id="hero">
      <div className={classes.glow} />
      <Container size="lg" className={classes.container}>
        <Stack align="center" gap="xl">
          <Badge
            variant="outline"
            color="ojcpCyan"
            size="lg"
            radius="sm"
            className={classes.badge}
          >
            v0.1 Draft Specification
          </Badge>

          <Image
            src="/logos/primary-dark.svg"
            alt="OJCP — Open Job Context Protocol"
            w={320}
            className={classes.logo}
          />

          <Title order={1} className={classes.title} ta="center">
            The open standard for
            <br />
            <span className={classes.highlight}>agent-native job data</span>
          </Title>

          <Text className={classes.subtitle} ta="center" maw={640}>
            Part of the{" "}
            <Anchor href="/about" c="var(--ojcp-cyan)" underline="hover">
              Open Agent Jobs Initiative
            </Anchor>
            . OJCP defines how AI agents discover, reason over, and act on job
            opportunities. Built on MCP. Interoperable with schema.org. Designed
            for the agentic web.
          </Text>

          <Group gap="md" mt="sm" className={classes.buttons}>
            <Button
              component="a"
              href="/#spec"
              size="lg"
              color="ojcpCyan"
              variant="filled"
              rightSection={<IconArrowRight size={18} />}
              className={classes.cta}
            >
              Read the Spec
            </Button>
            <Button
              component="a"
              href={specRepo}
              target="_blank"
              size="lg"
              variant="outline"
              color="ojcpTeal"
              leftSection={<IconBrandGitlab size={18} />}
            >
              View on {repoHostLabel}
            </Button>
          </Group>
        </Stack>
      </Container>
    </section>
  );
}
