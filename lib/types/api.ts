export type ApiResponse<T> = {
  success: true;
  statusCode: number;
  data: T;
  timestamp: string;
};

/**
 * Nest (or any API) should set `code` to this on 401 when the access JWT is expired
 * so the client can refresh. Generic 401s (wrong password, missing role, etc.) must omit it.
 */
export const API_AUTH_ERROR_TOKEN_EXPIRED = "TOKEN_EXPIRED" as const;

export type ApiAuthErrorCode =
  | typeof API_AUTH_ERROR_TOKEN_EXPIRED
  | "JWT_EXPIRED"
  | "INVALID_ACCESS_TOKEN";

export type ApiError = {
  success: false;
  statusCode: number;
  message: string;
  path: string;
  timestamp: string;
  /** Machine-readable reason; use API_AUTH_ERROR_TOKEN_EXPIRED for expired access JWT */
  code?: ApiAuthErrorCode | string;
};

export type UserRole = "user" | "admin";

export type UserProviderDetail = {
  provider: string;
  connectedAt: string;
};

/** Mirrors Nest `IUserPublic` / `UserPublicDto` (envelope unwrapped by NetworkManager). */
export type User = {
  _id: string;
  email: string | null;
  displayName: string;
  avatar: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  providers: string[];
  /** Present on Nest `UserPublicDto`; optional for older cached sessions. */
  providerDetails?: UserProviderDetail[];
  createdAt: string;
  updatedAt: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = {
  user: User;
  tokens: AuthTokens;
};