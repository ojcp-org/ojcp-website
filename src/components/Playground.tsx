"use client";

import { useState, useCallback } from "react";
import {
  Container,
  Title,
  Text,
  Stack,
  Tabs,
  Button,
  TextInput,
  Switch,
  Group,
  Box,
  Badge,
  Loader,
  Select,
} from "@mantine/core";
import { CodeHighlight } from "@mantine/code-highlight";
import { IconPlayerPlay, IconPlugConnected } from "@tabler/icons-react";
import { createMockProofToken } from "@/lib/mock-jwt";
import classes from "./Playground.module.css";

type ToolName =
  | "search_jobs"
  | "get_job_detail"
  | "get_employer_context"
  | "begin_application"
  | "submit_application"
  | "check_application_status";

export function Playground() {
  const [activeTab, setActiveTab] = useState<string>("search_jobs");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  // search_jobs state
  const [query, setQuery] = useState("backend engineer");
  const [remoteOk, setRemoteOk] = useState(true);
  const [salaryMin, setSalaryMin] = useState("");

  // get_job_detail state
  const [jobId, setJobId] = useState("acme:sbe-2026-001");

  // get_employer_context state
  const [employerId, setEmployerId] = useState<string | null>("acme");

  // begin_application state (default to verification-required job)
  const [applyJobId, setApplyJobId] = useState("globex:sa-2026-004");

  // submit_application state
  const [submitAppId, setSubmitAppId] = useState("");
  const [sessionToken, setSessionToken] = useState("");

  // check_application_status state
  const [applicationId, setApplicationId] = useState("");

  const callTool = useCallback(
    async (tool: ToolName, args: Record<string, unknown>) => {
      setLoading(true);
      setResponse(null);
      try {
        const res = await fetch("/api/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tool, arguments: args }),
        });
        const data = await res.json();
        setResponse(JSON.stringify(data, null, 2));

        // Auto-populate IDs when begin_application returns them
        if (tool === "begin_application" && data.application_id) {
          setApplicationId(data.application_id);
          if (data.session_token) {
            setSubmitAppId(data.application_id);
            setSessionToken(data.session_token);
          }
        }
      } catch (err) {
        setResponse(
          JSON.stringify({ error: "request_failed", message: String(err) }, null, 2)
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return (
    <section className={classes.root} id="playground">
      <Container size="lg">
        <Stack align="center" gap="xs" mb={48}>
          <Text className={classes.overline}>Live Playground</Text>
          <Title order={2} ta="center" className={classes.title}>
            Try the OJCP API
          </Title>
          <Text ta="center" className={classes.subtitle} maw={600}>
            This site is a live OJCP provider. Fire real tool calls against
            mock data — the same endpoint MCP clients connect to.
          </Text>
          <Group gap="xs" mt="xs">
            <Badge
              variant="dot"
              color="teal"
              size="sm"
              className={classes.endpointBadge}
            >
              <IconPlugConnected size={12} style={{ marginRight: 4 }} />
              MCP: /api/mcp
            </Badge>
            <Badge
              variant="dot"
              color="teal"
              size="sm"
              className={classes.endpointBadge}
            >
              Manifest: /.well-known/ojcp.json
            </Badge>
          </Group>
        </Stack>

        <Box className={classes.playgroundBox}>
          <Tabs
            value={activeTab}
            onChange={(v) => {
              setActiveTab(v || "search_jobs");
              setResponse(null);
            }}
            variant="pills"
            color="ojcpCyan"
            classNames={{ tab: classes.tab }}
          >
            <Tabs.List mb="lg" justify="center" style={{ flexWrap: "wrap" }}>
              <Tabs.Tab value="search_jobs">search_jobs</Tabs.Tab>
              <Tabs.Tab value="get_job_detail">get_job_detail</Tabs.Tab>
              <Tabs.Tab value="get_employer_context">get_employer_context</Tabs.Tab>
              <Tabs.Tab value="begin_application">begin_application</Tabs.Tab>
              <Tabs.Tab value="submit_application">submit_application</Tabs.Tab>
              <Tabs.Tab value="check_application_status">
                check_status
              </Tabs.Tab>
            </Tabs.List>

            {/* ── search_jobs ── */}
            <Tabs.Panel value="search_jobs">
              <Stack gap="sm">
                <TextInput
                  label="Query"
                  placeholder="senior backend engineer remote"
                  value={query}
                  onChange={(e) => setQuery(e.currentTarget.value)}
                  classNames={{ label: classes.label, input: classes.input }}
                />
                <Group gap="md">
                  <Switch
                    label="Remote OK"
                    checked={remoteOk}
                    onChange={(e) => setRemoteOk(e.currentTarget.checked)}
                    color="ojcpCyan"
                    classNames={{ label: classes.label }}
                  />
                  <TextInput
                    label="Min Salary"
                    placeholder="150000"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.currentTarget.value)}
                    w={140}
                    classNames={{ label: classes.label, input: classes.input }}
                  />
                </Group>
                <Button
                  onClick={() =>
                    callTool("search_jobs", {
                      query,
                      location: { remote_ok: remoteOk },
                      filters: salaryMin
                        ? { salary_min: Number(salaryMin) }
                        : undefined,
                    })
                  }
                  color="ojcpCyan"
                  leftSection={
                    loading ? <Loader size={14} color="dark" /> : <IconPlayerPlay size={16} />
                  }
                  disabled={loading}
                >
                  Execute
                </Button>
              </Stack>
            </Tabs.Panel>

            {/* ── get_job_detail ── */}
            <Tabs.Panel value="get_job_detail">
              <Stack gap="sm">
                <TextInput
                  label="Job ID"
                  placeholder="acme:sbe-2026-001"
                  value={jobId}
                  onChange={(e) => setJobId(e.currentTarget.value)}
                  classNames={{ label: classes.label, input: classes.input }}
                />
                <Button
                  onClick={() =>
                    callTool("get_job_detail", {
                      job_id: jobId,
                      include_employer_context: true,
                    })
                  }
                  color="ojcpCyan"
                  leftSection={
                    loading ? <Loader size={14} color="dark" /> : <IconPlayerPlay size={16} />
                  }
                  disabled={loading}
                >
                  Execute
                </Button>
              </Stack>
            </Tabs.Panel>

            {/* ── get_employer_context ── */}
            <Tabs.Panel value="get_employer_context">
              <Stack gap="sm">
                <Select
                  label="Employer"
                  data={[
                    { value: "acme", label: "Acme Corp" },
                    { value: "globex", label: "Globex International" },
                    { value: "initech", label: "Initech Systems" },
                  ]}
                  value={employerId}
                  onChange={setEmployerId}
                  classNames={{ label: classes.label, input: classes.input }}
                />
                <Button
                  onClick={() =>
                    callTool("get_employer_context", {
                      employer_id: employerId,
                    })
                  }
                  color="ojcpCyan"
                  leftSection={
                    loading ? <Loader size={14} color="dark" /> : <IconPlayerPlay size={16} />
                  }
                  disabled={loading}
                >
                  Execute
                </Button>
              </Stack>
            </Tabs.Panel>

            {/* ── begin_application ── */}
            <Tabs.Panel value="begin_application">
              <Stack gap="sm">
                <TextInput
                  label="Job ID"
                  placeholder="acme:sbe-2026-001"
                  value={applyJobId}
                  onChange={(e) => setApplyJobId(e.currentTarget.value)}
                  classNames={{ label: classes.label, input: classes.input }}
                />
                <Button
                  onClick={() =>
                    callTool("begin_application", {
                      job_id: applyJobId,
                      agent_declaration: {
                        agent_id: "dev.ojcp.playground",
                        acting_on_behalf_of: "human_user",
                        interaction_mode: "assisted",
                      },
                    })
                  }
                  color="ojcpCyan"
                  leftSection={
                    loading ? <Loader size={14} color="dark" /> : <IconPlayerPlay size={16} />
                  }
                  disabled={loading}
                >
                  Execute
                </Button>
              </Stack>
            </Tabs.Panel>

            {/* ── submit_application ── */}
            <Tabs.Panel value="submit_application">
              <Stack gap="sm">
                <TextInput
                  label="Application ID"
                  placeholder="Run begin_application on a verification-required job first"
                  description="Auto-populated from begin_application (try globex:sa-2026-004)"
                  value={submitAppId}
                  onChange={(e) => setSubmitAppId(e.currentTarget.value)}
                  classNames={{ label: classes.label, input: classes.input }}
                />
                <TextInput
                  label="Session Token"
                  placeholder="Auto-populated from begin_application"
                  value={sessionToken}
                  onChange={(e) => setSessionToken(e.currentTarget.value)}
                  classNames={{ label: classes.label, input: classes.input }}
                />
                <Button
                  onClick={() =>
                    callTool("submit_application", {
                      application_id: submitAppId,
                      session_token: sessionToken,
                      verification_proofs: [
                        {
                          step_id: "mock_step",
                          verifier_id: "id.me",
                          verification_type: "identity",
                          proof_token: createMockProofToken({
                            verifierId: "id.me",
                            stepId: "mock_step",
                          }),
                          issued_at: new Date().toISOString(),
                          expires_at: new Date(Date.now() + 86400000).toISOString(),
                        },
                      ],
                    })
                  }
                  color="ojcpCyan"
                  leftSection={
                    loading ? <Loader size={14} color="dark" /> : <IconPlayerPlay size={16} />
                  }
                  disabled={loading || !submitAppId}
                >
                  Submit with Mock Proof
                </Button>
              </Stack>
            </Tabs.Panel>

            {/* ── check_application_status ── */}
            <Tabs.Panel value="check_application_status">
              <Stack gap="sm">
                <TextInput
                  label="Application ID"
                  placeholder="Run begin_application first to get an ID"
                  description="Auto-populated when you run begin_application"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.currentTarget.value)}
                  classNames={{ label: classes.label, input: classes.input }}
                />
                <Button
                  onClick={() =>
                    callTool("check_application_status", {
                      application_id: applicationId,
                    })
                  }
                  color="ojcpCyan"
                  leftSection={
                    loading ? <Loader size={14} color="dark" /> : <IconPlayerPlay size={16} />
                  }
                  disabled={loading}
                >
                  Execute
                </Button>
              </Stack>
            </Tabs.Panel>
          </Tabs>

          {/* Response pane */}
          {response && (
            <Box mt="lg" className={classes.responseBox}>
              <Group justify="space-between" mb="xs">
                <Text size="xs" fw={600} c="var(--ojcp-text-muted)" tt="uppercase">
                  Response
                </Text>
                <Badge variant="light" color="teal" size="xs">
                  200 OK
                </Badge>
              </Group>
              <CodeHighlight
                code={response}
                language="json"
                withCopyButton
                className={classes.responseCode}
              />
            </Box>
          )}
        </Box>
      </Container>
    </section>
  );
}
