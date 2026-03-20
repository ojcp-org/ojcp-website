import { NextResponse } from "next/server";

const context = {
  "@context": {
    "@version": 1.1,

    schema: "https://schema.org/",
    ojcp: "https://ojcp.dev/ns/v1#",
    xsd: "http://www.w3.org/2001/XMLSchema#",

    // ── OJCP Types ──
    OJCPProvider: "ojcp:OJCPProvider",
    OJCPManifest: "ojcp:OJCPManifest",
    ApplyPath: "ojcp:ApplyPath",
    CandidateContext: "ojcp:CandidateContext",
    AgentDeclaration: "ojcp:AgentDeclaration",

    // ── Schema.org Types ──
    JobPosting: "schema:JobPosting",
    Organization: "schema:Organization",
    Place: "schema:Place",
    PostalAddress: "schema:PostalAddress",
    MonetaryAmountDistribution: "schema:MonetaryAmountDistribution",

    // ── Provider / Registry ──
    domain: { "@id": "ojcp:domain", "@type": "xsd:string" },
    name: "schema:name",
    description: "schema:description",
    mcp_endpoint: { "@id": "ojcp:mcpEndpoint", "@type": "@id" },
    manifest_url: { "@id": "ojcp:manifestUrl", "@type": "@id" },
    industries: { "@id": "ojcp:industries", "@container": "@set" },
    location: { "@id": "ojcp:location", "@type": "@id" },
    tools: { "@id": "ojcp:tools", "@container": "@set" },
    apply_paths: { "@id": "ojcp:applyPaths", "@container": "@set" },
    has_agent_apply: {
      "@id": "ojcp:hasAgentApply",
      "@type": "xsd:boolean",
    },
    verified: { "@id": "ojcp:verified", "@type": "xsd:boolean" },
    verified_at: { "@id": "ojcp:verifiedAt", "@type": "xsd:dateTime" },
    registered_at: {
      "@id": "ojcp:registeredAt",
      "@type": "xsd:dateTime",
    },

    // ── OJCP Core ──
    ojcp_version: { "@id": "ojcp:version", "@type": "xsd:string" },
    ojcp_id: { "@id": "ojcp:id", "@type": "xsd:string" },
    ojcp_employer_id: { "@id": "ojcp:employerId", "@type": "xsd:string" },

    // ── Job Posting (schema.org + extensions) ──
    title: "schema:title",
    employer: { "@id": "schema:hiringOrganization", "@type": "@id" },
    datePosted: { "@id": "schema:datePosted", "@type": "xsd:date" },
    validThrough: { "@id": "schema:validThrough", "@type": "xsd:date" },
    employmentType: "schema:employmentType",
    experienceLevel: {
      "@id": "ojcp:experienceLevel",
      "@type": "xsd:string",
    },
    jobLocation: { "@id": "schema:jobLocation", "@type": "@id" },
    address: { "@id": "schema:address", "@type": "@id" },
    baseSalary: { "@id": "schema:baseSalary", "@type": "@id" },
    currency: "schema:currency",
    minValue: { "@id": "schema:minValue", "@type": "xsd:float" },
    maxValue: { "@id": "schema:maxValue", "@type": "xsd:float" },
    unitText: "schema:unitText",
    addressLocality: "schema:addressLocality",
    addressRegion: "schema:addressRegion",
    addressCountry: "schema:addressCountry",
    skills_required: {
      "@id": "ojcp:skillsRequired",
      "@container": "@set",
    },
    skills_preferred: {
      "@id": "ojcp:skillsPreferred",
      "@container": "@set",
    },
    team_context: { "@id": "ojcp:teamContext", "@type": "xsd:string" },
    urgency: { "@id": "ojcp:urgency", "@type": "@vocab" },
    application_volume_signal: {
      "@id": "ojcp:applicationVolumeSignal",
      "@type": "@vocab",
    },
    agent_notes: { "@id": "ojcp:agentNotes", "@type": "xsd:string" },

    // ── Apply Paths ──
    url: { "@id": "schema:url", "@type": "@id" },
    supports_agent_submission: {
      "@id": "ojcp:supportsAgentSubmission",
      "@type": "xsd:boolean",
    },
    ats_provider: { "@id": "ojcp:atsProvider", "@type": "xsd:string" },
    estimated_completion_minutes: {
      "@id": "ojcp:estimatedCompletionMinutes",
      "@type": "xsd:integer",
    },
    required_fields: {
      "@id": "ojcp:requiredFields",
      "@container": "@set",
    },
    optional_fields: {
      "@id": "ojcp:optionalFields",
      "@container": "@set",
    },
    form_skill_url: { "@id": "ojcp:formSkillUrl", "@type": "@id" },

    // ── Manifest ──
    provider: { "@id": "ojcp:provider", "@type": "@id" },
    employer_id: { "@id": "ojcp:employerId", "@type": "xsd:string" },
    logo_url: { "@id": "ojcp:logoUrl", "@type": "@id" },
    culture_context: {
      "@id": "ojcp:cultureContext",
      "@type": "xsd:string",
    },
    hq_location: { "@id": "ojcp:hqLocation", "@type": "@id" },
    feed_endpoints: { "@id": "ojcp:feedEndpoints", "@type": "@id" },
    auth: { "@id": "ojcp:auth", "@type": "@id" },
    optional_scopes: {
      "@id": "ojcp:optionalScopes",
      "@container": "@set",
    },
    rate_limits: { "@id": "ojcp:rateLimits", "@type": "@id" },
    anonymous_rps: {
      "@id": "ojcp:anonymousRps",
      "@type": "xsd:float",
    },
    authenticated_rps: {
      "@id": "ojcp:authenticatedRps",
      "@type": "xsd:float",
    },
    burst_limit: { "@id": "ojcp:burstLimit", "@type": "xsd:integer" },

    // ── Agent Declaration ──
    agent_id: { "@id": "ojcp:agentId", "@type": "xsd:string" },
    agent_version: { "@id": "ojcp:agentVersion", "@type": "xsd:string" },
    acting_on_behalf_of: {
      "@id": "ojcp:actingOnBehalfOf",
      "@type": "@vocab",
    },
    user_consent_token: {
      "@id": "ojcp:userConsentToken",
      "@type": "xsd:string",
    },
    interaction_mode: {
      "@id": "ojcp:interactionMode",
      "@type": "@vocab",
    },

    // ── Candidate Context ──
    ojcp_candidate_context_version: {
      "@id": "ojcp:candidateContextVersion",
      "@type": "xsd:string",
    },
    consent_scope: { "@id": "ojcp:consentScope", "@type": "@vocab" },
    skills: { "@id": "ojcp:skills", "@container": "@set" },
    experience_years: {
      "@id": "ojcp:experienceYears",
      "@type": "xsd:float",
    },
    current_title: { "@id": "ojcp:currentTitle", "@type": "xsd:string" },
    location_preference: {
      "@id": "ojcp:locationPreference",
      "@type": "@id",
    },
    remote_ok: { "@id": "ojcp:remoteOk", "@type": "xsd:boolean" },
    employment_type_preference: {
      "@id": "ojcp:employmentTypePreference",
      "@container": "@set",
    },
    salary_expectation: {
      "@id": "ojcp:salaryExpectation",
      "@type": "@id",
    },
    min: { "@id": "ojcp:minValue", "@type": "xsd:float" },
    max: { "@id": "ojcp:maxValue", "@type": "xsd:float" },
    work_authorization: {
      "@id": "ojcp:workAuthorization",
      "@type": "xsd:string",
    },
    resume_embedding_hash: {
      "@id": "ojcp:resumeEmbeddingHash",
      "@type": "xsd:string",
    },

    // ── Identity Verification ──
    VerificationStep: "ojcp:VerificationStep",
    VerificationProof: "ojcp:VerificationProof",
    VerifierManifest: "ojcp:VerifierManifest",

    verification_steps: {
      "@id": "ojcp:verificationSteps",
      "@container": "@set",
    },
    verification_proofs: {
      "@id": "ojcp:verificationProofs",
      "@container": "@set",
    },
    verification_url: { "@id": "ojcp:verificationUrl", "@type": "@id" },
    verification_type: {
      "@id": "ojcp:verificationType",
      "@type": "@vocab",
    },
    verifier_id: { "@id": "ojcp:verifierId", "@type": "xsd:string" },
    verifier_name: { "@id": "ojcp:verifierName", "@type": "xsd:string" },
    verifier_manifest_url: {
      "@id": "ojcp:verifierManifestUrl",
      "@type": "@id",
    },
    step_id: { "@id": "ojcp:stepId", "@type": "xsd:string" },
    proof_token: { "@id": "ojcp:proofToken", "@type": "xsd:string" },
    subject_hash: { "@id": "ojcp:subjectHash", "@type": "xsd:string" },
    human_required: {
      "@id": "ojcp:humanRequired",
      "@type": "xsd:boolean",
    },
    requires_verification: {
      "@id": "ojcp:requiresVerification",
      "@type": "xsd:boolean",
    },
    accepted_verifiers: {
      "@id": "ojcp:acceptedVerifiers",
      "@container": "@set",
    },
    supported_verifiers: {
      "@id": "ojcp:supportedVerifiers",
      "@container": "@set",
    },
    public_keys_url: { "@id": "ojcp:publicKeysUrl", "@type": "@id" },
    proof_format: { "@id": "ojcp:proofFormat", "@type": "xsd:string" },
    proof_ttl_seconds: {
      "@id": "ojcp:proofTtlSeconds",
      "@type": "xsd:integer",
    },
    callback_supported: {
      "@id": "ojcp:callbackSupported",
      "@type": "xsd:boolean",
    },
    verification_status: {
      "@id": "ojcp:verificationStatus",
      "@type": "@id",
    },
  },
};

const body = JSON.stringify(context, null, 2);

export function GET() {
  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/ld+json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, immutable",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
