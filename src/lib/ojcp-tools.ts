import { decodeProtectedHeader, decodeJwt } from "jose";
import {
  jobs,
  employers,
  computeFitScore,
  createApplicationSession,
  getApplicationSession,
  completeVerification,
  getScreeningQuestions,
} from "./mock-data";
import type {
  SearchJobsInput,
  GetJobDetailInput,
  GetEmployerContextInput,
  BeginApplicationInput,
  CheckApplicationStatusInput,
  SubmitApplicationInput,
  ScreeningQuestion,
  Warning,
  ScreeningError,
} from "./schemas";
import { OJCP_VERSION } from "./site";

function ojcpError(error_code: string, message: string, details?: Record<string, unknown>) {
  return { ojcp_version: OJCP_VERSION, error_code, message, ...details };
}

export function searchJobs(input: SearchJobsInput) {
  let results = [...jobs];

  // Text search across title, description, skills
  const q = input.query.toLowerCase();
  results = results.filter((job) => {
    const searchable = [
      job.title,
      job.description,
      ...(job.skills_required || []),
      ...(job.skills_preferred || []),
      job.employer.name,
    ]
      .join(" ")
      .toLowerCase();
    return searchable.includes(q) || q.split(/\s+/).some((w) => searchable.includes(w));
  });

  // Location filter
  if (input.location) {
    if (input.location.remote_ok) {
      results = results.filter((j) => j.jobLocation?.remote);
    }
    if (input.location.country) {
      results = results.filter(
        (j) =>
          !j.jobLocation?.country ||
          j.jobLocation.country === input.location!.country
      );
    }
    if (input.location.city) {
      results = results.filter(
        (j) =>
          !j.jobLocation?.city ||
          j.jobLocation.city
            .toLowerCase()
            .includes(input.location!.city!.toLowerCase())
      );
    }
  }

  // Filters
  if (input.filters) {
    if (input.filters.employment_type) {
      results = results.filter(
        (j) => j.employmentType === input.filters!.employment_type
      );
    }
    if (input.filters.salary_min) {
      results = results.filter(
        (j) =>
          !j.baseSalary || j.baseSalary.maxValue >= input.filters!.salary_min!
      );
    }
    if (input.filters.salary_max) {
      results = results.filter(
        (j) =>
          !j.baseSalary || j.baseSalary.minValue <= input.filters!.salary_max!
      );
    }
  }

  // Fit scoring
  if (input.candidate_context) {
    results = results.map((job) => {
      const { fit_score, fit_rationale } = computeFitScore(
        job,
        input.candidate_context!.skills,
        input.candidate_context!.experience_years
      );
      return { ...job, fit_score, fit_rationale };
    });

    // Sort by fit score descending
    results.sort((a, b) => (b.fit_score || 0) - (a.fit_score || 0));
  }

  // Pagination
  const limit = input.pagination?.limit ?? 10;
  const offset = input.pagination?.offset ?? 0;
  const total = results.length;
  const paged = results.slice(offset, offset + limit);

  return {
    total,
    offset,
    limit,
    jobs: paged,
  };
}

export function getJobDetail(input: GetJobDetailInput) {
  const job = jobs.find((j) => j.ojcp_id === input.job_id);
  if (!job) {
    return ojcpError("job_not_found", `No job found with id: ${input.job_id}`);
  }

  let result = { ...job };

  if (input.candidate_context) {
    const { fit_score, fit_rationale } = computeFitScore(
      job,
      input.candidate_context.skills,
      input.candidate_context.experience_years
    );
    result = { ...result, fit_score, fit_rationale };
  }

  const response: Record<string, unknown> = { job: result };

  if (input.include_employer_context && job.employer.id) {
    const employer = employers[job.employer.id as keyof typeof employers];
    if (employer) {
      response.employer_context = employer;
    }
  }

  return response;
}

export function getEmployerContext(input: GetEmployerContextInput) {
  const employer = employers[input.employer_id as keyof typeof employers];
  if (!employer) {
    return ojcpError("employer_not_found", `No employer found with id: ${input.employer_id}`);
  }
  return employer;
}

// Fields allowed per consent scope (cumulative)
const SCOPE_FIELDS: Record<string, Set<string>> = {
  search_personalization: new Set(["skills", "experience_years", "location_preference", "employment_type_preference"]),
  fit_scoring: new Set(["skills", "experience_years", "location_preference", "employment_type_preference", "current_title", "salary_expectation"]),
  application_prefill: new Set(["skills", "experience_years", "location_preference", "employment_type_preference", "current_title", "salary_expectation", "name", "email", "resume_url", "work_authorization"]),
  full_profile: null as unknown as Set<string>, // all fields allowed
};

function checkScopeWarnings(candidateContext?: { consent_scope: string; [key: string]: unknown }): Warning[] {
  if (!candidateContext) return [];
  const allowed = SCOPE_FIELDS[candidateContext.consent_scope];
  if (!allowed) return []; // full_profile or unknown → no warnings
  const ignoredFields = Object.keys(candidateContext)
    .filter((k) => k !== "ojcp_candidate_context_version" && k !== "consent_scope")
    .filter((k) => candidateContext[k] !== undefined && !allowed.has(k));
  if (ignoredFields.length === 0) return [];
  return [{
    code: "fields_ignored" as const,
    message: `The following fields exceed '${candidateContext.consent_scope}' scope and were ignored.`,
    fields: ignoredFields,
  }];
}

export function beginApplication(input: BeginApplicationInput) {
  const job = jobs.find((j) => j.ojcp_id === input.job_id);
  if (!job) {
    return ojcpError("job_not_found", `No job found with id: ${input.job_id}`);
  }

  // Find the best apply path
  const availablePaths = job.apply_paths || [];
  let selectedPath = availablePaths.find(
    (p) => p.type === input.apply_path && p.supports_agent_submission
  );
  if (!selectedPath) {
    selectedPath = availablePaths.find((p) => p.supports_agent_submission);
  }
  if (!selectedPath) {
    return ojcpError(
      "no_agent_apply_path",
      "No agent-submittable apply path available for this job.",
      {
        available_paths: availablePaths.map((p) => ({
          type: p.type,
          supports_agent_submission: p.supports_agent_submission,
        })),
      }
    );
  }

  const requiresVerification = selectedPath.requires_verification ?? false;
  const session = createApplicationSession(
    input.job_id,
    selectedPath.type,
    requiresVerification,
    selectedPath.accepted_verifiers ?? ["id.me"]
  );

  const screeningQuestions = getScreeningQuestions(input.job_id);

  const response: Record<string, unknown> = {
    application_id: session.application_id,
    status: session.status,
    apply_path: selectedPath,
    session_token: session.session_token,
    agent_declaration_received: !!input.agent_declaration,
    source_attribution_received: !!input.source_attribution,
  };

  if (requiresVerification) {
    response.verification_steps = session.verification_steps;
    response.expires_at = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    response.message =
      "Identity verification required. Direct the candidate to the verification URL, then call submit_application with the verification proof.";
  } else {
    response.message =
      "Application session created. Submit candidate data via submit_application.";
  }

  if (screeningQuestions.length > 0) {
    response.screening_questions = screeningQuestions;
  }

  const warnings = checkScopeWarnings(input.candidate_context);
  if (warnings.length > 0) {
    response.warnings = warnings;
  }

  return response;
}

export function submitApplication(input: SubmitApplicationInput) {
  const session = getApplicationSession(input.application_id);
  if (!session) {
    return ojcpError("application_not_found", `No application found with id: ${input.application_id}`);
  }

  if (session.session_token !== input.session_token) {
    return ojcpError("invalid_session_token", "Session token does not match.");
  }

  if (session.status !== "pending_verification" && session.status !== "pending_submission") {
    return ojcpError("invalid_status", `Application status is '${session.status}', cannot submit.`);
  }

  // Require proofs for agent_submitted verification steps
  if (session.status === "pending_verification") {
    const agentSubmittedSteps = (session.verification_steps || []).filter(
      (s) => s.proof_delivery !== "provider_managed"
    );
    const providedStepIds = new Set(
      (input.verification_proofs || []).map((p) => p.step_id)
    );
    const missingSteps = agentSubmittedSteps
      .filter((s) => !providedStepIds.has(s.step_id))
      .map((s) => ({
        step_id: s.step_id,
        error: "missing_proof" as const,
        message: `No proof provided for required verification step '${s.step_id}' (${s.type}).`,
      }));
    if (missingSteps.length > 0) {
      return {
        application_id: input.application_id,
        status: "verification_failed",
        verification_errors: missingSteps,
        message:
          "Verification proofs are required for agent_submitted steps. Complete all verification steps and include proofs.",
      };
    }
  }

  // Validate verification proofs
  if (input.verification_proofs && input.verification_proofs.length > 0) {
    const errors = [];
    const knownVerifiers = ["id.me", "clear", "checkr"];

    for (const proof of input.verification_proofs) {
      // 1. Structural JWS validation via jose
      let header;
      let claims;
      try {
        header = decodeProtectedHeader(proof.proof_token);
      } catch {
        errors.push({
          step_id: proof.step_id,
          error: "invalid_structure",
          message: `Proof from ${proof.verifier_id} is not valid JWS compact serialization.`,
        });
        continue;
      }

      // 2. Required JWS header fields
      if (!header.alg) {
        errors.push({
          step_id: proof.step_id,
          error: "invalid_structure",
          message: `Proof from ${proof.verifier_id} is missing 'alg' in JWS header.`,
        });
        continue;
      }
      if (!header.kid) {
        errors.push({
          step_id: proof.step_id,
          error: "invalid_structure",
          message: `Proof from ${proof.verifier_id} is missing 'kid' in JWS header.`,
        });
        continue;
      }

      // 3. Decode and validate JWT claims
      try {
        claims = decodeJwt(proof.proof_token);
      } catch {
        errors.push({
          step_id: proof.step_id,
          error: "invalid_structure",
          message: `Proof from ${proof.verifier_id} has malformed JWT payload.`,
        });
        continue;
      }

      // 4. Validate iss (required per spec, must match verifier_id)
      if (!claims.iss) {
        errors.push({
          step_id: proof.step_id,
          error: "issuer_mismatch",
          message: `Proof from ${proof.verifier_id} is missing required 'iss' claim.`,
        });
      } else if (claims.iss !== proof.verifier_id) {
        errors.push({
          step_id: proof.step_id,
          error: "issuer_mismatch",
          message: `Proof 'iss' claim '${claims.iss}' does not match verifier_id '${proof.verifier_id}'.`,
        });
      }

      // 5. Validate aud (required per spec, must match provider)
      if (!claims.aud) {
        errors.push({
          step_id: proof.step_id,
          error: "audience_mismatch",
          message: `Proof from ${proof.verifier_id} is missing required 'aud' claim.`,
        });
      } else {
        const aud = claims.aud;
        const validAud = Array.isArray(aud)
          ? aud.some((a: string) => a === "ojcp.dev" || a === "*")
          : aud === "ojcp.dev" || aud === "*";
        if (!validAud) {
          errors.push({
            step_id: proof.step_id,
            error: "audience_mismatch",
            message: `Proof audience '${claims.aud}' does not match this provider.`,
          });
        }
      }

      // 6. Validate nonce matches application_id (always required per spec)
      if (!claims.nonce) {
        errors.push({
          step_id: proof.step_id,
          error: "nonce_mismatch",
          message: `Proof from ${proof.verifier_id} is missing required 'nonce' claim.`,
        });
      } else if (claims.nonce !== input.application_id) {
        errors.push({
          step_id: proof.step_id,
          error: "nonce_mismatch",
          message: `Proof nonce '${claims.nonce}' does not match application_id '${input.application_id}'.`,
        });
      }

      // 7. Validate sub matches subject_hash (required per spec)
      if (!claims.sub) {
        errors.push({
          step_id: proof.step_id,
          error: "invalid_signature",
          message: `Proof from ${proof.verifier_id} is missing required 'sub' claim.`,
        });
      } else if (claims.sub !== proof.subject_hash) {
        errors.push({
          step_id: proof.step_id,
          error: "invalid_signature",
          message: `Proof 'sub' claim does not match subject_hash.`,
        });
      }

      // 8. Check expiry
      if (new Date(proof.expires_at) < new Date()) {
        errors.push({
          step_id: proof.step_id,
          error: "expired_proof",
          message: `Proof from ${proof.verifier_id} has expired.`,
        });
      }

      // 9. Verify verifier_id is recognized
      if (!knownVerifiers.includes(proof.verifier_id)) {
        errors.push({
          step_id: proof.step_id,
          error: "unrecognized_verifier",
          message: `Verifier '${proof.verifier_id}' is not recognized by this provider.`,
        });
      }
    }
    if (errors.length > 0) {
      return {
        application_id: input.application_id,
        status: "verification_failed",
        verification_errors: errors,
        message: "One or more verification proofs failed validation.",
      };
    }
  }

  // Validate screening answers against questions
  const questions = getScreeningQuestions(session.job_id);
  if (questions.length > 0) {
    const screeningErrors = validateScreeningAnswers(questions, input.application_data?.answers);
    if (screeningErrors.length > 0) {
      return {
        application_id: input.application_id,
        status: "validation_failed",
        screening_errors: screeningErrors,
        message: "Screening question answers failed validation. Fix the answers and resubmit.",
      };
    }
  }

  // Complete the verification and transition to submitted
  const updated = completeVerification(input.application_id);
  if (!updated) {
    return ojcpError("provider_error", "Failed to complete verification.");
  }

  const warnings = checkScopeWarnings(input.candidate_context);
  const result: Record<string, unknown> = {
    application_id: input.application_id,
    status: "submitted",
    message: "Application submitted successfully. Verification proofs validated.",
    next_steps: "Your application is now under review. Use check_application_status to track progress.",
  };
  if (warnings.length > 0) {
    result.warnings = warnings;
  }
  return result;
}

function validateScreeningAnswers(
  questions: ScreeningQuestion[],
  answers?: Record<string, unknown>
): ScreeningError[] {
  const errors: ScreeningError[] = [];
  for (const q of questions) {
    const answer = answers?.[q.question_id];

    // Required check
    if (q.required && (answer === undefined || answer === null || answer === "")) {
      errors.push({
        question_id: q.question_id,
        error: "required_missing",
        message: `Required question '${q.question_id}' is missing an answer.`,
      });
      continue;
    }

    if (answer === undefined || answer === null) continue;

    // Type-specific validation
    if (q.answer_type === "number" && typeof answer === "number") {
      if (q.min !== undefined && answer < q.min) {
        errors.push({
          question_id: q.question_id,
          error: "out_of_range",
          message: `Answer ${answer} is below minimum ${q.min}.`,
        });
      }
      if (q.max !== undefined && answer > q.max) {
        errors.push({
          question_id: q.question_id,
          error: "out_of_range",
          message: `Answer ${answer} exceeds maximum ${q.max}.`,
        });
      }
    }

    if (q.answer_type === "text" && typeof answer === "string") {
      if (q.min_length !== undefined && answer.length < q.min_length) {
        errors.push({
          question_id: q.question_id,
          error: "too_short",
          message: `Answer length ${answer.length} is below minimum ${q.min_length}.`,
        });
      }
      if (q.max_length !== undefined && answer.length > q.max_length) {
        errors.push({
          question_id: q.question_id,
          error: "too_long",
          message: `Answer length ${answer.length} exceeds maximum ${q.max_length}.`,
        });
      }
      if (q.pattern && !new RegExp(q.pattern).test(answer)) {
        errors.push({
          question_id: q.question_id,
          error: "invalid_format",
          message: `Answer does not match required pattern.`,
        });
      }
    }

    if ((q.answer_type === "single_select" || q.answer_type === "multi_select") && q.options) {
      const selections = Array.isArray(answer) ? answer : [answer];
      for (const sel of selections) {
        if (typeof sel === "string" && !q.options.includes(sel)) {
          errors.push({
            question_id: q.question_id,
            error: "invalid_option",
            message: `'${sel}' is not a valid option.`,
          });
        }
      }
    }
  }
  return errors;
}

export function checkApplicationStatus(input: CheckApplicationStatusInput) {
  const session = getApplicationSession(input.application_id);
  if (!session) {
    return ojcpError(
      "application_not_found",
      `No application found with id: ${input.application_id}. Note: mock sessions are ephemeral and reset on server restart.`
    );
  }

  const result: Record<string, unknown> = {
    application_id: session.application_id,
    status: session.status,
    updated_at: session.created_at,
  };

  if (session.status === "pending_verification" && session.verification_steps) {
    result.verification_status = {
      steps_total: session.verification_steps.length,
      steps_completed: session.verification_completed ? session.verification_steps.length : 0,
      pending_steps: session.verification_completed
        ? []
        : session.verification_steps.map((s) => s.step_id),
      completed_steps: session.verification_completed
        ? session.verification_steps.map((s) => s.step_id)
        : [],
    };
  }

  return result;
}
