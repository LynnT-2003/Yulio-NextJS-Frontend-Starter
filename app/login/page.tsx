import Link from "next/link";
import { LoginForm } from "../../features/auth/components/LoginForm";
import { OAuthProviderGrid } from "../../features/auth/components/OAuthProviderGrid";
import { routes } from "../../lib/config/routes";

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-4 py-12 sm:px-6">
      <LoginForm />
      <OAuthProviderGrid />
      <p className="max-w-md text-center text-xs text-zinc-500 dark:text-zinc-400">
        Add your Next origin to <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-900">ALLOWED_ORIGINS</code>{" "}
        on the API. See{" "}
        <Link href={routes.oauthImport} className="underline-offset-2 hover:underline">
          OAuth import
        </Link>{" "}
        for provider flows that return JSON on the API host.
      </p>
    </div>
  );
}
