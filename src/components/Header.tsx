"use client";

import {
  Group,
  Button,
  Container,
  Image,
  Anchor,
  Burger,
  Drawer,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBrandGithub, IconStar } from "@tabler/icons-react";
import { specRepo } from "@/lib/repo-urls";
import { useGitHubStars } from "@/lib/useGitHubStars";
import classes from "./Header.module.css";

const links = [
  { label: "Governance", href: "/governance" },
  { label: "Spec", href: "/#spec" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Examples", href: "/#examples" },
  { label: "Playground", href: "/#playground" },
  { label: "Registry", href: "/registry" },
  { label: "Community", href: "/#community" },
];

export function Header() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const stars = useGitHubStars();

  return (
    <header className={classes.header}>
      <Container size="lg" className={classes.inner}>
        <Anchor href="/" underline="never">
          <Group gap="xs">
            <Image
              src="/logos/icon-32.svg"
              alt="OJCP"
              w={28}
              h={28}
            />
            <span className={classes.wordmark}>OJCP</span>
          </Group>
        </Anchor>

        <Group gap="sm" visibleFrom="sm">
          {links.map((link) => (
            <Anchor
              key={link.label}
              href={link.href}
              className={classes.link}
              underline="never"
            >
              {link.label}
            </Anchor>
          ))}
          <Button
            component="a"
            href={specRepo}
            target="_blank"
            variant="default"
            size="sm"
            leftSection={<IconBrandGithub size={18} />}
            rightSection={
              <Group gap={4} align="center" className={classes.stars}>
                <IconStar size={15} />
                <span>{stars.toLocaleString()}</span>
              </Group>
            }
          >
            Star
          </Button>
        </Group>

        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="sm"
          color="var(--ojcp-text-light)"
          size="sm"
        />

        <Drawer
          opened={opened}
          onClose={close}
          title="OJCP"
          hiddenFrom="sm"
          size="xs"
          styles={{
            body: { background: "var(--ojcp-bg-dark)" },
            header: { background: "var(--ojcp-bg-dark)" },
          }}
        >
          <Stack gap="md">
            {links.map((link) => (
              <Anchor
                key={link.label}
                href={link.href}
                onClick={close}
                className={classes.link}
                underline="never"
              >
                {link.label}
              </Anchor>
            ))}
          </Stack>
        </Drawer>
      </Container>
    </header>
  );
}
