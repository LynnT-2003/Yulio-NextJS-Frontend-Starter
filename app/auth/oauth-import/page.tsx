"use client";

import { useOAuthImportVm } from "@/modules/auth/viewModel/oauth-import/oauthImportVm";
import { OAuthImportView } from "@/modules/auth/view/oauth-import/OAuthImportView";

export default function OAuthImportPage() {
  const vm = useOAuthImportVm();
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-12 sm:px-6">
      <OAuthImportView vm={vm} />
    </div>
  );
}
