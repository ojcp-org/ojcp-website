import type { JobPosting, VerificationStep, ScreeningQuestion } from "./schemas";

// ── Employers ──
export const employers = {
  acme: {
    id: "acme",
    name: "Acme Corp",
    url: "https://careers.acme.example.com",
    industry: "Technology",
    size: "1000-5000",
    description:
      "Acme Corp builds developer tools for the modern web. We're a remote-first company with teams across North America and Europe.",
    culture: {
      values: [
        "Ship fast, learn faster",
        "Default to transparency",
        "Build for developers",
      ],
      work_style: "Remote-first with optional offices in SF and NYC",
      engineering_blog: "https://eng.acme.example.com",
    },
    benefits: [
      "Unlimited PTO",
      "Home office stipend",
      "Conference budget",
      "Equity grants",
      "Health + dental + vision",
    ],
    hiring_practices: {
      interview_stages: [
        "Recruiter screen",
        "Technical phone screen",
        "System design",
        "Team interviews",
        "Offer",
      ],
      average_time_to_hire_days: 21,
      response_commitment: "We respond to every applicant within 5 business days.",
    },
  },
  globex: {
    id: "globex",
    name: "Globex International",
    url: "https://jobs.globex.example.com",
    industry: "Fintech",
    size: "500-1000",
    description:
      "Globex International is a fintech company building the next generation of payment infrastructure for global commerce.",
    culture: {
      values: [
        "Customer obsession",
        "Move with urgency",
        "Earn trust through reliability",
      ],
      work_style: "Hybrid — 3 days in-office (NYC, London, Singapore)",
    },
    benefits: [
      "Competitive salary",
      "RSUs",
      "401k match",
      "Parental leave",
      "Learning & development budget",
    ],
    hiring_practices: {
      interview_stages: [
        "Recruiter call",
        "Take-home exercise",
        "On-site (4 hours)",
        "Offer",
      ],
      average_time_to_hire_days: 18,
    },
  },
  initech: {
    id: "initech",
    name: "Initech Systems",
    url: "https://initech.example.com/careers",
    industry: "Enterprise SaaS",
    size: "200-500",
    description:
      "Initech Systems builds workflow automation for enterprise operations teams. Series B, growing fast.",
    culture: {
      values: [
        "Solve hard problems simply",
        "Win as a team",
        "Iterate with customers",
      ],
      work_style: "Remote-friendly with hubs in Austin and Denver",
    },
    benefits: [
      "Equity",
      "Flexible hours",
      "Health insurance",
      "Professional development",
      "Team offsites",
    ],
    hiring_practices: {
      interview_stages: [
        "Intro call",
        "Technical screen",
        "Pair programming",
        "Culture chat",
        "Offer",
      ],
      average_time_to_hire_days: 14,
    },
  },
};

// ── Job Postings ──
export const jobs: JobPosting[] = [
  {
    ojcp_id: "acme:sbe-2026-001",
    title: "Senior Backend Engineer",
    employer: { name: "Acme Corp", id: "acme" },
    datePosted: "2026-03-01",
    employmentType: "full_time",
    description:
      "We're looking for a senior backend engineer to help scale our API platform serving 10M+ requests/day. You'll work on Go microservices, design distributed systems, and mentor junior engineers.",
    baseSalary: { currency: "USD", minValue: 170000, maxValue: 210000 },
    jobLocation: { country: "US", remote: true },
    requisition_id: "REQ-2026-0142",
    department: "Engineering",
    hiring_manager: "Dana Park",
    remote_policy: "remote",
    skills_required: ["Go", "PostgreSQL", "gRPC", "Kubernetes"],
    skills_preferred: ["Terraform", "Redis", "OpenTelemetry"],
    team_context:
      "Platform Engineering (8 engineers). Reports to VP of Engineering. Owns core API infrastructure, developer tooling, and reliability.",
    urgency: "high",
    application_volume_signal: "moderate",
    agent_notes:
      "Strong Go experience is essential. Distributed systems background preferred over web framework experience.",
    apply_paths: [
      {
        type: "provider_hosted",
        supports_agent_submission: true,
        url: "https://ojcp.dev/api/mock-apply/acme-sbe-2026-001",
        required_fields: ["resume", "email", "name"],
        estimated_completion_minutes: 2,
      },
      {
        type: "ats_direct",
        supports_agent_submission: false,
        url: "https://boards.greenhouse.io/acme/jobs/example",
      },
    ],
  },
  {
    ojcp_id: "acme:fe-2026-002",
    title: "Staff Frontend Engineer",
    employer: { name: "Acme Corp", id: "acme" },
    datePosted: "2026-02-28",
    employmentType: "full_time",
    description:
      "Join Acme as a Staff Frontend Engineer to lead our design system and component library. You'll set technical direction for our React codebase and work closely with design.",
    baseSalary: { currency: "USD", minValue: 190000, maxValue: 240000 },
    jobLocation: { city: "San Francisco", state: "CA", country: "US", remote: true },
    skills_required: ["React", "TypeScript", "CSS", "Design Systems"],
    skills_preferred: ["Next.js", "Figma", "Storybook", "Accessibility"],
    team_context:
      "Frontend Platform (5 engineers). Reports to Director of Engineering.",
    urgency: "moderate",
    application_volume_signal: "high",
    apply_paths: [
      {
        type: "provider_hosted",
        supports_agent_submission: true,
        url: "https://ojcp.dev/api/mock-apply/acme-fe-2026-002",
        required_fields: ["resume", "email", "name", "portfolio_url"],
        estimated_completion_minutes: 3,
      },
    ],
  },
  {
    ojcp_id: "globex:pse-2026-001",
    title: "Principal Software Engineer — Payments",
    employer: { name: "Globex International", id: "globex" },
    datePosted: "2026-03-05",
    employmentType: "full_time",
    description:
      "Lead the architecture of Globex's real-time payment processing system handling $2B+ in annual transaction volume. You'll drive technical decisions across the payments domain.",
    baseSalary: { currency: "USD", minValue: 220000, maxValue: 280000 },
    jobLocation: { city: "New York", state: "NY", country: "US", remote: false },
    requisition_id: "GX-ENG-2026-019",
    department: "Payments Engineering",
    hiring_manager: "Alex Chen",
    remote_policy: "on_site",
    skills_required: ["Java", "Kafka", "PostgreSQL", "Payment Systems"],
    skills_preferred: ["Kotlin", "Event Sourcing", "PCI Compliance"],
    team_context:
      "Payments Core (12 engineers). Reports to CTO. Owns the transaction engine, ledger, and reconciliation systems.",
    urgency: "critical",
    application_volume_signal: "low",
    agent_notes:
      "This is a high-impact principal role. Candidates should have 10+ years and direct payment systems experience.",
    apply_paths: [
      {
        type: "provider_hosted",
        supports_agent_submission: true,
        url: "https://ojcp.dev/api/mock-apply/globex-pse-2026-001",
        required_fields: ["resume", "email", "name", "cover_letter"],
        estimated_completion_minutes: 5,
      },
    ],
  },
  {
    ojcp_id: "globex:mle-2026-002",
    title: "Machine Learning Engineer",
    employer: { name: "Globex International", id: "globex" },
    datePosted: "2026-03-03",
    employmentType: "full_time",
    description:
      "Build fraud detection and risk scoring models for Globex's payment platform. You'll work with petabyte-scale transaction data and deploy models to production.",
    baseSalary: { currency: "USD", minValue: 160000, maxValue: 200000 },
    jobLocation: { city: "New York", state: "NY", country: "US", remote: true },
    skills_required: ["Python", "PyTorch", "SQL", "MLOps"],
    skills_preferred: ["Spark", "Feature Stores", "A/B Testing"],
    team_context:
      "ML Platform (6 engineers). Reports to Head of Data Science.",
    urgency: "high",
    application_volume_signal: "moderate",
    apply_paths: [
      {
        type: "provider_hosted",
        supports_agent_submission: true,
        url: "https://ojcp.dev/api/mock-apply/globex-mle-2026-002",
        required_fields: ["resume", "email", "name"],
        estimated_completion_minutes: 2,
      },
    ],
  },
  {
    ojcp_id: "initech:fse-2026-001",
    title: "Full Stack Engineer",
    employer: { name: "Initech Systems", id: "initech" },
    datePosted: "2026-03-07",
    employmentType: "full_time",
    description:
      "Build and ship features across the Initech platform — from React frontend to Node.js API to database. We value product-minded engineers who ship fast.",
    baseSalary: { currency: "USD", minValue: 130000, maxValue: 170000 },
    jobLocation: { city: "Austin", state: "TX", country: "US", remote: true },
    skills_required: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    skills_preferred: ["GraphQL", "AWS", "Docker"],
    team_context:
      "Product Engineering (10 engineers). Reports to Engineering Manager.",
    urgency: "moderate",
    application_volume_signal: "high",
    apply_paths: [
      {
        type: "provider_hosted",
        supports_agent_submission: true,
        url: "https://ojcp.dev/api/mock-apply/initech-fse-2026-001",
        required_fields: ["resume", "email", "name"],
        estimated_completion_minutes: 2,
      },
      {
        type: "external_redirect",
        supports_agent_submission: false,
        url: "https://initech.example.com/careers/fse-2026-001",
      },
    ],
  },
  {
    ojcp_id: "initech:devrel-2026-002",
    title: "Developer Relations Engineer",
    employer: { name: "Initech Systems", id: "initech" },
    datePosted: "2026-03-06",
    employmentType: "full_time",
    description:
      "Be the voice of Initech in the developer community. Write tutorials, speak at conferences, build sample apps, and shape our public API developer experience.",
    baseSalary: { currency: "USD", minValue: 140000, maxValue: 180000 },
    jobLocation: { country: "US", remote: true },
    skills_required: ["Technical Writing", "Public Speaking", "JavaScript", "APIs"],
    skills_preferred: ["Python", "Open Source", "Video Production"],
    team_context:
      "Developer Experience (3 engineers). Reports to Head of Product.",
    urgency: "low",
    application_volume_signal: "low",
    agent_notes:
      "Looking for someone who has shipped developer-facing content (blog posts, talks, docs). Code samples welcome.",
    apply_paths: [
      {
        type: "provider_hosted",
        supports_agent_submission: true,
        url: "https://ojcp.dev/api/mock-apply/initech-devrel-2026-002",
        required_fields: ["resume", "email", "name", "portfolio_url"],
        estimated_completion_minutes: 3,
      },
    ],
  },
  {
    ojcp_id: "acme:sre-2026-003",
    title: "Site Reliability Engineer",
    employer: { name: "Acme Corp", id: "acme" },
    datePosted: "2026-02-25",
    employmentType: "full_time",
    description:
      "Own the reliability and observability of Acme's cloud infrastructure. You'll build tooling, respond to incidents, and drive our SLO culture.",
    baseSalary: { currency: "USD", minValue: 155000, maxValue: 195000 },
    jobLocation: { country: "US", remote: true },
    skills_required: ["Kubernetes", "Terraform", "Prometheus", "Linux"],
    skills_preferred: ["Go", "PagerDuty", "Chaos Engineering"],
    team_context:
      "Infrastructure (6 engineers). Reports to Director of Infrastructure.",
    urgency: "moderate",
    application_volume_signal: "moderate",
    apply_paths: [
      {
        type: "ats_direct",
        supports_agent_submission: true,
        url: "https://ojcp.dev/api/mock-apply/acme-sre-2026-003",
        required_fields: ["resume", "email", "name"],
        form_skill_url: "https://ojcp.dev/api/form-skills/greenhouse-basic",
        estimated_completion_minutes: 5,
      },
    ],
  },
  {
    ojcp_id: "globex:pm-2026-003",
    title: "Senior Product Manager — API Platform",
    employer: { name: "Globex International", id: "globex" },
    datePosted: "2026-03-04",
    employmentType: "full_time",
    description:
      "Define the product roadmap for Globex's public API platform. You'll work with engineering, design, and partnerships to build the best developer experience in payments.",
    baseSalary: { currency: "USD", minValue: 165000, maxValue: 210000 },
    jobLocation: { city: "New York", state: "NY", country: "US", remote: false },
    skills_required: ["Product Management", "APIs", "Developer Experience", "Analytics"],
    skills_preferred: ["Fintech", "Technical Background", "SQL"],
    team_context:
      "API Platform (8 engineers). Reports to VP of Product.",
    urgency: "moderate",
    application_volume_signal: "high",
    apply_paths: [
      {
        type: "provider_hosted",
        supports_agent_submission: true,
        url: "https://ojcp.dev/api/mock-apply/globex-pm-2026-003",
        required_fields: ["resume", "email", "name"],
        estimated_completion_minutes: 3,
      },
    ],
  },
  {
    ojcp_id: "globex:sa-2026-004",
    title: "Security Analyst — Financial Compliance",
    employer: { name: "Globex International", id: "globex" },
    datePosted: "2026-03-10",
    employmentType: "full_time",
    description:
      "Join Globex's compliance team to monitor financial transactions, investigate suspicious activity, and ensure regulatory compliance. Identity verification required due to financial regulatory requirements.",
    baseSalary: { currency: "USD", minValue: 120000, maxValue: 160000 },
    jobLocation: { city: "New York", state: "NY", country: "US", remote: false },
    skills_required: ["Financial Compliance", "AML", "SQL", "Risk Analysis"],
    skills_preferred: ["Python", "Tableau", "CAMS Certification"],
    team_context:
      "Financial Compliance (8 members). Reports to Chief Compliance Officer.",
    urgency: "high",
    application_volume_signal: "low",
    agent_notes:
      "Identity verification required via ID.me due to financial regulatory requirements. Candidates must be US citizens.",
    apply_paths: [
      {
        type: "provider_hosted",
        supports_agent_submission: true,
        url: "https://ojcp.dev/api/mock-apply/globex-sa-2026-004",
        required_fields: ["resume", "email", "name", "work_authorization"],
        estimated_completion_minutes: 10,
        requires_verification: true,
        accepted_verifiers: ["id.me"],
      },
    ],
  },
  {
    ojcp_id: "initech:ciso-2026-003",
    title: "Chief Information Security Officer",
    employer: { name: "Initech Systems", id: "initech" },
    datePosted: "2026-03-12",
    employmentType: "full_time",
    description:
      "Lead Initech's security program. You'll set security strategy, manage compliance certifications, and build out the security team. Identity verification and background check required.",
    baseSalary: { currency: "USD", minValue: 200000, maxValue: 280000 },
    jobLocation: { city: "Austin", state: "TX", country: "US", remote: false },
    requisition_id: "IT-SEC-2026-001",
    department: "Security",
    hiring_manager: "Jordan Lee",
    remote_policy: "hybrid",
    skills_required: [
      "Information Security",
      "Compliance",
      "Risk Management",
      "SOC 2",
    ],
    skills_preferred: ["CISSP", "ISO 27001", "Incident Response", "Cloud Security"],
    team_context:
      "Security (4 members). Reports to CEO. Building the security function from the ground up. You'll be the first dedicated security leader.",
    urgency: "critical",
    application_volume_signal: "low",
    agent_notes:
      "Requires both identity verification (ID.me) and background check (Checkr) due to access to sensitive customer data and SOC 2 requirements.",
    apply_paths: [
      {
        type: "provider_hosted",
        supports_agent_submission: true,
        url: "https://ojcp.dev/api/mock-apply/initech-ciso-2026-003",
        required_fields: ["resume", "email", "name", "work_authorization"],
        estimated_completion_minutes: 15,
        requires_verification: true,
        accepted_verifiers: ["id.me", "checkr"],
      },
    ],
  },
];

// ── Fit scoring ──
export function computeFitScore(
  job: JobPosting,
  candidateSkills?: string[],
  candidateYears?: number
): { fit_score: number; fit_rationale: string } {
  if (!candidateSkills || candidateSkills.length === 0) {
    return { fit_score: 0, fit_rationale: "No candidate context provided." };
  }

  const required = job.skills_required || [];
  const preferred = job.skills_preferred || [];
  const allJobSkills = [...required, ...preferred];

  const matchedRequired = required.filter((s) =>
    candidateSkills.some((cs) => cs.toLowerCase() === s.toLowerCase())
  );
  const matchedPreferred = preferred.filter((s) =>
    candidateSkills.some((cs) => cs.toLowerCase() === s.toLowerCase())
  );

  const requiredScore =
    required.length > 0 ? matchedRequired.length / required.length : 0;
  const preferredScore =
    preferred.length > 0 ? matchedPreferred.length / preferred.length : 0;

  // Weighted: 70% required skills, 20% preferred, 10% experience
  let score = requiredScore * 0.7 + preferredScore * 0.2;

  if (candidateYears && candidateYears >= 5) {
    score += 0.1;
  } else if (candidateYears && candidateYears >= 3) {
    score += 0.05;
  }

  score = Math.min(1, Math.round(score * 100) / 100);

  const parts: string[] = [];
  if (matchedRequired.length > 0) {
    parts.push(
      `Matches ${matchedRequired.length}/${required.length} required skills (${matchedRequired.join(", ")})`
    );
  }
  if (matchedPreferred.length > 0) {
    parts.push(
      `${matchedPreferred.length}/${preferred.length} preferred skills`
    );
  }
  if (candidateYears) {
    parts.push(`${candidateYears} years experience`);
  }
  if (parts.length === 0) {
    parts.push(`No skill overlap with ${allJobSkills.join(", ")}`);
  }

  return {
    fit_score: score,
    fit_rationale: parts.join(". ") + ".",
  };
}

// ── Application sessions ──
interface ApplicationSession {
  application_id: string;
  job_id: string;
  status: string;
  created_at: string;
  apply_path: string;
  session_token: string;
  verification_steps?: VerificationStep[];
  verification_completed?: boolean;
}

const applicationSessions = new Map<string, ApplicationSession>();

export function createApplicationSession(
  jobId: string,
  applyPath: string,
  requiresVerification = false,
  acceptedVerifiers: string[] = ["id.me"]
) {
  const id = `app_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const token = `sess_${Math.random().toString(36).slice(2, 12)}`;
  const session: ApplicationSession = {
    application_id: id,
    job_id: jobId,
    status: requiresVerification ? "pending_verification" : "submitted",
    created_at: new Date().toISOString(),
    apply_path: applyPath,
    session_token: token,
  };

  if (requiresVerification) {
    session.verification_steps = createVerificationSteps(id, acceptedVerifiers);
    session.verification_completed = false;
  }

  applicationSessions.set(id, session);
  return session;
}

export function getApplicationSession(applicationId: string) {
  const session = applicationSessions.get(applicationId);
  if (!session) return null;

  // Only progress time-based status for submitted (non-verification) sessions
  if (session.status === "submitted") {
    const elapsed = Date.now() - new Date(session.created_at).getTime();
    if (elapsed > 60000) {
      session.status = "under_review";
    }
    if (elapsed > 120000) {
      session.status = "interview_scheduled";
    }
  }

  return session;
}

export function completeVerification(applicationId: string): ApplicationSession | null {
  const session = applicationSessions.get(applicationId);
  if (!session || session.status !== "pending_verification") return null;
  session.status = "submitted";
  session.verification_completed = true;
  return session;
}

// ── Verification mock data ──

const verifierConfig: Record<
  string,
  { name: string; type: VerificationStep["type"]; baseUrl: string; minutes: number; instructions: string }
> = {
  "id.me": {
    name: "ID.me",
    type: "identity",
    baseUrl: "https://verify.id.me/ojcp",
    minutes: 5,
    instructions:
      "Candidate must complete ID.me identity verification. Open the verification URL in a browser.",
  },
  checkr: {
    name: "Checkr",
    type: "background_check",
    baseUrl: "https://checkr.com/ojcp/verify",
    minutes: 10,
    instructions:
      "Candidate must authorize a background check via Checkr. Open the verification URL and complete the authorization form.",
  },
};

// ── Screening questions ──

const screeningQuestionsByJob: Record<string, ScreeningQuestion[]> = {
  "globex:sa-2026-004": [
    {
      question_id: "work_auth",
      question_text: "Are you authorized to work in the United States?",
      answer_type: "boolean",
      required: true,
    },
    {
      question_id: "aml_experience",
      question_text: "How many years of AML/compliance experience do you have?",
      answer_type: "number",
      required: true,
      min: 0,
      max: 50,
    },
    {
      question_id: "clearance",
      question_text: "Do you currently hold any financial regulatory certifications?",
      answer_type: "single_select",
      options: ["CAMS", "CFE", "CRCM", "None", "Other"],
      required: false,
    },
  ],
  "initech:ciso-2026-003": [
    {
      question_id: "security_certs",
      question_text: "Which security certifications do you hold?",
      answer_type: "multi_select",
      options: ["CISSP", "CISM", "CEH", "OSCP", "ISO 27001 Lead Auditor", "None"],
      required: true,
    },
    {
      question_id: "leadership_years",
      question_text: "How many years of security leadership experience do you have?",
      answer_type: "number",
      required: true,
      min: 0,
      max: 40,
    },
  ],
  "acme:sbe-2026-001": [
    {
      question_id: "start_date",
      question_text: "What is your earliest available start date?",
      answer_type: "date",
      required: false,
    },
    {
      question_id: "visa_sponsorship",
      question_text: "Will you require visa sponsorship now or in the future?",
      answer_type: "boolean",
      required: true,
    },
    {
      question_id: "cover_letter",
      question_text: "Please provide a brief cover letter.",
      answer_type: "text",
      required: false,
      min_length: 50,
      max_length: 2000,
    },
  ],
};

export function getScreeningQuestions(jobId: string): ScreeningQuestion[] {
  return screeningQuestionsByJob[jobId] || [];
}

function createVerificationSteps(
  applicationId: string,
  acceptedVerifiers: string[] = ["id.me"]
): VerificationStep[] {
  const steps: VerificationStep[] = [];
  for (const [index, verifierId] of acceptedVerifiers.entries()) {
    const config = verifierConfig[verifierId];
    if (!config) continue;
    steps.push({
      step_id: `vs_${applicationId}_${index + 1}`,
      type: config.type,
      verifier_id: verifierId,
      verifier_name: config.name,
      verification_url: `${config.baseUrl}?session=mock_${applicationId}`,
      required: true,
      human_required: true,
      estimated_completion_minutes: config.minutes,
      instructions: config.instructions,
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      proof_delivery: "agent_submitted",
    });
  }
  return steps;
}
