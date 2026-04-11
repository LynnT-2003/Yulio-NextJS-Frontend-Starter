# OneForAll — Next.js frontend (auth client)

SPA-style **App Router** client for the Nest **OneForAll** API ([product](https://yuliolabs.com/one-for-all)): same response envelope, JWT access + refresh rotation, and all OAuth entrypoints your backend exposes. **No BFF** — the browser talks to the API directly (CORS + public auth routes).

## Quick start

```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_API_BASE_URL to your Nest origin (see below)
npm install
npm run dev
```

Ensure the API’s `ALLOWED_ORIGINS` includes this app’s origin (e.g. `http://localhost:3000`).

### OAuth back to this app (LINE, Google, …)

On the **Nest** deployment set:

`FRONTEND_OAUTH_CALLBACK_URL=https://<your-next-host>/auth/callback`

(full URL, no hash — the API appends tokens in the `#fragment`).

Example local dev:

- API: `http://localhost:8080`
- Next: `http://localhost:3000`
- Nest `.env`: `FRONTEND_OAUTH_CALLBACK_URL=http://localhost:3000/auth/callback`

Then completing LINE (or any provider) **redirects** to your Next app and lands on **Account** after `/auth/callback` runs in the browser.

If that variable is **unset**, callbacks keep returning **JSON on the API host** (good for mobile / non-browser clients). Use **`/auth/oauth-import`** to paste that JSON when testing without the redirect.

## Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | API root: either `https://api.example.com` or `https://api.example.com/api` (see `lib/config/api-path.ts`). |

## Architecture

Layers mirror the Nest idea: **routes** stay thin; **features** own UI; **domain** owns HTTP + session rules; **lib/domain/api** is the single HTTP transport.

```text
app/                      # Routes only — compose feature components
components/layout/        # Shell (header, …)
features/
  auth/
    components/           # Forms, OAuth grid, callback UI, guards
    lib/parse-oauth-json.ts   # Paste-helper only (not transport)
  account/components/     # Profile dashboard
  home/components/        # Landing
lib/
  config/                 # `routes`, `apiPath` / `apiAbsoluteUrl`
  domain/
    api/                  # NetworkManager, tokenStore, status codes (stable transport)
    auth/
      auth-api.ts         # Login/register/logout + OAuth *start* URLs (same module = one auth surface)
      session-storage.ts  # localStorage adapter for the SPA session snapshot
    user/
      user-api.ts         # e.g. GET /users/me
  types/                  # DTO-aligned types
providers/                # AuthProvider / useAuth
```

### What lives where (auth)

| Piece | Responsibility |
|--------|-----------------|
| **`auth-api.ts`** | All **HTTP** auth calls plus **OAuth start URLs** (`oauthStartUrls` / `oauthProviders`). One place to import for “anything that talks auth to the API or starts OAuth in the browser”. |
| **`session-storage.ts`** | Serialize/deserialize the SPA session for reloads. Not HTTP — a **persistence adapter**. New features should not add parallel keys; extend this module if the snapshot shape grows. |
| **`features/auth/lib/parse-oauth-json.ts`** | **Dev / fallback** only: parse pasted Swagger-style JSON. Not used by `NetworkManager`. |
| **`lib/config/api-path.ts`** | How `NEXT_PUBLIC_API_BASE_URL` is joined to paths — no business logic. |

### `NetworkManager` (domain API) — stable contract

Treat **`lib/domain/api/NetworkManager.ts`** as the **only** place that:

- unwraps Nest `{ success, data, … }`;
- attaches Bearer tokens;
- runs refresh + retry on 401.

Changes here should be **cross-cutting** only, for example:

- **`isPublic` on `getRequest` / `postRequest`** — generic “skip Bearer” for any public route, not auth-specific hacks.
- **Normalizing `message` when it is a `string[]`** — matches `class-validator` / `ValidationPipe` globally.

New product features (payments, admin, …) add **`lib/domain/<feature>/<feature>-api.ts`** that **only** calls `getRequest` / `postRequest` / … — they do **not** extend `NetworkManager` per feature.

### Request flow

1. **Public** calls use `postRequest(..., { isPublic: true })` where the route is `@Public()` on Nest.
2. **Authenticated** calls use the default (Bearer from `tokenStore`).
3. On **401** when refresh is appropriate, `NetworkManager` calls **`POST /api/auth/refresh`**, then retries once.

### Session model

- **Memory**: `tokenStore` — access + refresh + `userId` for interceptors.
- **Persistence**: `localStorage` (`session-storage.ts`) — tokens + user snapshot.
- **Logout**: `POST /api/auth/logout`, then clear both.

## Routes

| Path | Role |
|------|------|
| `/` | Landing + CTAs |
| `/login` | Local sign-in + OAuth links |
| `/register` | Local registration |
| `/account` | **Protected** — profile from `GET /api/users/me` |
| `/logout` | API logout + clear session |
| `/auth/callback` | OAuth return (hash tokens) when `FRONTEND_OAUTH_CALLBACK_URL` is set on Nest |
| `/auth/oauth-import` | Paste OAuth JSON (fallback) |

## Alignment with Nest

- Global prefix `api`, `TransformInterceptor` success shape, `HttpExceptionFilter` errors.
- Types in `lib/types/api.ts` follow `UserPublicDto` / `AuthResponse`.

## Scripts

- `npm run dev` — Next dev server  
- `npm run build` / `npm run start` — production  

---

Built as the **frontend foundation** for OneForAll: add domains under `features/<domain>` and `lib/domain/<domain>` without changing the HTTP core unless the **API contract** itself changes.
