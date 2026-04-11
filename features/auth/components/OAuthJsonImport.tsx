"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../providers/auth-provider";
import { parseAuthResponseFromPastedJson } from "../lib/parse-oauth-json";
import { routes } from "../../../lib/config/routes";

export function OAuthJsonImport() {
  const { applyAuthResponse } = useAuth();
  const router = useRouter();
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function onApply(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const auth = parseAuthResponseFromPastedJson(text);
      applyAuthResponse(auth);
      router.push(routes.account);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  }

  return (
    <form
      onSubmit={onApply}
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

      {error ? (
        <p
          className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          Response JSON
        </span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          placeholder='{ "success": true, "data": { "user": { ... }, "tokens": { ... } } }'
          className="font-mono text-xs rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
      </label>

      <button
        type="submit"
        className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
      >
        Apply session &amp; go to account
      </button>
    </form>
  );
}
