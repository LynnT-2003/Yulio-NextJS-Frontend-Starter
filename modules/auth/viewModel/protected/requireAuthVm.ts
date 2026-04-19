"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";

export type RequireAuthVm = {
  ready: boolean;
  hasUser: boolean;
};

export function useRequireAuthVm(): RequireAuthVm {
  const { user, ready } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  return { ready, hasUser: !!user };
}
