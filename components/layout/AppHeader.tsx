"use client";

import Link from "next/link";
import { routes } from "../../lib/config/routes";
import { useAuth } from "../../providers/auth-provider";

export function AppHeader() {
  const { user, ready } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href={routes.home}
          className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          OneForAll <span className="font-normal text-zinc-500">frontend</span>
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          {!ready ? (
            <span className="text-zinc-400">…</span>
          ) : user ? (
            <>
              <Link
                href={routes.account}
                className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Account
              </Link>
              <Link
                href={routes.logout}
                className="rounded-lg bg-zinc-900 px-3 py-1.5 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                Log out
              </Link>
            </>
          ) : (
            <>
              <Link
                href={routes.login}
                className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Sign in
              </Link>
              <Link
                href={routes.register}
                className="rounded-lg bg-zinc-900 px-3 py-1.5 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
