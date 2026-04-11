"use client";

import type { ReactNode } from "react";
import type { RequireAuthVm } from "@/modules/auth/viewModel/protected/requireAuthVm";

export function RequireAuthView({
  vm,
  children,
}: {
  vm: RequireAuthVm;
  children: ReactNode;
}) {
  if (!vm.ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
        Restoring session…
      </div>
    );
  }

  if (!vm.hasUser) {
    return null;
  }

  return <>{children}</>;
}
