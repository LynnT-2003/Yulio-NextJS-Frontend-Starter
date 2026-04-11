/** App Router paths (this Next.js app only). */
export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  account: "/account",
  logout: "/logout",
  /** Nest redirects here with tokens in `#hash` when FRONTEND_OAUTH_CALLBACK_URL is set */
  oauthCallback: "/auth/callback",
  oauthImport: "/auth/oauth-import",
} as const;
