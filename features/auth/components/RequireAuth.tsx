"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../providers/auth-provider";
import { routes } from "../../../lib/config/routes";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (ready && !user) {
      router.replace(routes.login);
    }
  }, [ready, user, router]);

  if (!ready) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
        Restoring session…
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
