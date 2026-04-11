"use client";

import { Button } from "@/components/ui/button";
import type { OAuthImportVm } from "@/modules/auth/viewModel/oauth-import/oauthImportVm";

export function OAuthImportView({ vm }: { vm: OAuthImportVm }) {
  return (
    <form
      onSubmit={vm.onApply}
      className="flex w-full max-w-2xl flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Import OAuth session
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          After you complete Google, LINE, GitHub, Discord, or Microsoft login, the
          API callback page shows JSON (Nest success envelope with{" "}
          <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-900">data.user</code>{" "}
          and{" "}
          <code className="rounded bg-zinc-100 px-1 text-xs dark:bg-zinc-900">
            data.tokens
          </code>
          ). Copy the full response and paste it here to continue in this Next.js app
          without a BFF.
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
          Response JSON
        </span>
        <textarea
          value={vm.text}
          onChange={(e) => vm.setText(e.target.value)}
          rows={12}
          placeholder='{ "success": true, "data": { "user": { ... }, "tokens": { ... } } }'
          className="font-mono text-xs rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </label>

      <Button
        type="submit"
        className="h-auto min-h-10 w-full bg-emerald-700 py-2.5 text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
      >
        Apply session &amp; go to account
      </Button>
    </form>
  );
}
