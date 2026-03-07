// src/utils/pkce.js
import crypto from "crypto";

/**
 * Gera o code_verifier para PKCE (RFC 7636)
 * - 43 a 128 caracteres
 * - Aleatório e URL-safe
 */
export function generateCodeVerifier(len = 64) {
  if (len < 43 || len > 128) {
    throw new Error("code_verifier length must be between 43 and 128");
  }

  const bytes = crypto.randomBytes(len);
  return base64url(bytes).slice(0, len);
}

/**
 * Gera o code_challenge usando SHA-256 (S256)
 */
export function codeChallengeS256(codeVerifier) {
  const hash = crypto.createHash("sha256").update(codeVerifier).digest();
  return base64url(hash);
}

/**
 * Converte buffer em Base64 URL-safe
 * (RFC 4648)
 */
function base64url(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}
