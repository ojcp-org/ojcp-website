"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Title,
  Text,
  Stack,
  Card,
  Badge,
  Group,
  TextInput,
  Switch,
  Button,
  Loader,
  Alert,
} from "@mantine/core";
import {
  IconSearch,
  IconShieldCheck,
  IconRobot,
  IconTools,
  IconMapPin,
  IconPlus,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import type { RegistryProvider } from "@/lib/registry-data";
import { siteNewIssue } from "@/lib/repo-urls";
import classes from "./Registry.module.css";

export function Registry() {
  const [query, setQuery] = useState("");
  const [agentOnly, setAgentOnly] = useState(false);
  const [providers, setProviders] = useState<RegistryProvider[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("employer_name", query);
    if (agentOnly) params.set("has_agent_apply", "true");
    const qs = params.toString();
    const res = await fetch(`/api/registry${qs ? `?${qs}` : ""}`);
    const data = await res.json();
    setProviders(data.providers);
    setLoading(false);
  }, [query, agentOnly]);

  useEffect(() => {
    const timer = setTimeout(fetchProviders, 200);
    return () => clearTimeout(timer);
  }, [fetchProviders]);

  return (
    <section className={classes.root}>
      <Container size="lg">
        <Stack gap="xl">
          <Stack gap="sm">
            <Text className={classes.overline}>Provider Registry</Text>
            <Title className={classes.title}>Discover OJCP Providers</Title>
            <Text className={classes.subtitle}>
              Browse verified providers that expose agent-consumable job feeds
              via the Open Job Context Protocol.
            </Text>
          </Stack>

          <div className={classes.filters}>
            <TextInput
              className={classes.searchInput}
              placeholder="Search providers..."
              leftSection={<IconSearch size={16} />}
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
              size="md"
            />
            <Switch
              label="Agent apply only"
              checked={agentOnly}
              onChange={(e) => setAgentOnly(e.currentTarget.checked)}
              size="md"
            />
          </div>

          {loading ? (
            <Group justify="center" py="xl">
              <Loader color="ojcpGold" />
            </Group>
          ) : providers.length === 0 ? (
            <div className={classes.emptyState}>
              <Text size="lg">No providers found matching your criteria.</Text>
            </div>
          ) : (
            <div className={classes.grid}>
              {providers.map((p) => (
                <ProviderCard key={p.domain} provider={p} />
              ))}
            </div>
          )}

          <RegistrationForm />
        </Stack>
      </Container>
    </section>
  );
}

function RegistrationForm() {
  const [domain, setDomain] = useState("");
  const [validating, setValidating] = useState(false);
  const [status, setStatus] = useState<
    | null
    | { type: "success"; manifest: Record<string, unknown> }
    | { type: "error"; message: string }
  >(null);

  const validate = useCallback(async () => {
    const cleaned = domain.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!cleaned) return;
    setValidating(true);
    setStatus(null);
    try {
      const url = `https://${cleaned}/.well-known/ojcp.json`;
      const res = await fetch(url);
      if (!res.ok) {
        setStatus({ type: "error", message: `Failed to fetch manifest (HTTP ${res.status}). Make sure ${url} is accessible.` });
        return;
      }
      const manifest = await res.json();
      if (!manifest.ojcp_version || !manifest.provider?.name || !manifest.tools) {
        setStatus({ type: "error", message: "Manifest is missing required fields: ojcp_version, provider.name, or tools." });
        return;
      }
      setStatus({ type: "success", manifest });
    } catch {
      setStatus({ type: "error", message: `Could not reach https://${cleaned}/.well-known/ojcp.json. Check CORS headers and that the URL is publicly accessible.` });
    } finally {
      setValidating(false);
    }
  }, [domain]);

  const openIssue = useCallback(() => {
    if (status?.type !== "success") return;
    const m = status.manifest;
    const cleaned = domain.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    const issueTitle = `Register provider: ${cleaned}`;
    const issueBody =
      `## Provider Registration Request\n\n` +
      `- **Domain:** ${cleaned}\n` +
      `- **Name:** ${(m.provider as Record<string, unknown>)?.name ?? "N/A"}\n` +
      `- **Manifest URL:** https://${cleaned}/.well-known/ojcp.json\n` +
      `- **MCP Endpoint:** ${m.mcp_endpoint ?? "N/A"}\n` +
      `- **Tools:** ${Array.isArray(m.tools) ? m.tools.join(", ") : "N/A"}\n` +
      `- **Apply Paths:** ${Array.isArray(m.apply_paths) ? m.apply_paths.join(", ") : "N/A"}\n\n` +
      `### Manifest\n\`\`\`json\n${JSON.stringify(m, null, 2)}\n\`\`\`\n\n` +
      `---\n*Submitted via the OJCP Registry at ojcp.dev*`;
    window.open(siteNewIssue({ title: issueTitle, body: issueBody }), "_blank");
  }, [domain, status]);

  return (
    <Card className={classes.card} padding="xl" radius="md" mt="xl">
      <Stack gap="md">
        <Group gap="xs">
          <IconPlus size={20} color="var(--ojcp-gold)" />
          <Title order={3} c="white" size="h4">
            Register Your Provider
          </Title>
        </Group>
        <Text className={classes.ctaText}>
          Serve <code>/.well-known/ojcp.json</code> on your domain, then enter
          it below to validate and submit a registration request.
        </Text>
        <Group gap="sm" align="flex-end">
          <TextInput
            className={classes.searchInput}
            placeholder="careers.yourcompany.com"
            label="Provider domain"
            value={domain}
            onChange={(e) => setDomain(e.currentTarget.value)}
            onKeyDown={(e) => e.key === "Enter" && validate()}
            size="md"
          />
          <Button
            onClick={validate}
            loading={validating}
            color="ojcpGold"
            size="md"
          >
            Validate
          </Button>
        </Group>

        {status?.type === "error" && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            variant="light"
          >
            {status.message}
          </Alert>
        )}

        {status?.type === "success" && (
          <Stack gap="sm">
            <Alert
              icon={<IconCheck size={16} />}
              color="ojcpGold"
              variant="light"
            >
              Manifest validated successfully! Click below to submit a registration request.
            </Alert>
            <Button
              onClick={openIssue}
              color="ojcpGold"
              variant="outline"
              leftSection={<IconPlus size={16} />}
            >
              Submit Registration Request
            </Button>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}

function ProviderCard({ provider: p }: { provider: RegistryProvider }) {
  return (
    <Card className={classes.card} padding="lg" radius="md">
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Stack gap={4}>
            <Text fw={600} size="lg" c="white">
              {p.name}
            </Text>
            <Text className={classes.cardDomain}>{p.domain}</Text>
          </Stack>
          {p.verified && (
            <Badge
              leftSection={<IconShieldCheck size={14} />}
              color="ojcpGold"
              variant="light"
              size="sm"
            >
              Verified
            </Badge>
          )}
        </Group>

        <Text className={classes.cardDescription} lineClamp={2}>
          {p.description}
        </Text>

        <Group gap="xs">
          {p.industries.slice(0, 3).map((ind) => (
            <Badge key={ind} variant="dot" color="ojcpGold" size="sm">
              {ind}
            </Badge>
          ))}
        </Group>

        <Group gap="md" mt="xs">
          <Group gap={4}>
            <IconMapPin size={14} color="var(--ojcp-text-muted-light)" />
            <Text size="xs" c="dimmed">
              {[p.location.city, p.location.state, p.location.country]
                .filter(Boolean)
                .join(", ")}
            </Text>
          </Group>
          <Group gap={4}>
            <IconTools size={14} color="var(--ojcp-text-muted-light)" />
            <Text size="xs" c="dimmed" className={classes.toolCount}>
              {p.tools.length} tools
            </Text>
          </Group>
          {p.has_agent_apply && (
            <Group gap={4}>
              <IconRobot size={14} color="var(--ojcp-gold)" />
              <Text size="xs" c="var(--ojcp-gold)">
                Agent apply
              </Text>
            </Group>
          )}
        </Group>
      </Stack>
    </Card>
  );
}
