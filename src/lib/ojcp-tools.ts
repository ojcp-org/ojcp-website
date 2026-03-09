import {
  jobs,
  employers,
  computeFitScore,
  createApplicationSession,
  getApplicationSession,
} from "./mock-data";
import type {
  SearchJobsInput,
  GetJobDetailInput,
  GetEmployerContextInput,
  BeginApplicationInput,
  CheckApplicationStatusInput,
} from "./schemas";

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
        input.candidate_context!.years_experience
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
    return { error: "job_not_found", message: `No job found with id: ${input.job_id}` };
  }

  let result = { ...job };

  if (input.candidate_context) {
    const { fit_score, fit_rationale } = computeFitScore(
      job,
      input.candidate_context.skills,
      input.candidate_context.years_experience
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
    return {
      error: "employer_not_found",
      message: `No employer found with id: ${input.employer_id}`,
    };
  }
  return employer;
}

export function beginApplication(input: BeginApplicationInput) {
  const job = jobs.find((j) => j.ojcp_id === input.job_id);
  if (!job) {
    return { error: "job_not_found", message: `No job found with id: ${input.job_id}` };
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
    return {
      error: "no_agent_apply_path",
      message: "No agent-submittable apply path available for this job.",
      available_paths: availablePaths.map((p) => ({
        type: p.type,
        supports_agent_submission: p.supports_agent_submission,
      })),
    };
  }

  const session = createApplicationSession(
    input.job_id,
    selectedPath.type
  );

  return {
    ...session,
    apply_path: selectedPath,
    message:
      "Application session created. In a real implementation, you would now submit candidate data to the apply path URL.",
    agent_declaration_received: !!input.agent_declaration,
  };
}

export function checkApplicationStatus(input: CheckApplicationStatusInput) {
  const session = getApplicationSession(input.application_id);
  if (!session) {
    return {
      error: "application_not_found",
      message: `No application found with id: ${input.application_id}. Note: mock sessions are ephemeral and reset on server restart.`,
    };
  }
  return session;
}
