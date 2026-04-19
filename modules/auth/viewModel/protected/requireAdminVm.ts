"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

export type RequireAdminVm = {
  ready: boolean;
  allowed: boolean;
};

export function useRequireAdminVm(): RequireAdminVm {
  const { user, ready } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!ready || !user) return;
    if (user.role !== "admin" || user.isSuspended) {
      router.replace("/account");
    }
  }, [ready, user, router]);

  const allowed = !!(
    ready &&
    user &&
    user.role === "admin" &&
    !user.isSuspended
  );
  return { ready, allowed };
}
