import NetworkConfig from "./NetworkConfig";
import ApiStatusCodes from "./ApiStatusCodes";
import { isAccountSuspendedMessage } from "./account-suspended";
import { ApiError } from "./ApiError";
import { tokenStore } from "./tokenStore";

export type RequestOptions = RequestInit & {
  _retry?: boolean;
  isPublic?: boolean;
};

/** Optional flags for public HTTP helpers (e.g. login/register). */
export type PublicRequestOptions = Pick<RequestOptions, "isPublic">;

type UploadOptions = {
  isPublic?: boolean;
  _retry?: boolean;
};

type OnSessionExpired = () => void;
let _onSessionExpired: OnSessionExpired = () => { };

export const setSessionExpiredHandler = (fn: OnSessionExpired) => {
  _onSessionExpired = fn;
};

type OnAccountSuspended = () => void;
let _onAccountSuspended: OnAccountSuspended = () => { };

export const setAccountSuspendedHandler = (fn: OnAccountSuspended) => {
  _onAccountSuspended = fn;
};

const wwwAuthenticateSuggestsTokenRefresh = (header: string | null): boolean => {
  if (!header) return false;
  return /Bearer[^,]*error\s*=\s*"(invalid_token|expired_token)"/i.test(header) ||
    /\b(invalid_token|expired_token)\b/i.test(header);
};

/** Matches Nest `JwtGuard` + API contract: expired access JWT uses this exact phrase in `message`. */
const messageSuggestsExpiredJwt = (message: unknown): boolean => {
  if (typeof message !== "string") return false;
  return /jwt expired|token expired|access token expired/i.test(message);
};

const shouldAttemptTokenRefreshFromResponse = (
  response: Response,
  data: Record<string, unknown>
): boolean => {
  if (response.status !== ApiStatusCodes.UNAUTHORIZED) return false;
  if (isAccountSuspendedMessage(data.message)) return false;
  if (wwwAuthenticateSuggestsTokenRefresh(response.headers.get("WWW-Authenticate"))) {
    return true;
  }
  return messageSuggestsExpiredJwt(data.message);
};

const getErrorTitle = (statusCode: number): string => {
  switch (statusCode) {
    case ApiStatusCodes.BAD_REQUEST:
      return "Bad Request";
    case ApiStatusCodes.UNAUTHORIZED:
      return "Unauthorized";
    case ApiStatusCodes.NOT_FOUND:
      return "Not Found";
    case ApiStatusCodes.CONFLICT:
      return "Conflict";
    case ApiStatusCodes.TOO_MANY_REQUESTS:
      return "Too Many Requests";
    case ApiStatusCodes.INTERNAL_SERVER_ERROR:
      return "Server Error";
    case ApiStatusCodes.SERVICE_UNAVAILABLE:
      return "Service Unavailable";
    default:
      return "Error";
  }
};

const toHeaderRecord = (init: HeadersInit | undefined): Record<string, string> => {
  const out: Record<string, string> = {};
  if (!init) return out;
  if (init instanceof Headers) {
    init.forEach((v, k) => {
      out[k] = v;
    });
    return out;
  }
  if (Array.isArray(init)) {
    for (const [k, v] of init) out[k] = v;
    return out;
  }
  return { ...init };
};

const hasAuthorizationHeader = (headers: Record<string, string>): boolean =>
  Object.keys(headers).some((k) => k.toLowerCase() === "authorization");

const buildFetchHeaders = (
  init: HeadersInit | undefined,
  token: string | null,
  isPublic: boolean
): Record<string, string> => {
  const headers = toHeaderRecord(init);
  if (!isPublic && token && !hasAuthorizationHeader(headers)) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const responseHandler = async <T>(response: Response): Promise<T> => {
  if (response.status === ApiStatusCodes.NO_CONTENT) {
    return null as unknown as T;
  }

  let data: unknown;
  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    console.error("Failed to parse response as JSON:", e);
    data = {};
  }

  const body = data && typeof data === "object" ? (data as Record<string, unknown>) : {};

  if (!response.ok) {
    const msg = body.message;
    const message =
      typeof msg === "string" && msg ? msg : "An error occurred";

    const isSuspended =
      response.status === ApiStatusCodes.UNAUTHORIZED &&
      isAccountSuspendedMessage(message);

    throw new ApiError({
      message,
      statusCode: response.status,
      errorTitle: getErrorTitle(response.status),
      shouldAttemptTokenRefresh: shouldAttemptTokenRefreshFromResponse(response, body),
      isAccountSuspended: isSuspended,
    });
  }

  // Unwrap NestJS envelope: { success, statusCode, data, timestamp }
  return (body.data ?? data) as T;
};

// ─── Singleton ────────────────────────────────────────────────────────────────

class NetworkManager {
  private static instance: NetworkManager;
  private refreshPromise: Promise<string | null> | null = null;
  private sessionInvalidateHandled = false;
  /** When refresh returns 401 Account suspended, skip `handleSessionExpired` (suspension already cleared the session). */
  private refreshEndedWithAccountSuspended = false;

  static getInstance(): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  private async silentRefresh(): Promise<string | null> {
    const refreshToken = tokenStore.getRefreshToken();
    const userId = tokenStore.getUserId();
    if (!refreshToken || !userId) return null;

    this.refreshEndedWithAccountSuspended = false;

    try {
      const res = await fetch(NetworkConfig.shared.authRefreshUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, refreshToken }),
      });

      const text = await res.text();
      const parsed: unknown = text ? JSON.parse(text) : {};
      const body =
        parsed && typeof parsed === "object"
          ? (parsed as Record<string, unknown>)
          : {};

      if (!res.ok) {
        if (isAccountSuspendedMessage(body.message)) {
          this.refreshEndedWithAccountSuspended = true;
          this.handleAccountSuspended();
        }
        return null;
      }

      const data = (body.data ?? parsed) as {
        accessToken?: string;
        refreshToken?: string;
      };
      if (
        typeof data.accessToken !== "string" ||
        typeof data.refreshToken !== "string"
      ) {
        return null;
      }

      tokenStore.updateTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    } catch {
      return null;
    }
  }

  private handleSessionExpired(): void {
    if (this.sessionInvalidateHandled) return;
    this.sessionInvalidateHandled = true;
    tokenStore.clear();
    _onSessionExpired();
    setTimeout(() => {
      this.sessionInvalidateHandled = false;
    }, 3000);
  }

  private handleAccountSuspended(): void {
    if (this.sessionInvalidateHandled) return;
    this.sessionInvalidateHandled = true;
    tokenStore.clear();
    _onAccountSuspended();
    setTimeout(() => {
      this.sessionInvalidateHandled = false;
    }, 3000);
  }

  private canTryRefresh(
    error: ApiError,
    ctx: { isPublic: boolean; hadBearer: boolean; isRetry: boolean }
  ): boolean {
    if (ctx.isPublic || ctx.isRetry) return false;
    if (error.statusCode !== ApiStatusCodes.UNAUTHORIZED) return false;
    if (!ctx.hadBearer) return false;
    return error.shouldAttemptTokenRefresh;
  }

  private async runWithRefresh<T>(
    ctx: { isPublic: boolean; hadBearer: boolean; isRetry: boolean },
    execute: () => Promise<T>
  ): Promise<T> {
    try {
      return await execute();
    } catch (error) {
      if (!(error instanceof ApiError)) throw error;

      if (error.isAccountSuspended && ctx.hadBearer) {
        this.handleAccountSuspended();
      }

      if (this.canTryRefresh(error, ctx)) {
        if (!this.refreshPromise) {
          this.refreshPromise = this.silentRefresh().finally(() => {
            this.refreshPromise = null;
          });
        }

        const newToken = await this.refreshPromise;

        if (!newToken) {
          if (!this.refreshEndedWithAccountSuspended) {
            this.handleSessionExpired();
          }
          this.refreshEndedWithAccountSuspended = false;
          throw error;
        }

        return this.runWithRefresh<T>(
          { ...ctx, isRetry: true },
          execute
        );
      }

      throw error;
    }
  }

  async makeApiCall<T>(endpoint: string, options: RequestOptions): Promise<T> {
    const { _retry, isPublic, ...fetchOptions } = options;
    const isRetry = !!_retry;
    const publicRoute = !!isPublic;
    const fullURL = `${NetworkConfig.shared.baseURL}${endpoint}`;

    const hadBearer = hasAuthorizationHeader(
      buildFetchHeaders(fetchOptions.headers, tokenStore.get(), publicRoute)
    );

    const runFetch = () => {
      const headers = buildFetchHeaders(
        fetchOptions.headers,
        tokenStore.get(),
        publicRoute
      );
      return fetch(fullURL, { ...fetchOptions, headers }).then((response) =>
        responseHandler<T>(response)
      );
    };

    return this.runWithRefresh<T>(
      { isPublic: publicRoute, hadBearer, isRetry },
      runFetch
    );
  }

  async upload<T>(
    endpoint: string,
    formData: FormData,
    method: "POST" | "PATCH" = "POST",
    options?: UploadOptions
  ): Promise<T> {
    const isRetry = !!options?._retry;
    const publicRoute = !!options?.isPublic;
    const fullURL = `${NetworkConfig.shared.baseURL}${endpoint}`;

    const hadBearer = hasAuthorizationHeader(
      buildFetchHeaders(undefined, tokenStore.get(), publicRoute)
    );

    const runFetch = () => {
      const headers = buildFetchHeaders(undefined, tokenStore.get(), publicRoute);
      return fetch(fullURL, { method, headers, body: formData }).then((response) =>
        responseHandler<T>(response)
      );
    };

    return this.runWithRefresh<T>(
      { isPublic: publicRoute, hadBearer, isRetry },
      runFetch
    );
  }
}

// ─── Instance ─────────────────────────────────────────────────────────────────

const networkManager = NetworkManager.getInstance();

const makeApiCall = <T>(endpoint: string, options: RequestOptions): Promise<T> =>
  networkManager.makeApiCall<T>(endpoint, options);

// ─── Public API ───────────────────────────────────────────────────────────────

export const getRequest = async <T>(
  endpoint: string,
  opts?: PublicRequestOptions
): Promise<T> =>
  makeApiCall<T>(endpoint, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    ...opts,
  });

export const postRequest = async <T, B = unknown>(
  endpoint: string,
  body: B,
  opts?: PublicRequestOptions
): Promise<T> =>
  makeApiCall<T>(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    ...opts,
  });

export const postFileRequest = async <T>(endpoint: string, formData: FormData): Promise<T> =>
  networkManager.upload<T>(endpoint, formData, "POST");

export const patchFormRequest = async <T>(endpoint: string, formData: FormData): Promise<T> =>
  networkManager.upload<T>(endpoint, formData, "PATCH");

export const patchRequest = async <T, B = unknown>(endpoint: string, body: B): Promise<T> =>
  makeApiCall<T>(endpoint, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const putRequest = async <T, B = unknown>(endpoint: string, body: B): Promise<T> =>
  makeApiCall<T>(endpoint, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const deleteRequest = async <T, B = unknown>(endpoint: string, body?: B): Promise<T> =>
  makeApiCall<T>(endpoint, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
