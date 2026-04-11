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

Routes stay thin. **One screen = one pair of named files:** `*PageVm.ts` (type + `use…Vm` hook) and `*PageView.tsx` (or `*View.tsx` for non-pages like the header). If a module only has **one** screen, those files sit **directly** under `viewModel/` and `view/` (no extra `account/` folder). If a module has **several** screens (e.g. `auth`), use **`viewModel/<segment>/`** and **`view/<segment>/`**, each with one named VM + one named view. Optional **`components/`** for dumb UI. **`utils/`** for helpers only. **Domain** (`lib/domain/`) owns HTTP.

### MVVM in this repo

| Layer | Role |
|--------|------|
| **`app/**/page.tsx`** | Calls the screen’s `use…Vm()` and renders the matching `…View` with `vm={…}`. |
| **`viewModel/*.ts` or `viewModel/<segment>/*.ts`** | Exports `FooPageVm` / `useFooPageVm()`, etc. |
| **`view/*.tsx` or `view/<segment>/*.tsx`** | Exports `FooPageView({ vm })` — presentational. |
| **`ProtectedLayoutClient`** | Client shell for `(protected)` layout; wires `useRequireAuthVm` + `RequireAuthView`. |
| **`modules/layout/Navbar.tsx`** | Root shell nav (single client component; no separate view/viewModel). |

Example (`/account` — single screen, flat under `modules/account`):

```tsx
"use client";
import { useAccountPageVm } from "@/modules/account/viewModel/accountPageVm";
import { AccountPageView } from "@/modules/account/view/AccountPageView";

export default function AccountPage() {
  const vm = useAccountPageVm();
  return <AccountPageView vm={vm} />;
}
```

### Directory layout

```text
app/
  (protected)/layout.tsx   # → ProtectedLayoutClient
  (protected)/account/page.tsx
  auth/callback, auth/oauth-import, login, register, …
modules/
  account/
    viewModel/accountPageVm.ts
    view/AccountPageView.tsx
    components/UserProfilePanel.tsx   # optional
  auth/
    viewModel/login/loginPageVm.ts
    view/login/LoginPageView.tsx
    viewModel/register/registerPageVm.ts
    view/register/RegisterPageView.tsx
    viewModel/oauth-callback/oauthCallbackVm.ts
    view/oauth-callback/OAuthCallbackView.tsx
    viewModel/oauth-import/oauthImportVm.ts
    view/oauth-import/OAuthImportView.tsx
    viewModel/protected/requireAuthVm.ts
    view/protected/RequireAuthView.tsx
    utils/parse-oauth-json.ts
    ProtectedLayoutClient.tsx
  home/
    viewModel/homePageVm.ts
    view/HomePageView.tsx
  layout/
    Navbar.tsx
components/ui/
lib/
  config/                 # `routes`, `apiPath` / `apiAbsoluteUrl`
  domain/
    api/                  # NetworkManager, tokenStore, status codes (stable transport)
    auth/
      auth-api.ts         # Login/register/logout + OAuth *start* URLs
      session-storage.ts  # localStorage adapter for the SPA session snapshot
    user/
      user-api.ts         # e.g. GET /users/me
  types/                  # DTO-aligned types
providers/                # AuthProvider / useAuth
```

**Protected routes:** `app/(protected)/layout.tsx` uses `ProtectedLayoutClient` (wires `viewModel/protected` + `view/protected`). URLs are unchanged (`(protected)` is a route group).

### What lives where (auth)

| Piece | Responsibility |
|--------|-----------------|
| **`auth-api.ts`** | All **HTTP** auth calls plus **OAuth start URLs** (`oauthStartUrls` / `oauthProviders`). One place to import for “anything that talks auth to the API or starts OAuth in the browser”. |
| **`session-storage.ts`** | Serialize/deserialize the SPA session for reloads. Not HTTP — a **persistence adapter**. New screens should not add parallel keys; extend this module if the snapshot shape grows. |
| **`modules/auth/utils/parse-oauth-json.ts`** | **Dev / fallback** only: parse pasted JSON. Not used by `NetworkManager`. |
| **`lib/config/api-path.ts`** | How `NEXT_PUBLIC_API_BASE_URL` is joined to paths — no business logic. |

### `NetworkManager` (domain API) — stable contract

Treat **`lib/domain/api/NetworkManager.ts`** as the **only** place that:

- unwraps Nest `{ success, data, … }`;
- attaches Bearer tokens;
- runs refresh + retry on 401.

Changes here should be **cross-cutting** only, for example:

- **`isPublic` on `getRequest` / `postRequest`** — generic “skip Bearer” for any public route, not auth-specific hacks.
- **Normalizing `message` when it is a `string[]`** — matches `class-validator` / `ValidationPipe` globally.

New product areas add **`lib/domain/<feature>/<feature>-api.ts`** that **only** calls `getRequest` / `postRequest` / … — they do **not** extend `NetworkManager` per feature.

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
| `/account` | **Protected** (`app/(protected)/`) — profile from `GET /api/users/me` |
| *(no `/logout` route)* | Use **Log out** in the header — calls `POST /api/auth/logout` via `useAuth().logout()` |
| `/auth/callback` | OAuth return (hash tokens) when `FRONTEND_OAUTH_CALLBACK_URL` is set on Nest |
| `/auth/oauth-import` | Paste OAuth JSON (fallback) |

## Alignment with Nest

- Global prefix `api`, `TransformInterceptor` success shape, `HttpExceptionFilter` errors.
- Types in `lib/types/api.ts` follow `UserPublicDto` / `AuthResponse`.

## Scripts

- `npm run dev` — Next dev server  
- `npm run build` / `npm run start` — production  

---

Built as the **frontend foundation** for OneForAll: add **`modules/<domain>/`** (`viewModel/`, `view/`, optional `components/` and `utils/`) and **`lib/domain/<domain>/`** for new API surfaces without changing the HTTP core unless the **API contract** itself changes.
