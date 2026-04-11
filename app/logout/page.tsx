"use client";

import * as React from "react";
import { useAuth } from "../../providers/auth-provider";

export default function LogoutPage() {
  const { logout } = useAuth();

  React.useEffect(() => {
    void logout();
  }, [logout]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 px-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">Signing out…</p>
    </div>
  );
}
