import type { ReactNode } from "react";
import Link from "next/link";
import { Container, Title, Text, Stack, Card, Group, Anchor, Badge } from "@mantine/core";
import {
  IconArrowLeft,
  IconExternalLink,
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
 * It shows what the registry recorded; the provider's own manifest stays the only authoritative copy.
 */
export function ProviderListing({ provider: p }: { provider: RegistryProvider }) {
  const rel = providerLinkRel(p.trust_tier);
  const snapshot = p.ojcp_version !== undefined;

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

          <Section title="Connect">
            <Fact label="Manifest">
              <Anchor href={p.manifest_url} target="_blank" rel={rel} className={classes.mono}>
                {p.manifest_url}
              </Anchor>
            </Fact>
            {p.mcp_endpoint && (
              <Fact label="MCP endpoint">
                <span className={classes.mono}>{p.mcp_endpoint}</span>
              </Fact>
            )}
            <Text size="sm" className={classes.muted}>
              Agents should read the live manifest. Everything below is the registry&apos;s last check.
            </Text>
          </Section>

          <Section title="Manifest" note={p.checked_at && `Checked ${formatRegistryDate(p.checked_at, true)}`}>
            {p.manifest_error ? (
              <Text size="sm" className={classes.warn}>
                <IconCloudOff size={14} /> Unreachable: {p.manifest_error}
              </Text>
            ) : snapshot ? (
              <>
                <Fact label="OJCP version">{p.ojcp_version}</Fact>
                <Fact label="Signed">{p.manifest_signed ? "Yes" : "No"}</Fact>
                <Fact label="Auth required">{p.auth_required ? "Yes" : "No"}</Fact>
                <Fact label="Agent apply">{p.has_agent_apply ? "Yes" : "No"}</Fact>
                <Fact label="Tools">
                  <span className={classes.mono}>{p.tools.join(", ") || "none"}</span>
                </Fact>
                <Fact label="Apply paths">
                  <span className={classes.mono}>{p.apply_paths?.join(", ") || "none"}</span>
                </Fact>
              </>
            ) : (
              <Text size="sm" className={classes.muted}>
                <IconCircleDashed size={14} /> Not checked yet.
              </Text>
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
          </Section>

          {p.conformance && !p.manifest_error && <Conformance c={p.conformance} />}

          <Section title="Listing">
            <Fact label="Listed">{formatRegistryDate(p.added_at)}</Fact>
            <Fact label="Tier">
              {p.trust_tier}
              <span className={classes.muted}>: {TIER_EXPLANATION[p.trust_tier]}</span>
            </Fact>
            {p.tier_history && p.tier_history.length > 0 && (
              <Fact label="History">
                <ul className={classes.list}>
                  {p.tier_history.map((e) => (
                    <li key={`${e.date}-${e.tier}`}>
                      {formatRegistryDate(e.date)}: {e.tier}
                      {e.note && <span className={classes.muted}>. {e.note}</span>}
                    </li>
                  ))}
                </ul>
              </Fact>
            )}
            <Text size="sm" className={classes.muted}>
              A listing isn&apos;t an endorsement; agents derive their own trust tier.{" "}
              <Anchor href={`${registryRepo}/blob/main/providers/${p.domain}.json`} target="_blank" c="ojcpGold">
                View entry
              </Anchor>
            </Text>
          </Section>
        </Stack>
      </Container>
    </section>
  );
}

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <Card className={classes.card} padding="lg" radius="md">
      <Stack gap="sm">
        <Group justify="space-between" align="baseline">
          <Title order={2} className={classes.h2}>
            {title}
          </Title>
          {note && (
            <Text size="xs" className={classes.muted}>
              {note}
            </Text>
          )}
        </Group>
        {children}
      </Stack>
    </Card>
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

function Conformance({ c }: { c: NonNullable<RegistryProvider["conformance"]> }) {
  const total = c.passed + c.failed + c.skipped;
  const ok = c.failed === 0;
  return (
    <Section title="Conformance" note={`Suite ${c.suite_version}`}>
      <Text size="sm" className={ok ? classes.pass : classes.warn}>
        {ok ? <IconCircleCheck size={14} /> : <IconAlertTriangle size={14} />} {c.passed}/{total} checks passed
        {c.skipped > 0 && `, ${c.skipped} skipped`}
        {!ok && `, ${c.failed} failed`}
      </Text>
      {c.failures.length > 0 && (
        <ul className={classes.list}>
          {c.failures.map((f) => (
            <li key={f.test}>
              <code>{f.test}</code>
              {f.message && <span className={classes.muted}>: {f.message}</span>}
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
