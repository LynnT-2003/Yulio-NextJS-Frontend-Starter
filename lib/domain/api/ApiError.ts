import { isAccountSuspendedMessage } from "./account-suspended";

/** Thrown by `NetworkManager` on non-OK HTTP responses (Nest body: `message` is a string). */
export class ApiError extends Error {
  readonly success = false as const;
  readonly statusCode: number;
  readonly errorTitle: string;
  readonly shouldAttemptTokenRefresh: boolean;
  /** Nest JWT / auth when the user account is suspended (do not refresh; clear session). */
  readonly isAccountSuspended: boolean;

  constructor(params: {
    message: string;
    statusCode: number;
    errorTitle: string;
    shouldAttemptTokenRefresh: boolean;
    isAccountSuspended?: boolean;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.statusCode = params.statusCode;
    this.errorTitle = params.errorTitle;
    this.shouldAttemptTokenRefresh = params.shouldAttemptTokenRefresh;
    this.isAccountSuspended =
      params.isAccountSuspended ?? isAccountSuspendedMessage(params.message);
  }
}
