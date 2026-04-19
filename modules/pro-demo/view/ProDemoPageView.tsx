"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/config/routes";
import type { ProDemoPageVm } from "@/modules/pro-demo/viewModel/proDemoPageVm";

function GatedContent() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="select-none blur-sm pointer-events-none" aria-hidden>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Pro Feature Preview</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-3">This is the exclusive content available to Pro and Lifetime subscribers.</p>
        <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          <li>Advanced analytics dashboard</li>
          <li>Priority processing queue</li>
          <li>Dedicated support channel</li>
          <li>Early access to new features</li>
        </ul>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-zinc-950/60 backdrop-blur-[1px]">
        <p className="mb-4 text-center text-sm font-medium text-zinc-900 dark:text-zinc-50">
          Upgrade to Pro to unlock this content
        </p>
        <Button asChild>
          <Link href={routes.pricing}>View plans →</Link>
        </Button>
      </div>
    </div>
  );
}

function ProContent() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Pro Feature Preview</h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-3">Welcome! You have full access to all Pro features.</p>
      <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
        <li className="flex items-center gap-2">
          <svg className="h-4 w-4 text-green-500 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
          </svg>
          Advanced analytics dashboard
        </li>
        <li className="flex items-center gap-2">
          <svg className="h-4 w-4 text-green-500 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
          </svg>
          Priority processing queue
        </li>
        <li className="flex items-center gap-2">
          <svg className="h-4 w-4 text-green-500 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
          </svg>
          Dedicated support channel
        </li>
        <li className="flex items-center gap-2">
          <svg className="h-4 w-4 text-green-500 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0z" />
          </svg>
          Early access to new features
        </li>
      </ul>
    </div>
  );
}

export function ProDemoPageView({
  vm,
  embedded = false,
}: {
  vm: ProDemoPageVm;
  embedded?: boolean;
}) {
  const Title = embedded ? "h2" : "h1";
  const shellClass = embedded
    ? "flex w-full flex-col gap-6"
    : "mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6";

  return (
    <div className={shellClass}>
      {/* <div>
        <Title className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Pro Demo
        </Title>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          A gated page demonstrating plan-based access control.
        </p>
      </div> */}

      {vm.loading ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center text-sm text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">
          Loading…
        </div>
      ) : vm.plan === "free" || vm.plan === null ? (
        <GatedContent />
      ) : (
        <ProContent />
      )}
    </div>
  );
}
