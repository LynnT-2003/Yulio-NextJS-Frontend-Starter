import { getRequest, postRequest } from "@/lib/domain/api/NetworkManager";
import { apiPath } from "@/lib/config/api-path";
import type {
  UserPlan,
  CheckoutSession,
  BillingPortalSession,
} from "@/lib/types/api";

export const PRICE_IDS = {
  pro: "price_1TIndpEfoimMU6KcjxoXbkHw",
  lifetime: "price_1TIneDEfoimMU6KcvftufKGL",
} as const;

export const getUserPlan = () =>
  getRequest<UserPlan>(apiPath("payment/plan"));

export const createCheckoutSession = (body: {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) =>
  postRequest<CheckoutSession, typeof body>(apiPath("payment/checkout"), body);

export const createBillingPortalSession = (returnUrl: string) =>
  postRequest<BillingPortalSession, { returnUrl: string }>(
    apiPath("payment/billing-portal"),
    { returnUrl }
  );
