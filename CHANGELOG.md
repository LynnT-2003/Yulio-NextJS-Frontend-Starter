# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2026-04-11]

### Added

- **Suspended accounts** (Nest `401` + `message: "Account suspended"`): `ApiError.isAccountSuspended`, `lib/domain/api/account-suspended.ts`, and `NetworkManager` behavior — no token refresh for that message; clears the session via **`setAccountSuspendedHandler`** and redirects to **`/login?suspended=1`** (session expiry still uses **`setSessionExpiredHandler`** → `/login`).
- **Login page**: `Suspense` + `useSearchParams` show an amber notice when `?suspended=1`.
- **`AuthProvider`**: registers both handlers (clears `tokenStore` + persisted session + `user`); **`refreshUser`** swallows suspended errors after the network layer clears the session.

### Fixed

- **Access-token refresh**: silent refresh now keys off the API **`message`** for expired JWTs (`jwt expired`), matching Nest `JwtGuard` behavior, instead of unused `code` / `error` fields or a generic `"Unauthorized"` string.

### Changed

- **`NetworkManager`**: dropped `code` / `error` body matching for `shouldAttemptTokenRefresh`; detection uses **`message`** (plus optional `WWW-Authenticate` for other stacks) only.
- **`ApiErrorBody`**: aligned with the wire shape from `HttpExceptionFilter` only (`success`, `statusCode`, `message`, `path`, `timestamp`); removed optional `code` and related auth code constants/types.

### Notes

- Pair with the Nest template’s **`JwtGuard.handleRequest`**: expired access token → `message: "jwt expired"`; bad/missing bearer JWT → `message: "invalid access token"`; login failures keep explicit messages such as `Invalid email or password`.
