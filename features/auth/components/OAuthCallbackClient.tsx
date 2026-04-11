"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tokenStore } from "../../../lib/domain/api/tokenStore";
import { getCurrentUser } from "../../../lib/domain/user/user-api";
import { useAuth } from "../../../providers/auth-provider";
import { routes } from "../../../lib/config/routes";

/**
 * Handles return from Nest OAuth when `FRONTEND_OAUTH_CALLBACK_URL` points here:
 * tokens arrive in the URL **hash** only (not sent to the Next server).
 */
export function OAuthCallbackClient() {
  const router = useRouter();
  const { applyAuthResponse } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const hash =
      typeof window !== "undefined"
        ? window.location.hash.replace(/^#/, "")
        : "";
    if (!hash) {
      setError(
        "No OAuth data in the URL hash. Set FRONTEND_OAUTH_CALLBACK_URL on the API to this page’s URL, or use OAuth import."
      );
      return;
    }

    const params = new URLSearchParams(hash);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const userId = params.get("userId");
    if (!accessToken || !refreshToken || !userId) {
      setError(
        "Invalid callback: expected accessToken, refreshToken, and userId in the hash."
      );
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        tokenStore.setSession(accessToken, refreshToken, userId);
        const user = await getCurrentUser();
        if (cancelled) return;
        applyAuthResponse({ user, tokens: { accessToken, refreshToken } });
        window.history.replaceState(null, "", routes.oauthCallback);
        router.replace(routes.account);
      } catch (e: unknown) {
        if (cancelled) return;
        tokenStore.clear();
        const msg =
          e && typeof e === "object" && "message" in e
            ? String((e as { message: unknown }).message)
            : "Could not complete sign-in";
        setError(msg);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [applyAuthResponse, router]);

  if (error) {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-4 p-8 text-center">
        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <Link
            href={routes.login}
            className="font-medium text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-100"
          >
            Back to login
          </Link>
          <Link
            href={routes.oauthImport}
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
