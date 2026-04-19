"use client";

import { Button } from "@/components/ui/button";
import type { PricingPageVm } from "@/modules/pricing/viewModel/pricingPageVm";
import type { PaymentPlanId } from "@/lib/types/api";
import { InfoIcon } from "lucide-react";

type PlanCardProps = {
  title: string;
  price: string;
  description: string;
  features: string[];
  isActive: boolean;
  action: React.ReactNode;
};

function PlanCard({ title, price, description, features, isActive, action }: PlanCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 shadow-sm transition-all ${isActive
        ? "border-zinc-900 bg-zinc-50 dark:border-zinc-100 dark:bg-zinc-900/60"
        : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
        }`}
    >
      {isActive && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900 px-3 py-0.5 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
          Current plan
        </span>
      )}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
        <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-50">{price}</p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
      <ul className="mb-6 flex-1 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
            <svg className="h-4 w-4 shrink-0 text-zinc-400" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
              <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      {action}
    </div>
  );
}

function planAction(
  currentPlan: PaymentPlanId | undefined,
  targetPlan: "free" | "pro" | "lifetime",
  vm: PricingPageVm
): React.ReactNode {
  const disabled = vm.redirecting || vm.loading;

  if (currentPlan === targetPlan) {
    return (
      <Button variant="outline" disabled className="w-full">
        Active
      </Button>
    );
  }

  if (targetPlan === "free") {
    return (
      <Button variant="outline" disabled className="w-full">
        Free forever
      </Button>
    );
  }

  if (targetPlan === "pro") {
    if (currentPlan === "lifetime") {
      return (
        <Button variant="outline" disabled className="w-full">
          Not available
        </Button>
      );
    }
    if (currentPlan === "pro") {
      return (
        <Button variant="outline" onClick={vm.handleManageBilling} disabled={disabled} className="w-full">
          {vm.redirecting ? "Redirecting…" : "Manage billing"}
        </Button>
      );
    }
    return (
      <Button onClick={vm.handleCheckoutPro} disabled={disabled} className="w-full">
        {vm.redirecting ? "Redirecting…" : "Subscribe"}
      </Button>
    );
  }

  if (targetPlan === "lifetime") {
    if (currentPlan === "pro") {
      return (
        <Button onClick={vm.handleManageBilling} disabled={disabled} className="w-full">
          {vm.redirecting ? "Redirecting…" : "Manage billing"}
        </Button>
      );
    }
    return (
      <Button onClick={vm.handleCheckoutLifetime} disabled={disabled} className="w-full">
        {vm.redirecting ? "Redirecting…" : "Buy once"}
      </Button>
    );
  }

  return null;
}

function TestCardGuide() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        <InfoIcon className="w-4 h-4 inline-block mr-1" /> Billing is in Stripe test mode.
      </p>
      <p className="mb-2 text-xs font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
        Use either of these card numbers to test the payment flow:
      </p>
      <div className="grid gap-1 sm:grid-cols-3 mt-4">
        {[
          { card: "4242 4242 4242 4242", result: "For Payment Success" },
          { card: "4000 0000 0000 0002", result: "For Payment Declined" },
          { card: "4000 0025 0000 3155", result: "For 3D Secure Required" },
        ].map(({ card, result }) => (
          <div key={card} className="flex flex-col gap-0.5">
            <code className="text-xs font-mono font-semibold bg-zinc-900 px-2 py-2 rounded-md text-zinc-900 dark:text-zinc-100 w-fit">
              {card}
            </code>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 pl-1.5 pt-1">{result}</span>
          </div>
        ))}
      </div>
      <p className="border-t border-zinc-200 mt-4 pt-2 text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
        Use any future expiry date &amp; any 3-digit CVC
      </p>
    </div>
  );
}

export function PricingPageView({ vm }: { vm: PricingPageVm }) {
  const currentPlan = vm.plan?.plan;
  const hasBilling = currentPlan === "pro" || currentPlan === "lifetime";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-10 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Pricing
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Choose the plan that works for you.
          </p>
        </div>

        {hasBilling && (
          <Button
            variant="outline"
            size="sm"
            onClick={vm.handleManageBilling}
            disabled={vm.redirecting}
            className="shrink-0"
          >
            {vm.redirecting ? "Redirecting…" : "Manage billing →"}
          </Button>
        )}
      </div>

      {vm.error && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
          {vm.error}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-3">
        <PlanCard
          title="Free"
          price="$0"
          description="Forever free"
          features={["Basic access", "Community support"]}
          isActive={currentPlan === "free" || !currentPlan}
          action={planAction(currentPlan, "free", vm)}
        />
        <PlanCard
          title="Pro"
          price="$19/mo"
          description="Monthly subscription"
          features={["Everything in Free", "Priority support", "Pro features"]}
          isActive={currentPlan === "pro"}
          action={planAction(currentPlan, "pro", vm)}
        />
        <PlanCard
          title="Lifetime"
          price="$299"
          description="One-time payment"
          features={["Everything in Pro", "Lifetime updates", "No recurring fees"]}
          isActive={currentPlan === "lifetime"}
          action={planAction(currentPlan, "lifetime", vm)}
        />
      </div>

      <TestCardGuide />

      {vm.loading && (
        <p className="text-center text-sm text-zinc-400">Loading your plan…</p>
      )}
    </div>
  );
}
