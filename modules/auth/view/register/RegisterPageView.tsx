"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/config/routes";
import type { RegisterPageVm } from "@/modules/auth/viewModel/register/registerPageVm";

function PasswordHint({ vm }: { vm: RegisterPageVm }) {
  const { passwordFeedback } = vm;
  if (passwordFeedback.kind === "hidden") return null;
  if (passwordFeedback.kind === "invalid") {
    return (
      <span className="text-xs text-red-600 dark:text-red-400 pt-2" role="status">
        {passwordFeedback.issues[0]}
      </span>
    );
  }
  return (
    <span className="text-xs text-emerald-600 dark:text-emerald-400" role="status">
      {/* Password meets requirements */}
    </span>
  );
}

function ConfirmHint({ vm }: { vm: RegisterPageVm }) {
  const { confirmFeedback } = vm;
  if (confirmFeedback.kind === "hidden") return null;
  if (confirmFeedback.kind === "mismatch") {
    return (
      <span className="text-xs text-red-600 dark:text-red-400 pt-2" role="status">
        Passwords do not match.
      </span>
    );
  }
  return (
    <span className="text-xs text-emerald-600 dark:text-emerald-400 pt-2" role="status">
      Passwords match
    </span>
  );
}

export function RegisterPageView({ vm }: { vm: RegisterPageVm }) {
  const confirmInvalid = vm.confirmFeedback.kind === "mismatch";

  return (
    <form
      noValidate
      onSubmit={vm.onSubmit}
      className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Create account
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Registers via <code className="text-xs">POST /api/auth/register</code>.
        </p>
      </div>

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
          Display name
        </span>
        <input
          name="displayName"
          type="text"
          autoComplete="name"
          required
          maxLength={64}
          value={vm.displayName}
          onChange={(e) => vm.setDisplayName(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </label>

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
          autoComplete="off"
          spellCheck={false}
          maxLength={64}
          value={vm.password}
          onChange={(e) => vm.setPassword(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <PasswordHint vm={vm} />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          Confirm password
        </span>
        <input
          name="confirmPassword"
          type="password"
          autoComplete="off"
          spellCheck={false}
          maxLength={64}
          value={vm.confirmPassword}
          onChange={(e) => vm.setConfirmPassword(e.target.value)}
          aria-invalid={confirmInvalid}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        <ConfirmHint vm={vm} />
      </label>

      <Button
        type="submit"
        disabled={vm.pending || !vm.canSubmit}
        className="mt-2 h-auto min-h-10 w-full py-2.5"
      >
        {vm.pending ? "Creating…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link
          href={routes.login}
          className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
