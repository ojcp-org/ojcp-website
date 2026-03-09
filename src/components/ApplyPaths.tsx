"use client";

import {
  Container,
  Title,
  Text,
  Stack,
  Table,
  Badge,
  Box,
} from "@mantine/core";
import classes from "./ApplyPaths.module.css";

const paths = [
  {
    type: "ats_direct",
    description: "Apply directly via ATS (Workday, Greenhouse, Lever, etc.)",
    agentSupport: "varies",
  },
  {
    type: "adaptive_apply",
    description: "Configurable, brandable, agent-ready apply flow",
    agentSupport: "full",
  },
  {
    type: "apply_anywhere",
    description: "End-to-end apply flow with ATS delivery",
    agentSupport: "full",
  },
  {
    type: "indeed_apply",
    description: "Indeed's native apply flow",
    agentSupport: "limited",
  },
  {
    type: "email_apply",
    description: "Legacy email-based application",
    agentSupport: "none",
  },
  {
    type: "external_url",
    description: "Redirect to external page",
    agentSupport: "none",
  },
  {
    type: "custom",
    description:
      "Catch-all for non-standard apply mechanisms (homegrown, conversational, etc.)",
    agentSupport: "varies",
  },
];

function AgentBadge({ level }: { level: string }) {
  const colorMap: Record<string, string> = {
    full: "teal",
    limited: "yellow",
    varies: "blue",
    none: "gray",
  };
  return (
    <Badge variant="light" color={colorMap[level]} size="sm" radius="sm">
      {level === "full"
        ? "Full Support"
        : level === "limited"
        ? "Limited"
        : level === "varies"
        ? "Varies"
        : "Not Supported"}
    </Badge>
  );
}

export function ApplyPaths() {
  return (
    <section className={classes.root} id="apply-paths">
      <Container size="lg">
        <Stack align="center" gap="xs" mb={48}>
          <Text className={classes.overline}>Apply Paths</Text>
          <Title order={2} ta="center" className={classes.title}>
            Normalized application taxonomy
          </Title>
          <Text ta="center" className={classes.subtitle} maw={580}>
            OJCP standardizes the fragmented landscape of application
            mechanisms into a taxonomy agents can reason over.
          </Text>
        </Stack>

        <Box className={classes.tableWrapper}>
          <Table
            highlightOnHover
            className={classes.table}
            verticalSpacing="md"
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th className={classes.th}>Type</Table.Th>
                <Table.Th className={classes.th}>Description</Table.Th>
                <Table.Th className={classes.th}>Agent Submission</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paths.map((path) => (
                <Table.Tr key={path.type} className={classes.tr}>
                  <Table.Td>
                    <code className={classes.typeCode}>{path.type}</code>
                  </Table.Td>
                  <Table.Td className={classes.desc}>
                    {path.description}
                  </Table.Td>
                  <Table.Td>
                    <AgentBadge level={path.agentSupport} />
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Box>
      </Container>
    </section>
  );
}
