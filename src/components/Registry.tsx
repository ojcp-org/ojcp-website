"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
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
  Anchor,
  Tooltip,
  Collapse,
  UnstyledButton,
  Code,
} from "@mantine/core";
import {
  IconSearch,
  IconRobot,
  IconTools,
  IconPlus,
  IconCheck,
  IconAlertCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleDashed,
  IconCloudOff,
  IconVersions,
  IconSignature,
  IconLock,
  IconLockOpen,
  IconRoute,
  IconInfoCircle,
  IconChevronDown,
  IconChevronRight,
  IconBrandGithub,
} from "@tabler/icons-react";
import type { OjcpProviderItem } from "@/lib/registry-tools";
import type { TrustTier } from "@/lib/schemas";
import { buildRegistryEntry, REGISTRY_DOMAIN_PATTERN, type NewRegistryEntry } from "@/lib/registry-entry";
import { registryNewEntryUrl, registryRepo } from "@/lib/repo-urls";
import classes from "./Registry.module.css";

const TIER_EXPLANATION: Record<TrustTier, string> = {
  unverified:
    "Listed. The manifest exists and parses; the registry has not confirmed who operates the domain.",
  verified:
    "The manifest signature validates and the registry has confirmed the employer's identity.",
  audited:
    "Verified, plus the conformance suite passes and a security review has been completed.",
};

export function Registry() {
  const [query, setQuery] = useState("");
  const [agentOnly, setAgentOnly] = useState(false);
  const [providers, setProviders] = useState<OjcpProviderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set("employer_name", query);
    if (agentOnly) params.set("has_agent_apply", "true");
    const qs = params.toString();
    try {
      const res = await fetch(`/api/registry${qs ? `?${qs}` : ""}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? `HTTP ${res.status}`);
      setProviders(data.providers);
      setError(null);
    } catch {
      setProviders([]);
      setError("The registry index could not be loaded right now. Please try again later.");
    } finally {
      setLoading(false);
    }
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
            <Title className={classes.title}>OJCP Providers</Title>
            <Text className={classes.subtitle}>
              The registry lists providers that serve job data via the Open Job
              Context Protocol, along with evidence gathered daily: what each
              manifest declares and how the provider did on the conformance
              suite. A listing is not an endorsement; agents decide whom to
              trust.
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
          ) : error ? (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
              {error}
            </Alert>
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
    | { type: "success"; domain: string; entry: NewRegistryEntry }
    | { type: "listed"; domain: string }
    | { type: "error"; message: string }
  >(null);

  const validate = useCallback(async () => {
    const cleaned = domain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*$/, "");
    if (!cleaned) return;
    if (!REGISTRY_DOMAIN_PATTERN.test(cleaned)) {
      setStatus({ type: "error", message: `"${cleaned}" is not a valid domain (host name only, e.g. careers.example.com).` });
      return;
    }
    setValidating(true);
    setStatus(null);
    try {
      if (await isListed(cleaned)) {
        setStatus({ type: "listed", domain: cleaned });
        return;
      }
      const url = `https://${cleaned}/.well-known/ojcp.json`;
      const res = await fetch(url);
      if (!res.ok) {
        setStatus({ type: "error", message: `Failed to fetch manifest (HTTP ${res.status}). Make sure ${url} is accessible.` });
        return;
      }
      const manifest = await res.json();
      if (!manifest.ojcp_version || !manifest.provider?.name || !Array.isArray(manifest.tools)) {
        setStatus({ type: "error", message: "Manifest is missing required fields: ojcp_version, provider.name, or tools." });
        return;
      }
      const today = new Date().toISOString().slice(0, 10);
      setStatus({ type: "success", domain: cleaned, entry: buildRegistryEntry(cleaned, manifest, today) });
    } catch {
      setStatus({ type: "error", message: `Could not reach https://${cleaned}/.well-known/ojcp.json. Check CORS headers and that the URL is publicly accessible.` });
    } finally {
      setValidating(false);
    }
  }, [domain]);

  return (
    <Card className={classes.card} padding="xl" radius="md" mt="xl">
      <Stack gap="md">
        <Group gap="xs">
          <IconPlus size={20} color="var(--ojcp-gold)" />
          <Title order={3} c="white" size="h4">
            List Your Provider
          </Title>
        </Group>
        <Text className={classes.ctaText}>
          Serve <code>/.well-known/ojcp.json</code> on your domain, then enter
          it below. We check that the manifest is reachable and parses, then
          prepare a registry entry you can submit as a pull request to{" "}
          <Anchor href={registryRepo} target="_blank" c="ojcpGold">
            the registry repo
          </Anchor>
          .
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

        {status?.type === "listed" && (
          <Alert
            icon={<IconCheck size={16} />}
            color="ojcpGold"
            variant="light"
          >
            <strong>{status.domain}</strong> is already listed. To change its
            entry, open a pull request editing{" "}
            <Anchor
              href={`${registryRepo}/blob/main/providers/${status.domain}.json`}
              target="_blank"
              c="ojcpGold"
            >
              providers/{status.domain}.json
            </Anchor>
            .
          </Alert>
        )}

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
              Manifest found and parses. This is the entry that will be
              proposed as <code>providers/{status.domain}.json</code>:
            </Alert>
            <Code block className={classes.entryPreview}>
              {JSON.stringify(status.entry, null, 2)}
            </Code>
            <Group>
              <Button
                component="a"
                href={registryNewEntryUrl(status.domain, status.entry)}
                target="_blank"
                rel="noopener noreferrer"
                color="ojcpGold"
                variant="outline"
                leftSection={<IconBrandGithub size={16} />}
              >
                Open a registry PR
              </Button>
            </Group>
            <Text size="sm" className={classes.ctaText}>
              GitHub opens with the file pre-filled; commit it to a fork and
              open the pull request. The registry&apos;s CI validates the entry
              against the schema and checks your manifest. New listings start
              at <strong>unverified</strong>.
            </Text>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}

// Best effort: if the registry can't be read, fall through to the normal flow
// and let the registry's CI catch a duplicate.
async function isListed(domain: string): Promise<boolean> {
  try {
    const res = await fetch("/api/registry");
    if (!res.ok) return false;
    const data = (await res.json()) as { providers?: { domain: string }[] };
    return (data.providers ?? []).some((p) => p.domain === domain);
  } catch {
    return false;
  }
}

function timeAgo(iso: string): string {
  const seconds = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  return `${Math.round(hours / 24)} days ago`;
}

function EvidenceRow({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <Group gap={8} wrap="nowrap" align="flex-start">
      <span className={classes.evidenceIcon}>{icon}</span>
      <Text size="xs" className={classes.evidenceText} component="div">
        {children}
      </Text>
    </Group>
  );
}

function ConformanceEvidence({ provider: p }: { provider: OjcpProviderItem }) {
  const [open, setOpen] = useState(false);
  const muted = "var(--ojcp-text-muted-light)";

  if (!p.checked_at) {
    return (
      <EvidenceRow icon={<IconCircleDashed size={14} color={muted} />}>
        <span className={classes.muted}>Not checked yet</span>
      </EvidenceRow>
    );
  }
  const checked = `checked ${timeAgo(p.checked_at)}`;
  if (p.manifest_error) {
    return (
      <EvidenceRow icon={<IconCloudOff size={14} color={muted} />}>
        <span className={classes.muted}>
          Manifest unreachable ({p.manifest_error}) · {checked}
        </span>
      </EvidenceRow>
    );
  }
  const c = p.conformance;
  if (!c) {
    return (
      <EvidenceRow icon={<IconCircleDashed size={14} color={muted} />}>
        <span className={classes.muted}>Conformance not checked · {checked}</span>
      </EvidenceRow>
    );
  }

  const total = c.passed + c.failed + c.skipped;
  const summary = `${c.passed}/${total} checks passed${c.skipped ? ` (${c.skipped} skipped)` : ""}`;
  if (c.failed === 0) {
    return (
      <EvidenceRow icon={<IconCircleCheck size={14} color="var(--mantine-color-green-5)" />}>
        <span className={classes.pass}>{summary}</span>{" "}
        <span className={classes.muted}>· {checked}</span>
      </EvidenceRow>
    );
  }
  return (
    <EvidenceRow icon={<IconAlertTriangle size={14} color="var(--mantine-color-yellow-5)" />}>
      <UnstyledButton
        onClick={() => setOpen((o) => !o)}
        className={classes.failToggle}
        aria-expanded={open}
      >
        <span className={classes.warn}>
          {summary}, {c.failed} failed
        </span>
        {open ? <IconChevronDown size={12} /> : <IconChevronRight size={12} />}
      </UnstyledButton>{" "}
      <span className={classes.muted}>· {checked}</span>
      <Collapse in={open}>
        <ul className={classes.failures}>
          {c.failures.map((f) => (
            <li key={f.test}>
              <code>{f.test}</code>
              {f.message && <span className={classes.muted}>: {f.message}</span>}
            </li>
          ))}
        </ul>
      </Collapse>
    </EvidenceRow>
  );
}

function ProviderCard({ provider: p }: { provider: OjcpProviderItem }) {
  const muted = "var(--ojcp-text-muted-light)";
  // Manifest facts are evidence only when the registry could read the manifest.
  const manifestRead = p.ojcp_version !== undefined;

  return (
    <Card className={classes.card} padding="lg" radius="md">
      <Stack gap="sm" h="100%">
        <Stack gap={4}>
          <Text fw={600} size="lg" c="white">
            {p.name}
          </Text>
          <Anchor
            href={p.manifest_url}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.cardDomain}
          >
            {p.domain}
          </Anchor>
        </Stack>

        {p.description && (
          <Text className={classes.cardDescription} lineClamp={2}>
            {p.description}
          </Text>
        )}

        {p.industries && p.industries.length > 0 && (
          <Group gap="xs">
            {p.industries.slice(0, 3).map((ind) => (
              <Badge key={ind} variant="dot" color="ojcpGold" size="sm">
                {ind}
              </Badge>
            ))}
          </Group>
        )}

        <Stack gap={6} mt="xs">
          <ConformanceEvidence provider={p} />
          {manifestRead && (
            <>
              <EvidenceRow icon={<IconVersions size={14} color={muted} />}>
                OJCP {p.ojcp_version}
              </EvidenceRow>
              <EvidenceRow icon={<IconSignature size={14} color={muted} />}>
                {p.manifest_signed ? "Signed manifest" : "Unsigned manifest"}
              </EvidenceRow>
              <EvidenceRow
                icon={p.auth_required ? <IconLock size={14} color={muted} /> : <IconLockOpen size={14} color={muted} />}
              >
                {p.auth_required ? "Auth required" : "Open access"}
              </EvidenceRow>
              <EvidenceRow icon={<IconTools size={14} color={muted} />}>
                {p.tools.length} {p.tools.length === 1 ? "tool" : "tools"}:{" "}
                <span className={classes.mono}>{p.tools.join(", ")}</span>
              </EvidenceRow>
              <EvidenceRow icon={<IconRoute size={14} color={muted} />}>
                Apply paths:{" "}
                {p.apply_paths && p.apply_paths.length > 0 ? (
                  <span className={classes.mono}>{p.apply_paths.join(", ")}</span>
                ) : (
                  <span className={classes.muted}>none declared</span>
                )}
              </EvidenceRow>
            </>
          )}
          {p.has_agent_apply && (
            <EvidenceRow icon={<IconRobot size={14} color={manifestRead ? "var(--ojcp-gold)" : muted} />}>
              {manifestRead ? (
                <span className={classes.gold}>Agent apply (manifest declares begin_application)</span>
              ) : (
                <span className={classes.muted}>Agent apply per listing; not confirmed from the manifest</span>
              )}
            </EvidenceRow>
          )}
        </Stack>

        <Group gap={6} mt="auto" pt="xs" className={classes.tierLine}>
          <Text size="xs" className={classes.muted}>
            Registry listing: {p.trust_tier}
          </Text>
          <Tooltip
            label={`${TIER_EXPLANATION[p.trust_tier]} Tiers are the registry's listing labels, not endorsements.`}
            multiline
            w={280}
            withArrow
          >
            <IconInfoCircle size={13} color={muted} aria-label="What this listing tier means" />
          </Tooltip>
        </Group>
      </Stack>
    </Card>
  );
}
