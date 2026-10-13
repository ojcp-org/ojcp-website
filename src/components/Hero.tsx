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
import { motion } from "motion/react";
import { IconArrowRight, IconBrandGithub } from "@tabler/icons-react";
import { specRepo, repoHostLabel } from "@/lib/repo-urls";
import { OJCP_VERSION } from "@/lib/site";
import classes from "./Hero.module.css";

export function Hero() {
  return (
    <section className={classes.root} id="hero">
      <div className={classes.glow} />
      <Container size="lg" className={classes.container}>
        <Stack align="center" gap="xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              color="ojcpGold"
              size="lg"
              radius="sm"
              className={classes.badge}
            >
              Version {OJCP_VERSION}
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image
              src="/logos/primary-dark.svg"
              alt="OJCP — Open Job Context Protocol"
              w={320}
              className={classes.logo}
            />
          </motion.div>

          <Title order={1} className={classes.title} ta="center">
            A front door for
            <br />
            <span className={classes.highlight}>candidates&apos; agents</span>
          </Title>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <Stack align="center" gap="xl">
              <Text className={classes.subtitle} ta="center" maw={640}>
                OJCP is the open standard for how AI agents search, read and
                apply to jobs, under rules the employer controls: verified
                agent identity, applications a person actually approved, and
                credit for whichever agent sent them. Built on MCP. Governed by
                an{" "}
                <Anchor
                  href="/governance"
                  c="var(--ojcp-gold)"
                  underline="hover"
                >
                  independent steering committee
                </Anchor>
                .
              </Text>

              <Group gap="md" mt="sm" className={classes.buttons}>
                <Button
                  component="a"
                  href="/#spec"
                  size="lg"
                  color="ojcpGold"
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
                  color="ojcpBlue"
                  leftSection={<IconBrandGithub size={18} />}
                >
                  View on {repoHostLabel}
                </Button>
              </Group>
            </Stack>
          </motion.div>
        </Stack>
      </Container>
    </section>
  );
}
