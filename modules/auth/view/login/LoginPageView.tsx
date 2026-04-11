"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/config/routes";
import type { LoginPageVm } from "@/modules/auth/viewModel/login/loginPageVm";

export function LoginPageView({
  vm,
  showSuspendedNotice = false,
}: {
  vm: LoginPageVm;
  showSuspendedNotice?: boolean;
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-4 py-12 sm:px-6">
      <form
        onSubmit={vm.onSubmit}
        className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sign in
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Email and password against your Nest API (local strategy).
          </p>
        </div>

        {showSuspendedNotice ? (
          <p
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"
            role="status"
          >
            Your account has been suspended. You can&apos;t use the app until an
            administrator restores access. Contact support if you think this is a mistake.
          </p>
        ) : null}

        {vm.error ? (
          <p
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            {vm.error}
          </p>
        ) : null}

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            value={vm.email}
            onChange={(e) => vm.setEmail(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Password
          </span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={vm.password}
            onChange={(e) => vm.setPassword(e.target.value)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </label>

        <Button
          type="submit"
          disabled={vm.pending}
          className="mt-2 h-auto min-h-10 w-full py-2.5"
        >
          {vm.pending ? "Signing in…" : "Sign in"}
        </Button>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          No account?{" "}
          <Link
            href={routes.register}
            className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
          >
            Register
          </Link>
        </p>
      </form>

      <div className="flex w-full max-w-md flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            OAuth providers
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Each button opens your API&apos;s provider flow (same tab). When the API has{" "}
            <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-900">
              FRONTEND_OAUTH_CALLBACK_URL
            </code>{" "}
            set to this app&apos;s{" "}
            <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-900">
              /auth/callback
            </code>{" "}
            URL, you return here signed in. Otherwise you&apos;ll see JSON on the API —
            use{" "}
            <Link
              href={routes.oauthImport}
              className="font-medium text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100"
            >
              OAuth import
            </Link>
            .
          </p>
        </div>
        <ul className="flex flex-col gap-2">
          {vm.oauthItems.map(({ id, label, description, href }) => (
            <li key={id}>
              <a
                href={href}
                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
              >
                <span>{label}</span>
                <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">
                  {description}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p className="max-w-md text-center text-xs text-zinc-500 dark:text-zinc-400">
        Add your Next origin to <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-900">ALLOWED_ORIGINS</code>{" "}
        on the API. See{" "}
        <Link href={routes.oauthImport} className="underline-offset-2 hover:underline">
          OAuth import
        </Link>{" "}
        for provider flows that return JSON on the API host.
      </p>
    </div>
  );
}
