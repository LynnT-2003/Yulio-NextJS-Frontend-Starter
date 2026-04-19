"use client";

import { usePricingPageVm } from "@/modules/pricing/viewModel/pricingPageVm";
import { PricingPageView } from "@/modules/pricing/view/PricingPageView";

export default function PricingPage() {
  const vm = usePricingPageVm();
  return <PricingPageView vm={vm} />;
}
