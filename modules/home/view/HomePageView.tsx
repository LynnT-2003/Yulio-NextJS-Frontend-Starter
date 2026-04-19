"use client";

import {
  ArrowUpRight,
  Globe,
  LayoutTemplate,
  Server,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { HomePageVm } from "@/modules/home/viewModel/homePageVm";
import { ProDemoPageView } from "@/modules/pro-demo/view/ProDemoPageView";
import { useProDemoPageVm } from "@/modules/pro-demo/viewModel/proDemoPageVm";

const LINKS = {
  yulio: "https://yuliolabs.com",
  product: "https://yuliolabs.com",
  frontend:
    "https://github.com/LynnT-2003/Yulio-NextJS-Frontend-Starter",
  backend:
    "https://github.com/LynnT-2003/Yulio-NestJS-Backend-Starter",
} as const;

function GithubMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 98 96"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={className}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
      />
    </svg>
  );
}

function ResourceCard({
  href,
  icon: Icon,
  eyebrow,
  title,
  subtitle,
  github = false,
}: {
  href: string;
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  subtitle: string;
  github?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col gap-4 rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:border-emerald-500/35 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-emerald-500/30"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/15 dark:bg-emerald-500/15 dark:text-emerald-400 dark:ring-emerald-500/20">
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="flex shrink-0 items-center gap-2">
          {github ? (
            <GithubMark className="size-3.5 text-zinc-400/70 transition-colors duration-200 group-hover:text-zinc-500 dark:text-zinc-500/80 dark:group-hover:text-zinc-400" />
          ) : null}
          <ArrowUpRight
            className="size-4 shrink-0 text-zinc-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-600 dark:text-zinc-500 dark:group-hover:text-emerald-400"
            aria-hidden
          />
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
          {eyebrow}
        </p>
        <p className="mt-1.5 font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </p>
        <p className="mt-1 text-sm leading-snug text-zinc-600 dark:text-zinc-400">
          {subtitle}
        </p>
      </div>
    </a>
  );
}

export function HomePageView({ vm }: { vm: HomePageVm }) {
  const { user, ready } = vm;
  const proDemoVm = useProDemoPageVm();

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-10 px-4 py-20 sm:px-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
        Yulio Kit · frontend foundations
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
        Next.js Frontend Starter Kit
      </h1>

      <div className="flex flex-wrap gap-3">
        {!ready ? null : user ? (
          <Link
            href="/account"
            className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            View your profile
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-all duration-200 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-900/50"
            >
              Register
            </Link>
          </>
        )}
        {/* <Link
          href="/pricing"
          className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-all duration-200 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-900/50"
        >
          View plans
        </Link> */}
        <Link
          href="/auth/oauth-import"
          className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-all duration-200 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-900/50"
        >
          OAuth JSON import
        </Link>
      </div>

      <ProDemoPageView vm={proDemoVm} embedded />

      <div className="flex flex-col gap-4">

        <h1 className="text-xl font-semibold tracking-tight text-zinc-400 sm:text-2xl">
          Powered by our same Backend Architecture
        </h1>

        <div className="grid gap-4 sm:grid-cols-3">
          <ResourceCard
            href={LINKS.product}
            icon={Globe}
            eyebrow="Product"
            title="Yulio Kit"
            subtitle="Launch your product in minutes with Yulio Kit."
          />
          <ResourceCard
            href={LINKS.frontend}
            icon={LayoutTemplate}
            eyebrow="Code"
            title="NextJS Client"
            subtitle="Starter access for the Frontend Architecture."
            github
          />
          <ResourceCard
            href={LINKS.backend}
            icon={Server}
            eyebrow="Code"
            title="NestJS Server"
            subtitle="Starter access for the Backend Architecture."
            github
          />
        </div>
      </div>



      <p className="text-sm text-zinc-600 dark:text-zinc-400 tracking-wide">
        Built by{" "}<a
          href={LINKS.yulio}
          className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-emerald-700 hover:decoration-emerald-500/50 dark:text-zinc-100 dark:decoration-zinc-600 dark:hover:text-emerald-400 dark:hover:decoration-emerald-500/40"
          target="_blank"
          rel="noopener noreferrer"
        >
          Yulio Labs
        </a>{" "}
        • Focused on shipping scalable systems and developer tooling for your next project.
      </p>
    </section >
  );
}
