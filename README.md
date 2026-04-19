# OneForAll — Next.js frontend (auth client)

SPA-style **App Router** client for the Nest **OneForAll** API ([product](https://yuliolabs.com)): same response envelope, JWT access + refresh rotation, and all OAuth entrypoints your backend exposes. **No BFF** — the browser talks to the API directly (CORS + public auth routes).

## Table of contents

- [Quick start](#quick-start)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [Account management & suspended users](#account-management--suspended-users)
- [Payment & subscriptions](#payment--subscriptions)
- [Routes](#routes)
- [API alignment with Nest](#api-alignment-with-nest)
- [Scripts](#scripts)

## Quick start

```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_API_BASE_URL to your Nest origin (see below)
npm install
npm run dev
```

Ensure the API’s `ALLOWED_ORIGINS` includes this app’s origin (e.g. `http://localhost:3000`).

## Configuration

### Environment variables

| Variable                   | Purpose                                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | API root: either `https://api.example.com` or `https://api.example.com/api` (see `lib/config/api-path.ts`). |

### OAuth callback (redirect back to this app)

On the **Nest** deployment set:

`FRONTEND_OAUTH_CALLBACK_URL=https://<your-next-host>/auth/callback`

(full URL, no hash — the API appends tokens in the `#fragment`).

Example local dev:

- API: `http://localhost:8080`
- Next: `http://localhost:3000`
- Nest `.env`: `FRONTEND_OAUTH_CALLBACK_URL=http://localhost:3000/auth/callback`

Then completing LINE (or any provider) **redirects** to your Next app and lands on **Account** after `/auth/callback` runs in the browser.

If that variable is **unset**, callbacks keep returning **JSON on the API host** (good for mobile / non-browser clients). Use **`/auth/oauth-import`** to paste that JSON when testing without the redirect.

## Architecture

Routes stay thin. **One screen = one pair of named files:** `*PageVm.ts` (type + `use…Vm` hook) and `*PageView.tsx` (or `*View.tsx` for non-pages like the header). If a module only has **one** screen, those files sit **directly** under `viewModel/` and `view/` (no extra `account/` folder). If a module has **several** screens (e.g. `auth`), use **`viewModel/<segment>/`** and **`view/<segment>/`**, each with one named VM + one named view. Optional **`components/`** for dumb UI. **`utils/`** for helpers only. **Domain** (`lib/domain/`) owns HTTP.

### MVVM in this repo

| Layer                                              | Role                                                                                 |
| -------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **`app/**/page.tsx`\*\*                            | Calls the screen’s `use…Vm()` and renders the matching `…View` with `vm={…}`.        |
| **`viewModel/*.ts` or `viewModel/<segment>/*.ts`** | Exports `FooPageVm` / `useFooPageVm()`, etc.                                         |
| **`view/*.tsx` or `view/<segment>/*.tsx`**         | Exports `FooPageView({ vm })` — presentational.                                      |
| **`ProtectedLayoutClient`**                        | Client shell for `(protected)` layout; wires `useRequireAuthVm` + `RequireAuthView`. |
| **`modules/layout/Navbar.tsx`**                    | Root shell nav (single client component; no separate view/viewModel).                |

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
  (protected)/admin/layout.tsx
  (protected)/admin/moderation/page.tsx
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
    viewModel/protected/requireAdminVm.ts
    view/protected/RequireAuthView.tsx
    view/protected/RequireAdminView.tsx
    utils/parse-oauth-json.ts
    ProtectedLayoutClient.tsx
    AdminLayoutClient.tsx
  home/
    viewModel/homePageVm.ts
    view/HomePageView.tsx
  layout/
    Navbar.tsx
    AccountSuspendedBanner.tsx
  admin/moderation/
    viewModel/moderationPageVm.ts
    view/ModerationPageView.tsx
  pricing/
    viewModel/pricingPageVm.ts
    view/PricingPageView.tsx
  pro-demo/
    viewModel/proDemoPageVm.ts
    view/ProDemoPageView.tsx
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
    payment/
      paymentApi.ts       # getUserPlan, createCheckoutSession, createBillingPortalSession
  types/                  # DTO-aligned types
providers/                # AuthProvider / useAuth
```

**Protected routes:** `app/(protected)/layout.tsx` uses `ProtectedLayoutClient` (wires `viewModel/protected` + `view/protected`). URLs are unchanged (`(protected)` is a route group).

### What lives where (auth)

| Piece                                        | Responsibility                                                                                                                                                                         |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`auth-api.ts`**                            | All **HTTP** auth calls plus **OAuth start URLs** (`oauthStartUrls` / `oauthProviders`). One place to import for “anything that talks auth to the API or starts OAuth in the browser”. |
| **`session-storage.ts`**                     | Serialize/deserialize the SPA session for reloads. Not HTTP — a **persistence adapter**. New screens should not add parallel keys; extend this module if the snapshot shape grows.     |
| **`modules/auth/utils/parse-oauth-json.ts`** | **Dev / fallback** only: parse pasted JSON. Not used by `NetworkManager`.                                                                                                              |
| **`lib/config/api-path.ts`**                 | How `NEXT_PUBLIC_API_BASE_URL` is joined to paths — no business logic.                                                                                                                 |

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

## Admin User Management & Account Suspension

This app follows the Nest template’s **auth vs authorization** model: suspended users **remain signed in**; the API blocks most actions with **`403 Forbidden`** and `message: "Account suspended"` unless the backend marks the route with **`@AllowSuspendedUser()`**.

### Types & session

- **`User`** in `lib/types/api.ts` includes **`isSuspended`**, **`suspensionReason`**, **`suspendedAt`** (aligned with **`IUserPublic`**). Login / OAuth / `GET /users/me` populate these fields.
- **`readPersistedSession()`** normalizes older `localStorage` payloads that omit suspension fields.

### HTTP layer

- **`ApiError.isAccountSuspended`** is set when **`message`** matches **`account suspended`** (case-insensitive) **and** **`statusCode`** is **401** or **403**. This does **not** clear the session (unlike generic session expiry).
- **`NetworkManager`** still refreshes on recoverable **401**s; **403** suspension responses are surfaced to the caller without signing the user out.

Keep **`lib/domain/api/NetworkUnauthorizedHandler.ts`** in sync with the Nest string if you change the API.

### UI behavior

- **`AccountSuspendedBanner`** (`modules/layout/AccountSuspendedBanner.tsx`) renders on **`(protected)`** routes via **`ProtectedLayoutClient`** when **`user.isSuspended`** (reason + support copy when present).
- **Admin** link and **`/admin/moderation`** access require **`role === "admin"`** and **`!user.isSuspended`** (`Navbar`, **`useRequireAdminVm`**).
- Optional **`/login?suspended=1`** notice remains for deep links; primary UX is the in-app banner.

### Pair with the API

Moderation endpoints, **`SuspendedUserBlockGuard`**, and the **`@AllowSuspendedUser()`** allowlist are documented in the **Nest template README** under **Account management & suspension** (same anchor id: `#account-management--suspension` when hosted on GitHub).

## Payment & subscriptions

Stripe is handled entirely server-side on the Nest API. The frontend never touches Stripe directly — it calls three endpoints and redirects the browser to Stripe-hosted pages.

### Plan states

| `plan`     | `planExpiresAt` | Meaning                          |
| ---------- | --------------- | -------------------------------- |
| `free`     | `null`          | No active subscription           |
| `pro`      | future date     | Active monthly subscription      |
| `pro`      | past date       | Lapsed — subscription expired    |
| `lifetime` | `null`          | One-time purchase, never expires |

### Domain layer

**`lib/domain/payment/paymentApi.ts`** exports:

| Export                                  | Calls                              |
| --------------------------------------- | ---------------------------------- |
| `getUserPlan()`                         | `GET /api/payment/plan`            |
| `createCheckoutSession(body)`           | `POST /api/payment/checkout`       |
| `createBillingPortalSession(returnUrl)` | `POST /api/payment/billing-portal` |
| `PRICE_IDS.pro` / `PRICE_IDS.lifetime`  | Stripe price ID constants          |

### Pages

- **`/pricing`** — plan selection; active plan highlighted; buttons adapt to current state (subscribe / manage / active).
- **`/account`** — `PlanCard` component shows plan, renewal date, and "Manage billing →" (hidden for free). Polls `GET /payment/plan` every 2 s (up to 10 s) after Stripe redirects back via `?payment=success`.
- **`/pro-demo`** — gated demo page: blurred content + upgrade CTA for free users; full content for pro/lifetime.

### Post-payment flow

1. User clicks **Subscribe** or **Buy once** on `/pricing`.
2. Frontend calls `POST /payment/checkout` → receives `{ url }` → redirects browser to `url`.
3. User pays on Stripe's hosted page; Stripe redirects to `/account?payment=success`.
4. `PlanCard` detects the query param and polls `GET /payment/plan` until the webhook fires and the plan updates.

Test cards (Stripe test mode): `4242 4242 4242 4242` succeeds, `4000 0000 0000 0002` declines, `4000 0025 0000 3155` triggers 3D Secure. Any future expiry and any 3-digit CVC.

## Routes

| Path                   | Role                                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `/`                    | Landing + CTAs                                                                           |
| `/login`               | Local sign-in + OAuth links                                                              |
| `/register`            | Local registration                                                                       |
| `/pricing`             | **Protected** — plan selection and Stripe checkout                                       |
| `/account`             | **Protected** — profile from `GET /api/users/me` + plan card (works for suspended users) |
| `/pro-demo`            | **Protected** — gated demo page (free users see blur + upgrade CTA)                      |
| `/admin/moderation`    | **Protected** — admin moderation UI (`role: admin`, not suspended)                       |
| _(no `/logout` route)_ | Use **Log out** in the header — calls `POST /api/auth/logout` via `useAuth().logout()`   |
| `/auth/callback`       | OAuth return (hash tokens) when `FRONTEND_OAUTH_CALLBACK_URL` is set on Nest             |
| `/auth/oauth-import`   | Paste OAuth JSON (fallback)                                                              |

## API alignment with Nest

- Global prefix `api`, `TransformInterceptor` success shape, `HttpExceptionFilter` errors.
- Types in `lib/types/api.ts` follow `UserPublicDto` / `AuthResponse`.

## Scripts

- `npm run dev` — Next dev server
- `npm run build` / `npm run start` — production

---

Built as the **frontend foundation** for OneForAll: add **`modules/<domain>/`** (`viewModel/`, `view/`, optional `components/` and `utils/`) and **`lib/domain/<domain>/`** for new API surfaces without changing the HTTP core unless the **API contract** itself changes.
