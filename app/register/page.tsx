"use client";

import { useRegisterPageVm } from "@/modules/auth/viewModel/register/registerPageVm";
import { RegisterPageView } from "@/modules/auth/view/register/RegisterPageView";

export default function RegisterPage() {
  const vm = useRegisterPageVm();
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-4 py-12 sm:px-6">
      <RegisterPageView vm={vm} />
    </div>
  );
}
