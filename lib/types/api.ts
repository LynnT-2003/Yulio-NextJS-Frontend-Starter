export type ApiResponse<T> = {
  success: true;
  statusCode: number;
  data: T;
  timestamp: string;
};

/**
 * 401 `message` contract with Nest `JwtGuard` + `HttpExceptionFilter` (no extra fields).
 * `NetworkManager` maps these for Bearer requests: see `auth-unauthorized.ts`.
 */

/** JSON error body from Nest `HttpExceptionFilter` (wire shape; client throws `ApiError` from `@/lib/domain/api/ApiError`). */
export type ApiErrorBody = {
  success: false;
  statusCode: number;
  message: string;
  path: string;
  timestamp: string;
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

/** Nest `IUserAdminModerationView` — admin moderation APIs only. */
export type ModerationUser = User & {
  isSuspended: boolean;
  suspensionReason: string | null;
  suspendedAt: string | null;
};

export type ModerationUserListResult = {
  items: ModerationUser[];
  total: number;
  page: number;
  limit: number;
};