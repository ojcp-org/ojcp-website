"use client";

import { Container, Title, Text } from "@mantine/core";
import classes from "./FoundingMembers.module.css";

type Member = {
  /** Display name — also the text fallback when no logo asset is provided. */
  name: string;
  /** Path to a monochrome/white SVG under /public/logos/members/, e.g. "/logos/members/acme.svg". Optional. */
  logo?: string;
  /** Optional link to the member's site. */
  href?: string;
};

// ── Founding members ─────────────────────────────────────────────────────────
// Only list members CONFIRMED for public listing — a logo here reads as a public
// endorsement. Logos live in /public/logos/members/; entries without a `logo`
// render as a clean text wordmark (fine to ship while an asset is sourced).
// Ordered by company size, largest first (startup ordering is approximate).
const members: Member[] = [
  { name: "Workday", logo: "/logos/members/workday.svg", href: "https://www.workday.com" },
  { name: "CrossCountry Healthcare", logo: "/logos/members/crosscountry.png", href: "https://www.crosscountryhealthcare.com" },
  { name: "Recruitics", logo: "/logos/members/recruitics.jpg", href: "https://www.recruitics.com" },
  { name: "LoopCV", logo: "/logos/members/loopcv.png", href: "https://loopcv.pro" },
  { name: "Hiring.cafe", logo: "/logos/members/hiringcafe.png", href: "https://hiring.cafe" },
  { name: "aiApply", logo: "/logos/members/aiapply.png", href: "https://aiapply.co" },
  { name: "scale.jobs", logo: "/logos/members/scalejobs.jpg", href: "https://scale.jobs" },
  { name: "Tink", logo: "/logos/members/tink.jpg", href: "https://gettink.ai" }, // NB: gettink.ai, not the tink.com fintech
];

function MemberMark({ member }: { member: Member }) {
  const inner = member.logo ? (
    <img className={classes.logoImg} src={member.logo} alt={member.name} />
  ) : (
    <span className={classes.wordmark}>{member.name}</span>
  );

  if (member.href) {
    return (
      <a
        className={classes.member}
        href={member.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
      </a>
    );
  }
  return <span className={classes.member}>{inner}</span>;
}

export function FoundingMembers() {
  return (
    <section className={classes.root}>
      <Container size="lg">
        <Text className={classes.overline}>Founding Members</Text>
        <Title order={2} className={classes.title}>
          Built by a coalition, not a vendor
        </Title>
        <Text className={classes.subtitle}>
          OJCP is shaped by employers, ATS vendors, job boards, staffing
          agencies, and agent platforms — each holding one seat, none holding a
          veto.
        </Text>

        <div className={classes.logos}>
          {members.map((m) => (
            <MemberMark key={m.name} member={m} />
          ))}
        </div>
      </Container>
    </section>
  );
}
