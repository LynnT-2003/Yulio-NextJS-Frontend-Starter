"use client";

import { useProDemoPageVm } from "@/modules/pro-demo/viewModel/proDemoPageVm";
import { ProDemoPageView } from "@/modules/pro-demo/view/ProDemoPageView";

export default function ProDemoPage() {
  const vm = useProDemoPageVm();
  return <ProDemoPageView vm={vm} />;
}
