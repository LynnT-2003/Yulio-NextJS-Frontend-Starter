"use client";

import type { ReactNode } from "react";
import { useRequireAuthVm } from "@/modules/auth/viewModel/protected/requireAuthVm";
import { RequireAuthView } from "@/modules/auth/view/protected/RequireAuthView";

export function ProtectedLayoutClient({
  children,
}: Readonly<{ children: ReactNode }>) {
  const vm = useRequireAuthVm();
  return <RequireAuthView vm={vm}>{children}</RequireAuthView>;
}
