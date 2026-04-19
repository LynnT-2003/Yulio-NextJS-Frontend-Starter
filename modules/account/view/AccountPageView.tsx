"use client";

import type { AccountPageVm } from "@/modules/account/viewModel/accountPageVm";
import { UserProfilePanel } from "@/modules/account/components/UserProfilePanel";
import { PlanCard } from "@/modules/account/components/PlanCard";

export function AccountPageView({ vm }: { vm: AccountPageVm }) {
  const { user, syncError } = vm;

  if (!user) return null;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Your account
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Data from <code className="text-xs">GET /api/users/me</code> after hydration
          from your session.
        </p>
      </div>

      {syncError ? (
        <p
          className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
          role="status"
        >
          {syncError} — showing last known profile from this browser.
        </p>
      ) : null}

      <UserProfilePanel user={user} />
      <PlanCard />
    </div>
  );
}
