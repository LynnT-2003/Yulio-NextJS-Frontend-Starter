"use client";

import * as React from "react";
import { getUserPlan } from "@/lib/domain/payment/paymentApi";
import type { PaymentPlanId } from "@/lib/types/api";

export type ProDemoPageVm = {
  plan: PaymentPlanId | null;
  loading: boolean;
};

export function useProDemoPageVm(): ProDemoPageVm {
  const [plan, setPlan] = React.useState<PaymentPlanId | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    getUserPlan()
      .then((p) => { if (!cancelled) setPlan(p.plan); })
      .catch(() => { if (!cancelled) setPlan("free"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { plan, loading };
}
