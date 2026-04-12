"use client";

import type { ReactNode } from "react";
import type { RequireAdminVm } from "@/modules/auth/viewModel/protected/requireAdminVm";

export function RequireAdminView({
  vm,
  children,
}: {
  vm: RequireAdminVm;
  children: ReactNode;
}) {
  if (!vm.ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
        Restoring session…
      </div>
    );
  }

  if (!vm.allowed) {
    return null;
  }

  return <>{children}</>;
}
