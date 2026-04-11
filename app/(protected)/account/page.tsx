"use client";

import { useAccountPageVm } from "@/modules/account/viewModel/accountPageVm";
import { AccountPageView } from "@/modules/account/view/AccountPageView";

export default function AccountPage() {
  const vm = useAccountPageVm();
  return <AccountPageView vm={vm} />;
}
