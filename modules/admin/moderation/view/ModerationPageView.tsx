"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/config/routes";
import type { ModerationPageVm } from "@/modules/admin/moderation/viewModel/moderationPageVm";
import type { ModerationUser } from "@/lib/types/api";

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function truncate(s: string | null, max: number): string {
  if (!s) return "—";
  return s.length <= max ? s : `${s.slice(0, max)}…`;
}

export function ModerationPageView({ vm }: { vm: ModerationPageVm }) {
  const from = vm.total === 0 ? 0 : (vm.page - 1) * vm.limit + 1;
  const to = Math.min(vm.page * vm.limit, vm.total);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Account moderation
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
            List and suspend accounts via{" "}
            <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-800">
              /api/admin/moderation
            </code>
            . Suspending revokes all refresh tokens; access tokens expire on their own TTL.
          </p>
        </div>
        <Link
          href={routes.account}
          className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Back to account
        </Link>
      </div>

      <form
        className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:flex-row sm:flex-wrap sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          vm.applyFilters();
        }}
      >
        <label className="flex min-w-[200px] flex-1 flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Search
          </span>
          <input
            type="search"
            value={vm.searchDraft}
            onChange={(e) => vm.setSearchDraft(e.target.value)}
            placeholder="Email or display name"
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400/30 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </label>
        <label className="flex w-full flex-col gap-1 text-sm sm:w-48">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Status
          </span>
          <select
            value={vm.suspendedFilter}
            onChange={(e) =>
              vm.setSuspendedFilter(e.target.value as typeof vm.suspendedFilter)
            }
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400/30 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="all">All users</option>
            <option value="active">Active (not suspended)</option>
            <option value="suspended">Suspended</option>
          </select>
        </label>
        <div className="flex gap-2">
          <Button type="submit" variant="default" size="sm">
            Apply
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void vm.refresh()}
            disabled={vm.loading}
          >
            Refresh
          </Button>
        </div>
      </form>

      {vm.listError ? (
        <p
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {vm.listError}
        </p>
      ) : null}

      {vm.actionError ? (
        <p
          className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100"
          role="status"
        >
          {vm.actionError}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        {vm.loading ? (
          <div className="flex min-h-[200px] items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
            Loading users…
          </div>
        ) : vm.items.length === 0 ? (
          <div className="flex min-h-[160px] items-center justify-center px-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No users match these filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                    User
                  </th>
                  <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                    Role
                  </th>
                  <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                    State
                  </th>
                  <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                    Suspended at
                  </th>
                  <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                    Reason
                  </th>
                  <th className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {vm.items.map((row) => (
                  <ModerationRow
                    key={row._id}
                    row={row}
                    vm={vm}
                    currentUserId={vm.currentUserId}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!vm.loading && vm.total > 0 ? (
        <div className="flex flex-col items-center justify-between gap-3 text-sm text-zinc-600 dark:text-zinc-400 sm:flex-row">
          <span>
            Showing {from}–{to} of {vm.total}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={vm.page <= 1}
              onClick={() => vm.goPage(vm.page - 1)}
            >
              Previous
            </Button>
            <span className="tabular-nums">
              Page {vm.page} / {vm.totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={vm.page >= vm.totalPages}
              onClick={() => vm.goPage(vm.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      {vm.suspendTarget ? (
        <SuspendModal vm={vm} target={vm.suspendTarget} />
      ) : null}
    </div>
  );
}

function ModerationRow({
  row,
  vm,
  currentUserId,
}: {
  row: ModerationUser;
  vm: ModerationPageVm;
  currentUserId: string | undefined;
}) {
  const busy = vm.actionUserId === row._id;
  const isSelf = currentUserId === row._id;
  const isAdmin = row.role === "admin";
  const canSuspend = !isSelf && !isAdmin;

  return (
    <tr className="hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40">
      <td className="px-4 py-3">
        <div className="font-medium text-zinc-900 dark:text-zinc-50">
          {row.displayName}
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {row.email ?? "—"}
        </div>
      </td>
      <td className="px-4 py-3 capitalize text-zinc-700 dark:text-zinc-300">
        {row.role}
      </td>
      <td className="px-4 py-3">
        {row.isSuspended ? (
          <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900 dark:bg-amber-950/60 dark:text-amber-100">
            Suspended
          </span>
        ) : (
          <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-100">
            Active
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
        {fmtDate(row.suspendedAt)}
      </td>
      <td
        className="max-w-[200px] truncate px-4 py-3 text-zinc-600 dark:text-zinc-400"
        title={row.suspensionReason ?? undefined}
      >
        {truncate(row.suspensionReason, 80)}
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {row.isSuspended ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={() => void vm.submitUnsuspend(row)}
            >
              {busy ? "…" : "Unsuspend"}
            </Button>
          ) : (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={busy || !canSuspend}
              title={
                isSelf
                  ? "You cannot suspend your own account"
                  : isAdmin
                    ? "Administrators cannot be suspended via the API"
                    : undefined
              }
              onClick={() => vm.openSuspend(row)}
            >
              Suspend
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

function SuspendModal({
  vm,
  target,
}: {
  vm: ModerationPageVm;
  target: ModerationUser;
}) {
  const busy = vm.actionUserId === target._id;

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) vm.closeSuspend();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [vm, busy]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) vm.closeSuspend();
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
        role="dialog"
        aria-labelledby="suspend-title"
        aria-modal="true"
      >
        <h2
          id="suspend-title"
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
        >
          Suspend account
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            {target.displayName}
          </span>
          {target.email ? (
            <>
              {" "}
              <span className="text-zinc-500">({target.email})</span>
            </>
          ) : null}{" "}
          will be signed out on all devices. Optional note is stored for your team only.
        </p>
        <label className="mt-4 flex flex-col gap-1 text-sm">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Reason (optional)
          </span>
          <textarea
            value={vm.suspendReason}
            onChange={(e) => vm.setSuspendReason(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="Policy reference, ticket ID, …"
            className="resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400/30 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </label>
        <div className="mt-6 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => vm.closeSuspend()}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={busy}
            onClick={() => void vm.submitSuspend()}
          >
            {busy ? "Suspending…" : "Confirm suspend"}
          </Button>
        </div>
      </div>
    </div>
  );
}
