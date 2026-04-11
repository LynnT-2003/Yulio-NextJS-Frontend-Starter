/** Matches Nest `UnauthorizedException('Account suspended')` message string. */
export const ACCOUNT_SUSPENDED_MESSAGE = "Account suspended";

export function isAccountSuspendedMessage(message: unknown): boolean {
  return (
    typeof message === "string" &&
    message.trim().toLowerCase() === ACCOUNT_SUSPENDED_MESSAGE.toLowerCase()
  );
}
