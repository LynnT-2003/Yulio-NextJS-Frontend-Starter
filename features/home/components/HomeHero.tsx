"use client";

import Link from "next/link";
import { routes } from "../../../lib/config/routes";
import { useAuth } from "../../../providers/auth-provider";

export function HomeHero() {
  const { user, ready } = useAuth();

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-20 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
        OneForAll · production auth foundation
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
        Next.js client for your Nest API
      </h1>
      <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
        End-to-end JWT access + refresh rotation, local login, and every OAuth
        provider your backend exposes — structured by domain so you can scale
        features the same way as{" "}
        <a
          href="https://yuliolabs.com/one-for-all"
          className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
          target="_blank"
          rel="noreferrer"
        >
          OneForAll
        </a>
        .
      </p>

      <div className="flex flex-wrap gap-3">
        {!ready ? null : user ? (
          <Link
            href={routes.account}
            className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            View your profile
          </Link>
        ) : (
          <>
            <Link
              href={routes.login}
              className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
            >
              Sign in
            </Link>
            <Link
              href={routes.register}
              className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 dark:border-zinc-600 dark:text-zinc-100"
            >
              Register
            </Link>
          </>
        )}
        <Link
          href={routes.oauthImport}
          className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 dark:border-zinc-600 dark:text-zinc-100"
        >
          OAuth JSON import
        </Link>
      </div>
    </section>
  );
}
