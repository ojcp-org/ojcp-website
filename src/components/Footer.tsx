"use client";

import { Container, Group, Text, Anchor, Image, Stack } from "@mantine/core";
import {
  specRepo,
  specBlob,
  specTree,
  specDiscussions,
} from "@/lib/repo-urls";
import classes from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={classes.root}>
      <Container size="lg">
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="xl">
          <Stack gap="xs">
            <Group gap="xs">
              <Image src="/logos/icon-32.svg" alt="OJCP" w={24} h={24} />
              <Text
                fw={700}
                size="md"
                ff="var(--mantine-font-family-monospace)"
                c="var(--ojcp-text-light)"
              >
                OJCP
              </Text>
            </Group>
            <Text size="xs" c="var(--ojcp-text-muted)" maw={280}>
              Open Job Context Protocol — the open standard for
              agent-consumable job feeds.
            </Text>
          </Stack>

          <Group gap={48} align="flex-start">
            <Stack gap="xs">
              <Text
                size="xs"
                fw={600}
                tt="uppercase"
                lts="0.1em"
                c="var(--ojcp-text-muted)"
              >
                Resources
              </Text>
              <Anchor
                href={specBlob("spec/ojcp-v0.1.md")}
                target="_blank"
                size="sm"
                c="var(--ojcp-text-muted-light)"
                underline="hover"
              >
                Specification
              </Anchor>
              <Anchor
                href={specTree("schemas")}
                target="_blank"
                size="sm"
                c="var(--ojcp-text-muted-light)"
                underline="hover"
              >
                Schemas
              </Anchor>
              <Anchor
                href={specTree("examples")}
                target="_blank"
                size="sm"
                c="var(--ojcp-text-muted-light)"
                underline="hover"
              >
                Examples
              </Anchor>
            </Stack>

            <Stack gap="xs">
              <Text
                size="xs"
                fw={600}
                tt="uppercase"
                lts="0.1em"
                c="var(--ojcp-text-muted)"
              >
                Community
              </Text>
              <Anchor
                href={specRepo}
                target="_blank"
                size="sm"
                c="var(--ojcp-text-muted-light)"
                underline="hover"
              >
                Repository
              </Anchor>
              <Anchor
                href={specDiscussions}
                target="_blank"
                size="sm"
                c="var(--ojcp-text-muted-light)"
                underline="hover"
              >
                Discussions
              </Anchor>
              <Anchor
                href={specBlob("CONTRIBUTING.md")}
                target="_blank"
                size="sm"
                c="var(--ojcp-text-muted-light)"
                underline="hover"
              >
                Contributing
              </Anchor>
            </Stack>
          </Group>
        </Group>

        <Text size="xs" c="var(--ojcp-text-muted)" mt={48} ta="center">
          Released under CC BY 4.0. OJCP is an open community project.
        </Text>
      </Container>
    </footer>
  );
}
