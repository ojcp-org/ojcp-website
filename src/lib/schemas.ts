import { z } from "zod/v4";

// ── Apply Path ──
export const ApplyPathSchema = z.object({
  type: z.enum([
    "ats_direct",
    "adaptive_apply",
    "apply_anywhere",
    "indeed_apply",
    "email_apply",
    "external_url",
    "custom",
  ]),
  supports_agent_submission: z.boolean(),
  url: z.url().optional(),
  required_fields: z.array(z.string()).optional(),
  estimated_completion_minutes: z.number().optional(),
  form_skill_url: z.url().optional(),
});

// ── JobPosting ──
export const JobPostingSchema = z.object({
  ojcp_id: z.string(),
  title: z.string(),
  employer: z.object({
    name: z.string(),
    id: z.string().optional(),
  }),
  datePosted: z.string(),
  employmentType: z
    .enum(["full_time", "part_time", "contract", "internship", "temporary"])
    .optional(),
  description: z.string().optional(),
  baseSalary: z
    .object({
      currency: z.string(),
      minValue: z.number(),
      maxValue: z.number(),
    })
    .optional(),
  jobLocation: z
    .object({
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      remote: z.boolean().optional(),
    })
    .optional(),
  skills_required: z.array(z.string()).optional(),
  skills_preferred: z.array(z.string()).optional(),
  team_context: z
    .object({
      team_name: z.string().optional(),
      team_size: z.number().optional(),
      reports_to: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  urgency: z.enum(["low", "moderate", "high", "critical"]).optional(),
  application_volume_signal: z
    .enum(["low", "moderate", "high", "very_high"])
    .optional(),
  agent_notes: z.string().optional(),
  apply_paths: z.array(ApplyPathSchema).optional(),
  fit_score: z.number().min(0).max(1).optional(),
  fit_rationale: z.string().optional(),
});

// ── CandidateContext ──
export const CandidateContextSchema = z.object({
  ojcp_candidate_context_version: z.string(),
  consent_scope: z.enum(["search_and_match", "apply", "full_profile"]),
  name: z.string().optional(),
  email: z.email().optional(),
  skills: z.array(z.string()).optional(),
  years_experience: z.number().optional(),
  resume_url: z.url().optional(),
  resume_embedding_hash: z.string().optional(),
  location: z
    .object({
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
});

// ── AgentDeclaration ──
export const AgentDeclarationSchema = z.object({
  agent_id: z.string(),
  agent_version: z.string().optional(),
  acting_on_behalf_of: z.enum([
    "human_user",
    "recruiter",
    "autonomous_workflow",
  ]),
  user_consent_token: z.string().optional(),
  interaction_mode: z.enum(["assisted", "autonomous", "supervised"]).optional(),
});

// ── Tool input schemas ──
export const SearchJobsInputSchema = z.object({
  query: z.string(),
  location: z
    .object({
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      remote_ok: z.boolean().optional(),
      radius_miles: z.number().optional(),
    })
    .optional(),
  filters: z
    .object({
      employment_type: z
        .enum(["full_time", "part_time", "contract", "internship", "temporary"])
        .optional(),
      salary_min: z.number().optional(),
      salary_max: z.number().optional(),
      experience_level: z
        .enum(["entry", "mid", "senior", "director", "executive"])
        .optional(),
      posted_within_days: z.number().optional(),
    })
    .optional(),
  candidate_context: CandidateContextSchema.optional(),
  pagination: z
    .object({
      limit: z.number().max(50).default(10),
      offset: z.number().default(0),
    })
    .optional(),
});

export const GetJobDetailInputSchema = z.object({
  job_id: z.string(),
  include_employer_context: z.boolean().default(true),
  candidate_context: CandidateContextSchema.optional(),
});

export const GetEmployerContextInputSchema = z.object({
  employer_id: z.string(),
});

export const BeginApplicationInputSchema = z.object({
  job_id: z.string(),
  apply_path: ApplyPathSchema.shape.type.optional(),
  candidate_context: CandidateContextSchema.optional(),
  agent_declaration: AgentDeclarationSchema.optional(),
});

export const CheckApplicationStatusInputSchema = z.object({
  application_id: z.string(),
});

// ── Manifest ──
export const ManifestSchema = z.object({
  ojcp_version: z.string(),
  provider: z.object({
    name: z.string(),
    url: z.url().optional(),
    contact_email: z.email().optional(),
    description: z.string().optional(),
  }),
  mcp_endpoint: z.url().optional(),
  tools: z.array(z.string()),
  apply_paths: z.array(ApplyPathSchema.shape.type).optional(),
  auth: z
    .object({
      type: z.string(),
      token_url: z.url().optional(),
    })
    .optional(),
  rate_limits: z
    .object({
      requests_per_minute: z.number().optional(),
      requests_per_day: z.number().optional(),
    })
    .optional(),
});

// ── Registry ──
export const RegistryProviderSchema = z.object({
  domain: z.string(),
  name: z.string(),
  description: z.string(),
  mcp_endpoint: z.string(),
  manifest_url: z.string(),
  industries: z.array(z.string()),
  location: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string(),
  }),
  tools: z.array(z.string()),
  apply_paths: z.array(z.string()),
  has_agent_apply: z.boolean(),
  verified: z.boolean(),
  verified_at: z.string(),
  registered_at: z.string(),
});

export const FindOjcpProvidersInputSchema = z.object({
  industry: z.string().optional(),
  employer_name: z.string().optional(),
  location: z.string().optional(),
  has_agent_apply: z.boolean().optional(),
});

// ── Type exports ──
export type ApplyPath = z.infer<typeof ApplyPathSchema>;
export type JobPosting = z.infer<typeof JobPostingSchema>;
export type CandidateContext = z.infer<typeof CandidateContextSchema>;
export type AgentDeclaration = z.infer<typeof AgentDeclarationSchema>;
export type SearchJobsInput = z.infer<typeof SearchJobsInputSchema>;
export type GetJobDetailInput = z.infer<typeof GetJobDetailInputSchema>;
export type GetEmployerContextInput = z.infer<typeof GetEmployerContextInputSchema>;
export type BeginApplicationInput = z.infer<typeof BeginApplicationInputSchema>;
export type CheckApplicationStatusInput = z.infer<typeof CheckApplicationStatusInputSchema>;
export type Manifest = z.infer<typeof ManifestSchema>;
export type RegistryProvider = z.infer<typeof RegistryProviderSchema>;
export type FindOjcpProvidersInput = z.infer<typeof FindOjcpProvidersInputSchema>;
