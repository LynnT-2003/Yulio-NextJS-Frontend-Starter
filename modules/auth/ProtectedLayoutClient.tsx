"use client";

import type { ReactNode } from "react";
import { useRequireAuthVm } from "@/modules/auth/viewModel/protected/requireAuthVm";
import { RequireAuthView } from "@/modules/auth/view/protected/RequireAuthView";
import { AccountSuspendedBanner } from "@/modules/layout/AccountSuspendedBanner";
import { useAuth } from "@/providers/auth-provider";

export function ProtectedLayoutClient({
  children,
}: Readonly<{ children: ReactNode }>) {
  const vm = useRequireAuthVm();
  const { user } = useAuth();
  return (
    <RequireAuthView vm={vm}>
      {user ? <AccountSuspendedBanner user={user} /> : null}
      {children}
    </RequireAuthView>
  );
}
