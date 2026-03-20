/**
 * Generates a structurally valid mock JWS for testing the OJCP verification flow.
 *
 * The token has correct 3-part compact serialization with proper header/claims,
 * but the signature is not cryptographically valid (mock data). A real verifier
 * would sign with their private key; a real provider would validate against
 * the verifier's JWKS. This mock is for demonstrating the protocol shape.
 */
export function createMockProofToken(opts: {
  verifierId: string;
  stepId: string;
  applicationId?: string;
  audience?: string;
  nonce?: string;
  subjectHash?: string;
}): string {
  const header = {
    alg: "ES256",
    typ: "JWT",
    kid: `${opts.verifierId}-key-1`,
  };

  const now = Math.floor(Date.now() / 1000);
  const payload: Record<string, unknown> = {
    iss: opts.verifierId,
    aud: opts.audience ?? "ojcp.dev",
    sub: opts.subjectHash ?? "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    iat: now,
    exp: now + 86400, // 24 hours
    nonce: opts.nonce ?? opts.applicationId ?? opts.stepId,
    verification_type: "identity",
    step_id: opts.stepId,
  };

  const encode = (obj: Record<string, unknown>) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  // Mock signature — structurally valid Base64url but not cryptographically signed
  const mockSignature = encode({ mock: true, note: "signature_not_validated_in_demo" });

  return `${encode(header)}.${encode(payload)}.${mockSignature}`;
}
