"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/config/routes";
import { useAuth } from "@/providers/auth-provider";

export type RequireAdminVm = {
  ready: boolean;
  allowed: boolean;
};

export function useRequireAdminVm(): RequireAdminVm {
  const { user, ready } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (ready && user && user.role !== "admin") {
      router.replace(routes.account);
    }
  }, [ready, user, router]);

  const allowed = !!(ready && user && user.role === "admin");
  return { ready, allowed };
}
