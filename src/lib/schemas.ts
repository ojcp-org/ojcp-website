import { z } from "zod/v4";

// ── Apply Path ──
export const ApplyPathSchema = z.object({
  type: z.enum([
    "ats_direct",
    "adaptive_apply",
    "apply_anywhere",
    "platform_apply",
    "email_apply",
    "external_url",
    "custom",
  ]),
  product_name: z.string().optional(),
  supports_agent_submission: z.boolean(),
  url: z.url().optional(),
  required_fields: z.array(z.string()).optional(),
  estimated_completion_minutes: z.number().optional(),
  form_skill_url: z.url().optional(),
  requires_verification: z.boolean().optional(),
  accepted_verifiers: z.array(z.string()).optional(),
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
  // ATS fields
  requisition_id: z.string().optional(),
  department: z.string().optional(),
  hiring_manager: z.string().optional(),
  remote_policy: z.enum(["fully_remote", "hybrid", "on_site"]).optional(),
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
  consent_scope: z.enum(["search_personalization", "fit_scoring", "application_prefill", "full_profile"]),
  name: z.string().optional(),
  email: z.email().optional(),
  skills: z.array(z.string()).optional(),
  experience_years: z.number().optional(),
  current_title: z.string().optional(),
  resume_url: z.url().optional(),
  resume_embedding_hash: z.string().optional(),
  location_preference: z
    .object({
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      remote_ok: z.boolean().optional(),
    })
    .optional(),
  employment_type_preference: z.array(z.string()).optional(),
  salary_expectation: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      currency: z.string().optional(),
    })
    .optional(),
  work_authorization: z.string().optional(),
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

// ── Verification Step ──
export const VerificationStepSchema = z.object({
  step_id: z.string(),
  type: z.enum([
    "identity",
    "government_id",
    "biometric",
    "address",
    "employment",
    "education",
    "background_check",
  ]),
  verifier_id: z.string(),
  verifier_name: z.string().optional(),
  verification_url: z.url(),
  required: z.boolean(),
  human_required: z.boolean(),
  estimated_completion_minutes: z.number().optional(),
  instructions: z.string().optional(),
  expires_at: z.string().optional(),
  proof_delivery: z.enum(["agent_submitted", "provider_managed"]).default("agent_submitted"),
});

// ── Screening Question ──
export const ScreeningQuestionSchema = z.object({
  question_id: z.string(),
  question_text: z.string(),
  answer_type: z.enum(["text", "boolean", "single_select", "multi_select", "number", "date"]),
  options: z.array(z.string()).optional(),
  required: z.boolean().optional(),
  // Validation constraints
  min_length: z.number().optional(),
  max_length: z.number().optional(),
  pattern: z.string().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
});

// ── Application Data ──
export const ApplicationDataSchema = z.object({
  answers: z.record(z.string(), z.unknown()).optional(),
  cover_letter: z.string().optional(),
  resume_url: z.url().optional(),
  custom_fields: z.record(z.string(), z.unknown()).optional(),
});

// ── Verification Proof ──
export const VerificationProofSchema = z.object({
  step_id: z.string(),
  verifier_id: z.string(),
  verification_type: z.enum([
    "identity",
    "government_id",
    "biometric",
    "address",
    "employment",
    "education",
    "background_check",
  ]),
  proof_token: z.string(),
  subject_hash: z.string(),
  issued_at: z.string(),
  expires_at: z.string(),
});

// ── Verifier Manifest ──
export const VerifierManifestSchema = z.object({
  ojcp_verifier_version: z.string(),
  verifier_id: z.string(),
  verifier_name: z.string(),
  description: z.string().optional(),
  verification_types: z.array(z.string()),
  verification_endpoint: z.url().optional(),
  proof_delivery_methods: z.array(z.enum(["callback", "redirect", "polling"])).optional(),
  proof_format: z.enum(["jws", "jws+jwe"]).optional(),
  signing_algorithms: z.array(z.enum(["ES256", "ES384", "RS256", "RS384"])).optional(),
  proof_ttl_seconds: z.number().optional(),
  public_keys_url: z.url(),
  supported_countries: z.array(z.string()).optional(),
});

// ── Source Attribution ──
export const SourceAttributionSchema = z.object({
  referrer: z.string().optional(),
  reference_id: z.string().optional(),
});

// ── Warning (non-fatal response feedback) ──
export const WarningSchema = z.object({
  code: z.enum(["fields_ignored", "scope_exceeded", "deprecated_field", "answer_coerced"]),
  message: z.string(),
  fields: z.array(z.string()).optional(),
});

// ── Screening Error (submit_application validation) ──
export const ScreeningErrorSchema = z.object({
  question_id: z.string(),
  error: z.enum(["required_missing", "invalid_format", "out_of_range", "invalid_option", "too_short", "too_long"]),
  message: z.string(),
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
        .enum(["entry", "mid", "senior", "lead", "director", "executive"])
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
  source_attribution: SourceAttributionSchema.optional(),
});

export const CheckApplicationStatusInputSchema = z.object({
  application_id: z.string(),
});

export const SubmitApplicationInputSchema = z.object({
  application_id: z.string(),
  session_token: z.string(),
  application_data: ApplicationDataSchema.optional(),
  candidate_context: CandidateContextSchema.optional(),
  verification_proofs: z.array(VerificationProofSchema).optional(),
  agent_declaration: AgentDeclarationSchema.optional(),
  source_attribution: SourceAttributionSchema.optional(),
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
  supported_verifiers: z
    .array(
      z.object({
        verifier_id: z.string(),
        verifier_name: z.string().optional(),
        verifier_manifest_url: z.url().optional(),
        verification_types: z.array(z.string()).optional(),
        required_for_paths: z.array(z.string()).optional(),
      })
    )
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
export type VerificationStep = z.infer<typeof VerificationStepSchema>;
export type ScreeningQuestion = z.infer<typeof ScreeningQuestionSchema>;
export type ApplicationData = z.infer<typeof ApplicationDataSchema>;
export type VerificationProof = z.infer<typeof VerificationProofSchema>;
export type SourceAttribution = z.infer<typeof SourceAttributionSchema>;
export type Warning = z.infer<typeof WarningSchema>;
export type ScreeningError = z.infer<typeof ScreeningErrorSchema>;
export type VerifierManifest = z.infer<typeof VerifierManifestSchema>;
export type SearchJobsInput = z.infer<typeof SearchJobsInputSchema>;
export type GetJobDetailInput = z.infer<typeof GetJobDetailInputSchema>;
export type GetEmployerContextInput = z.infer<typeof GetEmployerContextInputSchema>;
export type BeginApplicationInput = z.infer<typeof BeginApplicationInputSchema>;
export type CheckApplicationStatusInput = z.infer<typeof CheckApplicationStatusInputSchema>;
export type SubmitApplicationInput = z.infer<typeof SubmitApplicationInputSchema>;
export type Manifest = z.infer<typeof ManifestSchema>;
export type RegistryProvider = z.infer<typeof RegistryProviderSchema>;
export type FindOjcpProvidersInput = z.infer<typeof FindOjcpProvidersInputSchema>;
