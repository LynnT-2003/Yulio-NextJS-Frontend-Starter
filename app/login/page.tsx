"use client";

import { useLoginPageVm } from "@/modules/auth/viewModel/login/loginPageVm";
import { LoginPageView } from "@/modules/auth/view/login/LoginPageView";

export default function LoginPage() {
  const vm = useLoginPageVm();
  return <LoginPageView vm={vm} />;
}
