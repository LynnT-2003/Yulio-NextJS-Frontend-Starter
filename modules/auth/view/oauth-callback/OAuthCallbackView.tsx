"use client";

import Link from "next/link";
import type { OAuthCallbackVm } from "@/modules/auth/viewModel/oauth-callback/oauthCallbackVm";

export function OAuthCallbackView({ vm }: { vm: OAuthCallbackVm }) {
  if (vm.error) {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-4 p-8 text-center">
        <p className="text-sm text-red-800 dark:text-red-200">{vm.error}</p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <Link
            href="/login"
            className="font-medium text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100"
          >
            Back to login
          </Link>
          <Link
            href="/auth/oauth-import"
            className="font-medium text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100"
          >
            Paste JSON instead
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
      Completing sign-in…
    </div>
  );
}
