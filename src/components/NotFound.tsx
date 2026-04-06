"use client";

import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Image,
} from "@mantine/core";
import { IconArrowRight, IconHome } from "@tabler/icons-react";
import classes from "./NotFound.module.css";

export function NotFound() {
  return (
    <section className={classes.root}>
      <div className={classes.glow} />
      <Container size="lg" className={classes.container}>
        <Stack align="center" gap="xl">
          <Image
            src="/logos/icon-mark-light.svg"
            alt="OJCP"
            w={64}
            h={64}
          />

          <div className={classes.code}>404</div>

          <Title order={2} className={classes.title} ta="center">
            This page couldn&apos;t be found
          </Title>

          <Text className={classes.subtitle} ta="center" maw={480}>
            The route you requested doesn&apos;t exist. It may have been moved or
            removed.
          </Text>

          <Group gap="md" mt="sm" className={classes.buttons}>
            <Button
              component="a"
              href="/"
              size="lg"
              color="ojcpGold"
              variant="filled"
              leftSection={<IconHome size={18} />}
              className={classes.cta}
            >
              Back to Home
            </Button>
            <Button
              component="a"
              href="/#spec"
              size="lg"
              variant="outline"
              color="ojcpBlue"
              rightSection={<IconArrowRight size={18} />}
            >
              View the Spec
            </Button>
          </Group>
        </Stack>
      </Container>
    </section>
  );
}
