import { describe, it, expect } from "vitest";
import {
  computeFitScore,
  createApplicationSession,
  getApplicationSession,
  getScreeningQuestions,
  jobs,
  employers,
} from "../mock-data";

// ── Mock data integrity ──

describe("mock data", () => {
  it("has jobs with valid ojcp_ids", () => {
    expect(jobs.length).toBeGreaterThan(0);
    for (const job of jobs) {
      expect(job.ojcp_id).toBeTruthy();
      expect(job.ojcp_id).toContain(":");
    }
  });

  it("has employers for all employer IDs in jobs", () => {
    for (const job of jobs) {
      if (job.employer.id) {
        expect(employers).toHaveProperty(job.employer.id);
      }
    }
  });

  it("has at least one verification-required job", () => {
    const verificationJobs = jobs.filter((j) =>
      j.apply_paths?.some((p) => p.requires_verification)
    );
    expect(verificationJobs.length).toBeGreaterThan(0);
  });

  it("has jobs with ATS fields", () => {
    const jobsWithAts = jobs.filter((j) => j.requisition_id);
    expect(jobsWithAts.length).toBeGreaterThan(0);
    const job = jobsWithAts[0];
    expect(job.requisition_id).toBeTruthy();
    expect(job.department).toBeTruthy();
    expect(job.hiring_manager).toBeTruthy();
    expect(job.remote_policy).toBeTruthy();
  });
});

// ── computeFitScore ──

describe("computeFitScore", () => {
  const backendJob = jobs.find((j) => j.ojcp_id === "acme:sbe-2026-001")!;

  it("returns high score for matching skills", () => {
    const { fit_score, fit_rationale } = computeFitScore(
      backendJob,
      ["Go", "PostgreSQL", "gRPC", "Kubernetes"],
      10
    );
    expect(fit_score).toBeGreaterThan(0.7);
    expect(fit_rationale).toContain("Go");
  });

  it("returns zero for no candidate context", () => {
    const { fit_score } = computeFitScore(backendJob);
    expect(fit_score).toBe(0);
  });

  it("returns zero for empty skills", () => {
    const { fit_score } = computeFitScore(backendJob, []);
    expect(fit_score).toBe(0);
  });

  it("returns partial score for some matching skills", () => {
    const { fit_score } = computeFitScore(backendJob, ["Go"], 3);
    expect(fit_score).toBeGreaterThan(0);
    expect(fit_score).toBeLessThan(0.8);
  });

  it("adds experience bonus for 5+ years", () => {
    const { fit_score: noExp } = computeFitScore(backendJob, ["Go"]);
    const { fit_score: withExp } = computeFitScore(backendJob, ["Go"], 8);
    expect(withExp).toBeGreaterThan(noExp);
  });

  it("adds partial experience bonus for 3-4 years", () => {
    const { fit_score: noExp } = computeFitScore(backendJob, ["Go"]);
    const { fit_score: withExp } = computeFitScore(backendJob, ["Go"], 3);
    expect(withExp).toBeGreaterThan(noExp);
  });

  it("handles case-insensitive skill matching", () => {
    const { fit_score } = computeFitScore(backendJob, ["go", "postgresql"]);
    expect(fit_score).toBeGreaterThan(0);
  });
});

// ── Application sessions ──

describe("createApplicationSession", () => {
  it("creates session with unique ID and token", () => {
    const session = createApplicationSession("acme:sbe-2026-001", "provider_hosted");
    expect(session.application_id).toMatch(/^app_/);
    expect(session.session_token).toMatch(/^sess_/);
    expect(session.status).toBe("submitted");
  });

  it("creates verification session with steps", () => {
    const session = createApplicationSession(
      "globex:sa-2026-004",
      "provider_hosted",
      true,
      ["id.me"]
    );
    expect(session.status).toBe("pending_verification");
    expect(session.verification_steps).toBeDefined();
    expect(session.verification_steps!.length).toBe(1);
    expect(session.verification_completed).toBe(false);
  });

  it("creates multi-verifier session", () => {
    const session = createApplicationSession(
      "initech:ciso-2026-003",
      "provider_hosted",
      true,
      ["id.me", "checkr"]
    );
    expect(session.verification_steps!.length).toBe(2);
    expect(session.verification_steps![0].verifier_id).toBe("id.me");
    expect(session.verification_steps![1].verifier_id).toBe("checkr");
  });

  it("verification steps have expires_at", () => {
    const session = createApplicationSession(
      "globex:sa-2026-004",
      "provider_hosted",
      true,
      ["id.me"]
    );
    for (const step of session.verification_steps!) {
      expect(step.expires_at).toBeDefined();
      expect(new Date(step.expires_at!).getTime()).toBeGreaterThan(Date.now());
    }
  });

  it("verification steps have required fields", () => {
    const session = createApplicationSession(
      "globex:sa-2026-004",
      "provider_hosted",
      true,
      ["id.me"]
    );
    const step = session.verification_steps![0];
    expect(step.step_id).toBeTruthy();
    expect(step.type).toBe("identity");
    expect(step.verifier_id).toBe("id.me");
    expect(step.verification_url).toContain("https://");
    expect(step.required).toBe(true);
    expect(step.human_required).toBe(true);
  });
});

// ── Screening questions ──

describe("getScreeningQuestions", () => {
  it("returns questions for jobs that have them", () => {
    const questions = getScreeningQuestions("globex:sa-2026-004");
    expect(questions.length).toBeGreaterThan(0);
    expect(questions[0]).toHaveProperty("question_id");
    expect(questions[0]).toHaveProperty("question_text");
    expect(questions[0]).toHaveProperty("answer_type");
  });

  it("returns empty array for jobs without screening questions", () => {
    const questions = getScreeningQuestions("globex:mle-2026-002");
    expect(questions).toEqual([]);
  });

  it("returns empty array for unknown job", () => {
    const questions = getScreeningQuestions("nonexistent");
    expect(questions).toEqual([]);
  });

  it("includes options for select-type questions", () => {
    const questions = getScreeningQuestions("globex:sa-2026-004");
    const selectQ = questions.find((q) => q.answer_type === "single_select");
    expect(selectQ).toBeDefined();
    expect(selectQ!.options).toBeDefined();
    expect(selectQ!.options!.length).toBeGreaterThan(0);
  });

  it("includes validation fields (min, max) on number questions", () => {
    const questions = getScreeningQuestions("globex:sa-2026-004");
    const numberQ = questions.find((q) => q.answer_type === "number");
    expect(numberQ).toBeDefined();
    expect(numberQ!.min).toBe(0);
    expect(numberQ!.max).toBe(50);
  });

  it("includes validation fields (min_length, max_length) on text questions", () => {
    const questions = getScreeningQuestions("acme:sbe-2026-001");
    const textQ = questions.find((q) => q.answer_type === "text");
    expect(textQ).toBeDefined();
    expect(textQ!.min_length).toBe(50);
    expect(textQ!.max_length).toBe(2000);
  });
});

describe("getApplicationSession", () => {
  it("retrieves created session", () => {
    const session = createApplicationSession("acme:sbe-2026-001", "provider_hosted");
    const retrieved = getApplicationSession(session.application_id);
    expect(retrieved).not.toBeNull();
    expect(retrieved!.application_id).toBe(session.application_id);
  });

  it("returns null for unknown ID", () => {
    const result = getApplicationSession("nonexistent_id");
    expect(result).toBeNull();
  });
});
