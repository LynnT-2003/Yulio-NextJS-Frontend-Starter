let _accessToken: string | null = null;
let _refreshToken: string | null = null;
let _userId: string | null = null;

export const tokenStore = {
  /** Access JWT used as Bearer on API calls. */
  get: () => _accessToken,
  /** Set access token only (e.g. after silent refresh — refresh token is updated separately). */
  set: (t: string) => {
    _accessToken = t;
  },
  getRefreshToken: () => _refreshToken,
  getUserId: () => _userId,
  /**
   * After login/register (or full re-auth). Required for direct Nest refresh without a BFF.
   */
  setSession: (accessToken: string, refreshToken: string, userId: string) => {
    _accessToken = accessToken;
    _refreshToken = refreshToken;
    _userId = userId;
  },
  /** After token rotation from POST /api/auth/refresh. */
  updateTokens: (accessToken: string, refreshToken: string) => {
    _accessToken = accessToken;
    _refreshToken = refreshToken;
  },
  clear: () => {
    _accessToken = null;
    _refreshToken = null;
    _userId = null;
  },
};
