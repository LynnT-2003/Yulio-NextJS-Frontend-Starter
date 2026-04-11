"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLoginPageVm } from "@/modules/auth/viewModel/login/loginPageVm";
import { LoginPageView } from "@/modules/auth/view/login/LoginPageView";

function LoginPageInner() {
  const vm = useLoginPageVm();
  const searchParams = useSearchParams();
  const showSuspendedNotice = searchParams.get("suspended") === "1";

  return (
    <LoginPageView vm={vm} showSuspendedNotice={showSuspendedNotice} />
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
          Loading…
        </div>
      }
    >
      <LoginPageInner />
    </Suspense>
  );
}
