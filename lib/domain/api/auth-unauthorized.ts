/**
 * Maps Nest `HttpExceptionFilter` + JWT auth `message` strings to client session actions.
 * Add new wire strings here as the API grows.
 */

const norm = (message: string) => message.trim().toLowerCase();

/** Known 401 `message` values from the backend (keep in sync with Nest). */
export const UnauthorizedWireMessage = {
  accountSuspended: "Account suspended",
  userNoLongerExists: "User no longer exists",
} as const;

export enum UnauthorizedSessionAction {
  AccountSuspended = "account_suspended",
  SignOut = "sign_out",
  TryRefresh = "try_refresh",
}

export function isAccountSuspendedMessage(message: unknown): boolean {
  return (
    typeof message === "string" &&
    norm(message) === norm(UnauthorizedWireMessage.accountSuspended)
  );
}

/** Next step for 401 on a non-public request that sent Bearer (before optional refresh retry). */
export function resolveUnauthorizedSessionAction(
  message: string
): UnauthorizedSessionAction {
  if (isAccountSuspendedMessage(message)) return UnauthorizedSessionAction.AccountSuspended;
  if (norm(message) === norm(UnauthorizedWireMessage.userNoLongerExists)) {
    return UnauthorizedSessionAction.SignOut;
  }
  return UnauthorizedSessionAction.TryRefresh;
}
