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
  isSuspended: boolean;
  suspensionReason: string | null;
  suspendedAt: string | null;
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

export type PaymentPlanId = "free" | "pro" | "lifetime";

export interface UserPlan {
  stripeCustomerId: string | null;
  plan: PaymentPlanId;
  planExpiresAt: string | null;
}

export interface CheckoutSession {
  url: string;
  sessionId: string;
}

export interface BillingPortalSession {
  url: string;
}

/** Same as {@link User} — moderation list returns full public profile. */
export type ModerationUser = User;

export type ModerationUserListResult = {
  items: ModerationUser[];
  total: number;
  page: number;
  limit: number;
};