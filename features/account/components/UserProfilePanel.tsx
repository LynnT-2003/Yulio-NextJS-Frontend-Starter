"use client";

import * as React from "react";
import type { User } from "../../../lib/types/api";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-zinc-100 py-3 last:border-0 sm:grid-cols-[minmax(8rem,30%)_1fr] sm:gap-4 dark:border-zinc-800">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>
      <dd className="text-sm text-zinc-900 break-all dark:text-zinc-100">
        {value}
      </dd>
    </div>
  );
}

export function UserProfilePanel({ user }: { user: User }) {
  const details = user.providerDetails ?? [];

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-100 bg-zinc-50/80 px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element -- OAuth avatar URLs are dynamic per provider
              <img
                src={user.avatar}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xl font-semibold text-zinc-500">
                {user.displayName.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {user.displayName}
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {user.email ?? "No email on file"}
            </p>
          </div>
        </div>
      </div>

      <dl className="px-6 py-2">
        <Row label="User ID" value={String(user._id)} />
        <Row label="Role" value={user.role} />
        <Row
          label="Email verified"
          value={user.isEmailVerified ? "Yes" : "No"}
        />
        <Row
          label="Providers"
          value={
            user.providers?.length
              ? user.providers.join(", ")
              : "—"
          }
        />
        <Row
          label="Created"
          value={formatDate(user.createdAt)}
        />
        <Row
          label="Updated"
          value={formatDate(user.updatedAt)}
        />
      </dl>

      {details.length > 0 ? (
        <div className="border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Provider details
          </h2>
          <ul className="space-y-2">
            {details.map((d) => (
              <li
                key={`${d.provider}-${d.connectedAt}`}
                className="rounded-lg bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-900/60"
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {d.provider}
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {" "}
                  · connected {formatDate(d.connectedAt)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
