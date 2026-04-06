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
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useState } from "react";
import { IconArrowRight, IconBrandGitlab } from "@tabler/icons-react";
import { specRepo, repoHostLabel } from "@/lib/repo-urls";
import classes from "./Hero.module.css";

const TYPED_TEXT = "agent-native job data";

function TypeWriter({ onDone }: { onDone: () => void }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [displayed, setDisplayed] = useState("");
  const [hideCursor, setHideCursor] = useState(false);

  useEffect(() => {
    const controls = animate(count, TYPED_TEXT.length, {
      duration: TYPED_TEXT.length * 0.06,
      ease: "linear",
      onComplete: () => {
        onDone();
        // Keep cursor visible briefly, then fade it
        setTimeout(() => setHideCursor(true), 600);
      },
    });
    return () => controls.stop();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return rounded.on("change", (v) => {
      setDisplayed(TYPED_TEXT.slice(0, v));
    });
  }, [rounded]);

  return (
    <>
      {displayed}
      <span
        className={classes.cursor}
        style={{ opacity: hideCursor ? 0 : 1, transition: "opacity 0.3s" }}
      >
        |
      </span>
    </>
  );
}

export function Hero() {
  const [typingDone, setTypingDone] = useState(false);

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
              v0.1 Draft Specification
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
            The open standard for
            <br />
            <span className={classes.highlight}>
              <TypeWriter onDone={() => setTypingDone(true)} />
            </span>
          </Title>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={typingDone ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ opacity: 0 }}
          >
            <Stack align="center" gap="xl">
              <Text className={classes.subtitle} ta="center" maw={640}>
                Part of the{" "}
                <Anchor href="/about" c="var(--ojcp-gold)" underline="hover">
                  Open Agent Jobs Initiative
                </Anchor>
                . OJCP defines how AI agents discover, reason over, and act on
                job opportunities. Built on MCP. Interoperable with schema.org.
                Designed for the agentic web.
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
                  leftSection={<IconBrandGitlab size={18} />}
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
