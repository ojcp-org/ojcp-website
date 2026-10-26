import type { ReactNode } from "react";
import Link from "next/link";
import { Container, Title, Text, Stack, Card, Group, Anchor, Badge } from "@mantine/core";
import {
  IconArrowLeft,
  IconExternalLink,
  IconInfoCircle,
  IconCircleCheck,
  IconAlertTriangle,
  IconCloudOff,
  IconCircleDashed,
} from "@tabler/icons-react";
import type { RegistryProvider } from "@/lib/registry-data";
import { TIER_EXPLANATION, formatRegistryDate, providerLinkRel } from "@/lib/registry-display";
import { registryRepo } from "@/lib/repo-urls";
import classes from "./ProviderListing.module.css";

/**
 * One provider's registry listing, rendered on the server so the evidence is in the page itself.
 *
 * The page shows what the registry recorded about the provider; it is never the provider's
 * manifest. Agents and readers are sent to the live manifest on the provider's own origin, which is
 * the only authoritative copy.
 */
export function ProviderListing({ provider: p }: { provider: RegistryProvider }) {
  const rel = providerLinkRel(p.trust_tier);
  const manifestRead = p.ojcp_version !== undefined;
  const checked = p.checked_at ? formatRegistryDate(p.checked_at, true) : undefined;

  return (
    <section className={classes.root}>
      <Container size="md">
        <Stack gap="xl">
          <Link href="/registry" className={classes.back}>
            <IconArrowLeft size={14} /> All providers
          </Link>

          <Stack gap="sm">
            <Text className={classes.overline}>OJCP provider</Text>
            <Title className={classes.title}>{p.name}</Title>
            <Anchor href={`https://${p.domain}/`} target="_blank" rel={rel} className={classes.domain}>
              {p.domain} <IconExternalLink size={13} />
            </Anchor>
            {p.description && <Text className={classes.lead}>{p.description}</Text>}
          </Stack>

          <Card className={classes.card} padding="lg" radius="md">
            <Stack gap="sm">
              <Title order={2} className={classes.h2}>
                For agents
              </Title>
              <Text className={classes.body}>
                Fetch the live manifest from the provider itself and verify it before relying on it. The
                registry copy below is a snapshot, not the manifest, and no index decides whom to trust.
              </Text>
              <Fact label="Manifest">
                <Anchor href={p.manifest_url} target="_blank" rel={rel} className={classes.mono}>
                  {p.manifest_url}
                </Anchor>
              </Fact>
              {p.mcp_endpoint && (
                <Fact label="MCP endpoint (as of last check)">
                  <span className={classes.mono}>{p.mcp_endpoint}</span>
                </Fact>
              )}
            </Stack>
          </Card>

          <Card className={classes.card} padding="lg" radius="md">
            <Stack gap="sm">
              <Title order={2} className={classes.h2}>
                Manifest snapshot
              </Title>
              <Text className={classes.muted} size="sm">
                {checked ? `What the registry read from the manifest on ${checked}.` : "The registry hasn't checked this provider yet."}
              </Text>
              {p.manifest_error ? (
                <Fact label="Status">
                  <span className={classes.warn}>
                    <IconCloudOff size={14} /> Manifest unreachable: {p.manifest_error}
                  </span>
                </Fact>
              ) : (
                manifestRead && (
                  <>
                    <Fact label="OJCP version">{p.ojcp_version}</Fact>
                    <Fact label="Signature">{p.manifest_signed ? "Signed manifest" : "Unsigned manifest"}</Fact>
                    <Fact label="Access">{p.auth_required ? "Authentication required" : "Open access"}</Fact>
                    <Fact label="Tools">
                      <span className={classes.mono}>{p.tools.join(", ") || "none declared"}</span>
                    </Fact>
                    <Fact label="Apply paths">
                      <span className={classes.mono}>
                        {p.apply_paths && p.apply_paths.length > 0 ? p.apply_paths.join(", ") : "none declared"}
                      </span>
                    </Fact>
                    <Fact label="Agent apply">
                      {p.has_agent_apply ? "Yes, the manifest declares begin_application" : "No"}
                    </Fact>
                  </>
                )
              )}
              {p.industries && p.industries.length > 0 && (
                <Fact label="Industries">
                  <Group gap="xs">
                    {p.industries.map((ind) => (
                      <Badge key={ind} variant="dot" color="ojcpGold" size="sm">
                        {ind}
                      </Badge>
                    ))}
                  </Group>
                </Fact>
              )}
            </Stack>
          </Card>

          <Card className={classes.card} padding="lg" radius="md">
            <Stack gap="sm">
              <Title order={2} className={classes.h2}>
                Conformance
              </Title>
              <Conformance provider={p} />
            </Stack>
          </Card>

          <Card className={classes.card} padding="lg" radius="md">
            <Stack gap="sm">
              <Title order={2} className={classes.h2}>
                Listing
              </Title>
              <Fact label="Listed since">{formatRegistryDate(p.added_at)}</Fact>
              <Fact label="Registry tier">
                {p.trust_tier}
                <span className={classes.muted}> · {TIER_EXPLANATION[p.trust_tier]}</span>
              </Fact>
              {p.tier_history && p.tier_history.length > 0 && (
                <Fact label="History">
                  <ul className={classes.history}>
                    {p.tier_history.map((e) => (
                      <li key={`${e.date}-${e.tier}`}>
                        <strong>{formatRegistryDate(e.date)}</strong>: {e.tier}
                        {e.note && <span className={classes.muted}>. {e.note}</span>}
                      </li>
                    ))}
                  </ul>
                </Fact>
              )}
              <Text size="sm" className={classes.notice}>
                <IconInfoCircle size={14} /> A listing is not an endorsement. The tier is the registry&apos;s
                label, not an effective trust tier; agents derive their own from the provider&apos;s
                attestations. Every change to this entry is a reviewed pull request to{" "}
                <Anchor href={`${registryRepo}/blob/main/providers/${p.domain}.json`} target="_blank" c="ojcpGold">
                  providers/{p.domain}.json
                </Anchor>
                .
              </Text>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </section>
  );
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={classes.fact}>
      <Text size="sm" className={classes.label}>
        {label}
      </Text>
      <Text size="sm" component="div" className={classes.value}>
        {children}
      </Text>
    </div>
  );
}

function Conformance({ provider: p }: { provider: RegistryProvider }) {
  const c = p.conformance;
  if (!p.checked_at || p.manifest_error || !c) {
    return (
      <Text size="sm" className={classes.muted}>
        <IconCircleDashed size={14} /> Not checked yet.
      </Text>
    );
  }
  const total = c.passed + c.failed + c.skipped;
  const summary = `${c.passed} of ${total} checks passed${c.skipped ? `, ${c.skipped} skipped` : ""}`;
  return (
    <Stack gap="xs">
      <Text size="sm" className={c.failed === 0 ? classes.pass : classes.warn}>
        {c.failed === 0 ? <IconCircleCheck size={14} /> : <IconAlertTriangle size={14} />} {summary}
        {c.failed > 0 && `, ${c.failed} failed`}
      </Text>
      <Text size="sm" className={classes.muted}>
        Conformance suite {c.suite_version}, run on {formatRegistryDate(c.checked_at, true)}.
      </Text>
      {c.failures.length > 0 && (
        <ul className={classes.failures}>
          {c.failures.map((f) => (
            <li key={f.test}>
              <code>{f.test}</code>
              {f.message && <span className={classes.muted}>: {f.message}</span>}
            </li>
          ))}
        </ul>
      )}
    </Stack>
  );
}
