import { isAccountSuspendedMessage } from "./NetworkUnauthorizedHandler";

/** Thrown by `NetworkManager` on non-OK HTTP responses (Nest body: `message` is a string). */
export class ApiError extends Error {
  readonly success = false as const;
  readonly statusCode: number;
  readonly errorTitle: string;
  /** Nest **403** (or legacy **401**) with `message: "Account suspended"` — authorization, not invalid session. */
  readonly isAccountSuspended: boolean;

  constructor(params: {
    message: string;
    statusCode: number;
    errorTitle: string;
    isAccountSuspended?: boolean;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.statusCode = params.statusCode;
    this.errorTitle = params.errorTitle;
    this.isAccountSuspended =
      params.isAccountSuspended ??
      (isAccountSuspendedMessage(params.message) &&
        (params.statusCode === 401 || params.statusCode === 403));
  }
}
