import { postRequest } from "../api/NetworkManager";
import { apiPath, apiAbsoluteUrl } from "../../config/api-path";
import type { AuthResponse } from "../../types/api";

export type LoginBody = { email: string; password: string };
export type RegisterBody = {
  email: string;
  password: string;
  displayName: string;
};
export type LogoutBody = { userId: string; refreshToken: string };

export async function loginRequest(body: LoginBody): Promise<AuthResponse> {
  return postRequest<AuthResponse, LoginBody>(apiPath("auth/login"), body, {
    isPublic: true,
  });
}

export async function registerRequest(body: RegisterBody): Promise<AuthResponse> {
  return postRequest<AuthResponse, RegisterBody>(apiPath("auth/register"), body, {
    isPublic: true,
  });
}

export async function logoutRequest(body: LogoutBody): Promise<void> {
  await postRequest<unknown, LogoutBody>(apiPath("auth/logout"), body);
}

// ─── OAuth (browser navigation to API — no fetch) ───────────────────────────

/** Start URLs for each Passport provider on the Nest host. */
export const oauthStartUrls = {
  google: () => apiAbsoluteUrl("auth/google"),
  line: () => apiAbsoluteUrl("auth/line"),
  github: () => apiAbsoluteUrl("auth/github"),
  discord: () => apiAbsoluteUrl("auth/discord"),
  microsoft: () => apiAbsoluteUrl("auth/microsoft"),
} as const;

export type OAuthProviderId = keyof typeof oauthStartUrls;

export const oauthProviders: {
  id: OAuthProviderId;
  label: string;
  description: string;
}[] = [
  { id: "google", label: "Google", description: "Google OAuth 2.0" },
  { id: "line", label: "LINE", description: "LINE Login" },
  { id: "github", label: "GitHub", description: "GitHub OAuth" },
  { id: "discord", label: "Discord", description: "Discord OAuth" },
  { id: "microsoft", label: "Microsoft", description: "Microsoft Entra ID" },
];
