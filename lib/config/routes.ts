/** App Router paths (this Next.js app only). */
export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  account: "/account",
  /** JWT + `role: admin` required; non-admins are redirected to account. */
  adminModeration: "/admin/moderation",
  /** Nest redirects here with tokens in `#hash` when FRONTEND_OAUTH_CALLBACK_URL is set */
  oauthCallback: "/auth/callback",
  oauthImport: "/auth/oauth-import",
  pricing: "/pricing",
  proDemo: "/pro-demo",
} as const;
