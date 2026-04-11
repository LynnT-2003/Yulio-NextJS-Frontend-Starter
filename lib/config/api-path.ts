import NetworkConfig from "../domain/api/NetworkConfig";

/**
 * Path segment relative to the global `/api` prefix (e.g. `auth/login`, `users/me`).
 * Works whether `NEXT_PUBLIC_API_BASE_URL` is `http://host` or `http://host/api`.
 */
export function apiPath(relativePath: string): string {
  const base = NetworkConfig.shared.baseURL.replace(/\/+$/, "");
  const suffix = relativePath.replace(/^\/+/, "");
  return base.endsWith("/api") ? `/${suffix}` : `/api/${suffix}`;
}

/** Absolute URL for browser navigation (OAuth starts). Same rules as {@link apiPath}. */
export function apiAbsoluteUrl(relativePath: string): string {
  const base = NetworkConfig.shared.baseURL.replace(/\/+$/, "");
  const suffix = relativePath.replace(/^\/+/, "");
  const path = base.endsWith("/api") ? `/${suffix}` : `/api/${suffix}`;
  return `${base}${path}`;
}
