"use client";

import * as React from "react";
import type { User } from "@/lib/types/api";
import { ApiError } from "@/lib/domain/api/ApiError";
import { useAuth } from "@/providers/auth-provider";

export type AccountPageVm = {
  user: User | null;
  syncError: string | null;
};

export function useAccountPageVm(): AccountPageVm {
  const { user, refreshUser } = useAuth();
  const [syncError, setSyncError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // If the user leaves this page before refreshUser() finishes, avoid calling
    // setSyncError on an unmounted component (and ignore stale failures).
    let cancelled = false;
    setSyncError(null);
    refreshUser().catch((e: unknown) => {
      if (cancelled) return;
      if (e instanceof ApiError && e.isAccountSuspended) return;
      setSyncError(
        e instanceof Error ? e.message : "Could not sync profile from API"
      );
    });
    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  return { user, syncError };
}
