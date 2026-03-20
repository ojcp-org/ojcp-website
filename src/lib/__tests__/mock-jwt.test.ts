import { describe, it, expect } from "vitest";
import { decodeProtectedHeader, decodeJwt } from "jose";
import { createMockProofToken } from "../mock-jwt";

describe("createMockProofToken", () => {
  it("produces valid 3-part JWS compact serialization", () => {
    const token = createMockProofToken({
      verifierId: "id.me",
      stepId: "vs_1",
    });
    const parts = token.split(".");
    expect(parts.length).toBe(3);
    // Each part should be non-empty base64url
    for (const part of parts) {
      expect(part.length).toBeGreaterThan(0);
      expect(part).toMatch(/^[A-Za-z0-9_-]+$/);
    }
  });

  it("has valid JWS header with alg and kid", () => {
    const token = createMockProofToken({
      verifierId: "id.me",
      stepId: "vs_1",
    });
    const header = decodeProtectedHeader(token);
    expect(header.alg).toBe("ES256");
    expect(header.kid).toBe("id.me-key-1");
  });

  it("has required JWT claims", () => {
    const token = createMockProofToken({
      verifierId: "id.me",
      stepId: "vs_1",
    });
    const claims = decodeJwt(token);
    expect(claims.iss).toBe("id.me");
    expect(claims.aud).toBe("ojcp.dev");
    expect(claims.sub).toBeTruthy();
    expect(claims.nonce).toBe("vs_1");
    expect(claims.iat).toBeDefined();
    expect(claims.exp).toBeDefined();
    expect(typeof claims.exp).toBe("number");
    expect((claims.exp as number)).toBeGreaterThan(claims.iat as number);
  });

  it("uses custom audience", () => {
    const token = createMockProofToken({
      verifierId: "id.me",
      stepId: "vs_1",
      audience: "careers.acme.com",
    });
    const claims = decodeJwt(token);
    expect(claims.aud).toBe("careers.acme.com");
  });

  it("uses custom subjectHash", () => {
    const token = createMockProofToken({
      verifierId: "id.me",
      stepId: "vs_1",
      subjectHash: "custom_hash_value",
    });
    const claims = decodeJwt(token);
    expect(claims.sub).toBe("custom_hash_value");
  });

  it("uses custom nonce", () => {
    const token = createMockProofToken({
      verifierId: "id.me",
      stepId: "vs_1",
      nonce: "custom_nonce",
    });
    const claims = decodeJwt(token);
    expect(claims.nonce).toBe("custom_nonce");
  });

  it("defaults nonce to applicationId when provided", () => {
    const token = createMockProofToken({
      verifierId: "clear",
      stepId: "vs_42",
      applicationId: "app_123",
    });
    const claims = decodeJwt(token);
    expect(claims.nonce).toBe("app_123");
  });

  it("falls back nonce to stepId when no applicationId", () => {
    const token = createMockProofToken({
      verifierId: "clear",
      stepId: "vs_42",
    });
    const claims = decodeJwt(token);
    expect(claims.nonce).toBe("vs_42");
  });

  it("uses verifier-specific kid format", () => {
    const token = createMockProofToken({
      verifierId: "clear",
      stepId: "vs_1",
    });
    const header = decodeProtectedHeader(token);
    expect(header.kid).toBe("clear-key-1");
  });
});
