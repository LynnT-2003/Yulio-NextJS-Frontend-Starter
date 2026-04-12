"use client";

import type { ReactNode } from "react";
import { useRequireAdminVm } from "@/modules/auth/viewModel/protected/requireAdminVm";
import { RequireAdminView } from "@/modules/auth/view/protected/RequireAdminView";

export function AdminLayoutClient({
  children,
}: Readonly<{ children: ReactNode }>) {
  const vm = useRequireAdminVm();
  return <RequireAdminView vm={vm}>{children}</RequireAdminView>;
}
