import { describe, it, expect } from "vitest";
import {
  VerificationProofSchema,
  VerifierManifestSchema,
  SubmitApplicationInputSchema,
  BeginApplicationInputSchema,
  JobPostingSchema,
  CandidateContextSchema,
  VerificationStepSchema,
  ScreeningQuestionSchema,
  ApplicationDataSchema,
  SourceAttributionSchema,
  WarningSchema,
  ScreeningErrorSchema,
} from "../schemas";

// ── VerificationProofSchema ──

describe("VerificationProofSchema", () => {
  const validProof = {
    step_id: "vs_1",
    verifier_id: "id.me",
    verification_type: "identity" as const,
    proof_token: "eyJhbGciOiJFUzI1NiJ9.eyJpc3MiOiJpZC5tZSJ9.sig",
    subject_hash: "a1b2c3d4e5f6",
    issued_at: "2026-03-18T14:30:00Z",
    expires_at: "2026-03-19T14:30:00Z",
  };

  it("accepts valid proof", () => {
    const result = VerificationProofSchema.safeParse(validProof);
    expect(result.success).toBe(true);
  });

  it("rejects missing subject_hash", () => {
    const { subject_hash, ...proof } = validProof;
    const result = VerificationProofSchema.safeParse(proof);
    expect(result.success).toBe(false);
  });

  it("rejects missing proof_token", () => {
    const { proof_token, ...proof } = validProof;
    const result = VerificationProofSchema.safeParse(proof);
    expect(result.success).toBe(false);
  });

  it("rejects invalid verification_type", () => {
    const result = VerificationProofSchema.safeParse({
      ...validProof,
      verification_type: "invalid_type",
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid verification types", () => {
    const types = [
      "identity",
      "government_id",
      "biometric",
      "address",
      "employment",
      "education",
      "background_check",
    ];
    for (const type of types) {
      const result = VerificationProofSchema.safeParse({
        ...validProof,
        verification_type: type,
      });
      expect(result.success).toBe(true);
    }
  });
});

// ── VerifierManifestSchema ──

describe("VerifierManifestSchema", () => {
  const validManifest = {
    ojcp_verifier_version: "0.1",
    verifier_id: "id.me",
    verifier_name: "ID.me",
    verification_types: ["identity"],
    public_keys_url: "https://id.me/.well-known/jwks.json",
  };

  it("accepts valid manifest", () => {
    const result = VerifierManifestSchema.safeParse(validManifest);
    expect(result.success).toBe(true);
  });

  it("accepts jws proof_format", () => {
    const result = VerifierManifestSchema.safeParse({
      ...validManifest,
      proof_format: "jws",
    });
    expect(result.success).toBe(true);
  });

  it("accepts jws+jwe proof_format", () => {
    const result = VerifierManifestSchema.safeParse({
      ...validManifest,
      proof_format: "jws+jwe",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid proof_format", () => {
    const result = VerifierManifestSchema.safeParse({
      ...validManifest,
      proof_format: "plain",
    });
    expect(result.success).toBe(false);
  });

  it("accepts valid signing_algorithms", () => {
    const result = VerifierManifestSchema.safeParse({
      ...validManifest,
      signing_algorithms: ["ES256", "RS256"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid signing_algorithm", () => {
    const result = VerifierManifestSchema.safeParse({
      ...validManifest,
      signing_algorithms: ["HS256"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing public_keys_url", () => {
    const { public_keys_url, ...manifest } = validManifest;
    const result = VerifierManifestSchema.safeParse(manifest);
    expect(result.success).toBe(false);
  });

  it("accepts proof_delivery_methods", () => {
    const result = VerifierManifestSchema.safeParse({
      ...validManifest,
      proof_delivery_methods: ["callback", "redirect", "polling"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid proof_delivery_method", () => {
    const result = VerifierManifestSchema.safeParse({
      ...validManifest,
      proof_delivery_methods: ["webhook"],
    });
    expect(result.success).toBe(false);
  });
});

// ── VerificationStepSchema ──

describe("VerificationStepSchema", () => {
  it("accepts valid step with expires_at", () => {
    const result = VerificationStepSchema.safeParse({
      step_id: "vs_1",
      type: "identity",
      verifier_id: "id.me",
      verification_url: "https://verify.id.me/ojcp?session=xyz",
      required: true,
      human_required: true,
      expires_at: "2026-03-20T12:00:00Z",
    });
    expect(result.success).toBe(true);
  });

  it("accepts step without optional expires_at", () => {
    const result = VerificationStepSchema.safeParse({
      step_id: "vs_1",
      type: "identity",
      verifier_id: "id.me",
      verification_url: "https://verify.id.me/ojcp?session=xyz",
      required: true,
      human_required: true,
    });
    expect(result.success).toBe(true);
  });
});

// ── SubmitApplicationInputSchema ──

describe("SubmitApplicationInputSchema", () => {
  it("accepts input with verification proofs", () => {
    const result = SubmitApplicationInputSchema.safeParse({
      application_id: "app_123",
      session_token: "sess_abc",
      verification_proofs: [
        {
          step_id: "vs_1",
          verifier_id: "id.me",
          verification_type: "identity",
          proof_token: "eyJ.eyJ.sig",
          subject_hash: "abc123",
          issued_at: "2026-03-18T14:30:00Z",
          expires_at: "2026-03-19T14:30:00Z",
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("accepts input without proofs", () => {
    const result = SubmitApplicationInputSchema.safeParse({
      application_id: "app_123",
      session_token: "sess_abc",
    });
    expect(result.success).toBe(true);
  });

  it("accepts input with application_data", () => {
    const result = SubmitApplicationInputSchema.safeParse({
      application_id: "app_123",
      session_token: "sess_abc",
      application_data: {
        answers: { work_auth: true, experience: 5 },
        cover_letter: "I am excited to apply...",
        resume_url: "https://example.com/resume.pdf",
        custom_fields: { referral_code: "ABC123" },
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing application_id", () => {
    const result = SubmitApplicationInputSchema.safeParse({
      session_token: "sess_abc",
    });
    expect(result.success).toBe(false);
  });
});

// ── JobPostingSchema ──

describe("JobPostingSchema", () => {
  it("accepts valid job posting", () => {
    const result = JobPostingSchema.safeParse({
      ojcp_id: "acme:test-001",
      title: "Test Engineer",
      employer: { name: "Acme" },
      datePosted: "2026-03-01",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing title", () => {
    const result = JobPostingSchema.safeParse({
      ojcp_id: "acme:test-001",
      employer: { name: "Acme" },
      datePosted: "2026-03-01",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid employment type", () => {
    const result = JobPostingSchema.safeParse({
      ojcp_id: "acme:test-001",
      title: "Test",
      employer: { name: "Acme" },
      datePosted: "2026-03-01",
      employmentType: "freelance",
    });
    expect(result.success).toBe(false);
  });

  it("accepts ATS fields (requisition_id, department, hiring_manager, remote_policy)", () => {
    const result = JobPostingSchema.safeParse({
      ojcp_id: "acme:test-001",
      title: "Test Engineer",
      employer: { name: "Acme" },
      datePosted: "2026-03-01",
      requisition_id: "REQ-001",
      department: "Engineering",
      hiring_manager: "Jane Doe",
      remote_policy: "hybrid",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid remote_policy", () => {
    const result = JobPostingSchema.safeParse({
      ojcp_id: "acme:test-001",
      title: "Test",
      employer: { name: "Acme" },
      datePosted: "2026-03-01",
      remote_policy: "flexible",
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid remote_policy values", () => {
    for (const policy of ["fully_remote", "hybrid", "on_site"]) {
      const result = JobPostingSchema.safeParse({
        ojcp_id: "acme:test-001",
        title: "Test",
        employer: { name: "Acme" },
        datePosted: "2026-03-01",
        remote_policy: policy,
      });
      expect(result.success).toBe(true);
    }
  });
});

// ── CandidateContextSchema ──

describe("CandidateContextSchema", () => {
  it("accepts valid candidate context", () => {
    const result = CandidateContextSchema.safeParse({
      ojcp_candidate_context_version: "0.1",
      consent_scope: "search_personalization",
      skills: ["Go", "PostgreSQL"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid consent_scope", () => {
    const result = CandidateContextSchema.safeParse({
      ojcp_candidate_context_version: "0.1",
      consent_scope: "unlimited",
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid consent scopes", () => {
    for (const scope of ["search_personalization", "fit_scoring", "application_prefill", "full_profile"]) {
      const result = CandidateContextSchema.safeParse({
        ojcp_candidate_context_version: "0.1",
        consent_scope: scope,
      });
      expect(result.success).toBe(true);
    }
  });
});

// ── ScreeningQuestionSchema ──

describe("ScreeningQuestionSchema", () => {
  it("accepts valid text question", () => {
    const result = ScreeningQuestionSchema.safeParse({
      question_id: "q1",
      question_text: "Why do you want this job?",
      answer_type: "text",
      required: true,
    });
    expect(result.success).toBe(true);
  });

  it("accepts single_select with options", () => {
    const result = ScreeningQuestionSchema.safeParse({
      question_id: "q2",
      question_text: "Preferred start date?",
      answer_type: "single_select",
      options: ["Immediately", "2 weeks", "1 month"],
    });
    expect(result.success).toBe(true);
  });

  it("accepts all valid answer types", () => {
    for (const type of ["text", "boolean", "single_select", "multi_select", "number", "date"]) {
      const result = ScreeningQuestionSchema.safeParse({
        question_id: "q",
        question_text: "Test?",
        answer_type: type,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid answer_type", () => {
    const result = ScreeningQuestionSchema.safeParse({
      question_id: "q",
      question_text: "Test?",
      answer_type: "essay",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing question_text", () => {
    const result = ScreeningQuestionSchema.safeParse({
      question_id: "q",
      answer_type: "text",
    });
    expect(result.success).toBe(false);
  });

  it("accepts validation fields (min_length, max_length, pattern)", () => {
    const result = ScreeningQuestionSchema.safeParse({
      question_id: "q",
      question_text: "Describe yourself",
      answer_type: "text",
      min_length: 50,
      max_length: 2000,
      pattern: "^[A-Za-z]",
    });
    expect(result.success).toBe(true);
  });

  it("accepts numeric validation fields (min, max)", () => {
    const result = ScreeningQuestionSchema.safeParse({
      question_id: "q",
      question_text: "Years of experience?",
      answer_type: "number",
      required: true,
      min: 0,
      max: 50,
    });
    expect(result.success).toBe(true);
  });
});

// ── ApplicationDataSchema ──

describe("ApplicationDataSchema", () => {
  it("accepts full application data", () => {
    const result = ApplicationDataSchema.safeParse({
      answers: { q1: "Yes", q2: 5 },
      cover_letter: "Dear hiring manager...",
      resume_url: "https://example.com/resume.pdf",
      custom_fields: { referral: "internal" },
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty object", () => {
    const result = ApplicationDataSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts answers-only", () => {
    const result = ApplicationDataSchema.safeParse({
      answers: { work_auth: true },
    });
    expect(result.success).toBe(true);
  });
});

// ── SourceAttributionSchema ──

describe("SourceAttributionSchema", () => {
  it("accepts full source attribution", () => {
    const result = SourceAttributionSchema.safeParse({
      referrer: "indeed.com",
      reference_id: "IND-2026-abc123",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty object (all fields optional)", () => {
    const result = SourceAttributionSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts referrer-only", () => {
    const result = SourceAttributionSchema.safeParse({
      referrer: "linkedin.com",
    });
    expect(result.success).toBe(true);
  });
});

// ── BeginApplicationInputSchema with source_attribution ──

describe("BeginApplicationInputSchema", () => {
  it("accepts input with source_attribution", () => {
    const result = BeginApplicationInputSchema.safeParse({
      job_id: "acme:sbe-2026-001",
      source_attribution: {
        referrer: "indeed.com",
        reference_id: "IND-123",
      },
    });
    expect(result.success).toBe(true);
  });

  it("accepts input without source_attribution", () => {
    const result = BeginApplicationInputSchema.safeParse({
      job_id: "acme:sbe-2026-001",
    });
    expect(result.success).toBe(true);
  });
});

// ── SubmitApplicationInputSchema with source_attribution ──

describe("SubmitApplicationInputSchema - source_attribution", () => {
  it("accepts input with source_attribution", () => {
    const result = SubmitApplicationInputSchema.safeParse({
      application_id: "app_123",
      session_token: "sess_abc",
      source_attribution: {
        referrer: "linkedin.com",
        reference_id: "LI-456",
      },
    });
    expect(result.success).toBe(true);
  });
});

// ── WarningSchema ──

describe("WarningSchema", () => {
  it("accepts fields_ignored warning with fields", () => {
    const result = WarningSchema.safeParse({
      code: "fields_ignored",
      message: "Fields exceeded scope.",
      fields: ["name", "email"],
    });
    expect(result.success).toBe(true);
  });

  it("accepts warning without optional fields array", () => {
    const result = WarningSchema.safeParse({
      code: "scope_exceeded",
      message: "Scope exceeded.",
    });
    expect(result.success).toBe(true);
  });

  it("accepts all valid warning codes", () => {
    for (const code of ["fields_ignored", "scope_exceeded", "deprecated_field", "answer_coerced"]) {
      const result = WarningSchema.safeParse({ code, message: "test" });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid warning code", () => {
    const result = WarningSchema.safeParse({
      code: "unknown_code",
      message: "test",
    });
    expect(result.success).toBe(false);
  });
});

// ── ScreeningErrorSchema ──

describe("ScreeningErrorSchema", () => {
  it("accepts valid screening error", () => {
    const result = ScreeningErrorSchema.safeParse({
      question_id: "work_auth",
      error: "required_missing",
      message: "Required question is missing.",
    });
    expect(result.success).toBe(true);
  });

  it("accepts all valid error codes", () => {
    for (const error of ["required_missing", "invalid_format", "out_of_range", "invalid_option", "too_short", "too_long"]) {
      const result = ScreeningErrorSchema.safeParse({
        question_id: "q",
        error,
        message: "test",
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid error code", () => {
    const result = ScreeningErrorSchema.safeParse({
      question_id: "q",
      error: "bad_code",
      message: "test",
    });
    expect(result.success).toBe(false);
  });
});
