import type { AuthResponse } from "@/lib/types/api";

/**
 * Parse pasted JSON from an OAuth callback (Nest wraps success in `{ data }`).
 * Accepts full envelope or raw `{ user, tokens }`.
 *
 * UI / dev-tooling only — not part of NetworkManager.
 */
export function parseAuthResponseFromPastedJson(text: string): AuthResponse {
  const trimmed = text.trim();
  const parsed: unknown = JSON.parse(trimmed);

  const root =
    parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};

  const inner =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : root;

  const user = inner.user as AuthResponse["user"];
  const tokens = inner.tokens as AuthResponse["tokens"];

  if (
    !user ||
    !tokens ||
    typeof tokens.accessToken !== "string" ||
    typeof tokens.refreshToken !== "string"
  ) {
    throw new Error(
      "Expected JSON with user + tokens (or Nest envelope with data.user and data.tokens)."
    );
  }

  return { user, tokens };
}
