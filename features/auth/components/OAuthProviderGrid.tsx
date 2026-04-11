"use client";

import Link from "next/link";
import { oauthProviders, oauthStartUrls } from "../../../lib/domain/auth/auth-api";
import { routes } from "../../../lib/config/routes";

export function OAuthProviderGrid() {
  return (
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
        {oauthProviders.map(({ id, label, description }) => (
          <li key={id}>
            <a
              href={oauthStartUrls[id]()}
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
  );
}
