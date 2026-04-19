"use client";

import * as React from "react";
import { routes } from "@/lib/config/routes";
import {
  getUserPlan,
  createCheckoutSession,
  createBillingPortalSession,
  PRICE_IDS,
} from "@/lib/domain/payment/paymentApi";
import type { UserPlan } from "@/lib/types/api";

export type PricingPageVm = {
  plan: UserPlan | null;
  loading: boolean;
  redirecting: boolean;
  error: string | null;
  handleCheckoutPro: () => void;
  handleCheckoutLifetime: () => void;
  handleManageBilling: () => void;
};

export function usePricingPageVm(): PricingPageVm {
  const [plan, setPlan] = React.useState<UserPlan | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [redirecting, setRedirecting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    getUserPlan()
      .then((p) => { if (!cancelled) setPlan(p); })
      .catch(() => { /* plan stays null — buttons degrade gracefully */ })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  React.useEffect(() => {
    setRedirecting(false);
  }, []);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "cancelled") {
      setRedirecting(false);
    }
  }, []);

  const handleCheckout = React.useCallback(async (priceId: string) => {
    setError(null);
    setRedirecting(true);
    try {
      const origin = window.location.origin;
      const { url } = await createCheckoutSession({
        priceId,
        successUrl: `${origin}${routes.account}?payment=success`,
        cancelUrl: `${origin}${routes.pricing}?checkout=cancelled`,
      });
      window.location.href = url;
    } catch (e: unknown) {
      setRedirecting(false);
      setError(e instanceof Error ? e.message : "Could not start checkout");
    }
  }, []);

  const handleCheckoutPro = React.useCallback(
    () => handleCheckout(PRICE_IDS.pro),
    [handleCheckout]
  );

  const handleCheckoutLifetime = React.useCallback(
    () => handleCheckout(PRICE_IDS.lifetime),
    [handleCheckout]
  );

  const handleManageBilling = React.useCallback(async () => {
    setError(null);
    setRedirecting(true);
    try {
      const origin = window.location.origin;
      const { url } = await createBillingPortalSession(`${origin}${routes.account}`);
      window.location.href = url;
    } catch (e: unknown) {
      setRedirecting(false);
      setError(e instanceof Error ? e.message : "Could not open billing portal");
    }
  }, []);

  return {
    plan,
    loading,
    redirecting,
    error,
    handleCheckoutPro,
    handleCheckoutLifetime,
    handleManageBilling,
  };
}
