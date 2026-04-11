/** Thrown by `NetworkManager` on non-OK HTTP responses (Nest body: `message` is a string). */
export class ApiError extends Error {
  readonly success = false as const;
  readonly statusCode: number;
  readonly errorTitle: string;
  readonly shouldAttemptTokenRefresh: boolean;

  constructor(params: {
    message: string;
    statusCode: number;
    errorTitle: string;
    shouldAttemptTokenRefresh: boolean;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.statusCode = params.statusCode;
    this.errorTitle = params.errorTitle;
    this.shouldAttemptTokenRefresh = params.shouldAttemptTokenRefresh;
  }
}
