"use client";

import type { User } from "@/lib/types/api";

function fmt(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function AccountSuspendedBanner({ user }: { user: User }) {
  if (!user.isSuspended) return null;

  const when = fmt(user.suspendedAt);
  const reason = user.suspensionReason?.trim();

  return (
    <div
      className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/50 dark:text-amber-50"
      role="status"
    >
      <p className="mx-auto max-w-5xl font-medium">
        Your account has been suspended
        {when ? ` · since ${when}` : ""}. You can review your profile and sign out;
        other actions are unavailable until an administrator restores access.
      </p>
      {reason ? (
        <p className="mx-auto mt-2 max-w-5xl text-amber-900/90 dark:text-amber-100/90">
          <span className="font-medium">Note:</span> {reason}
        </p>
      ) : null}
      <p className="mx-auto mt-2 max-w-5xl text-amber-800/90 dark:text-amber-200/80">
        Think this is a mistake? Contact support.
      </p>
    </div>
  );
}
