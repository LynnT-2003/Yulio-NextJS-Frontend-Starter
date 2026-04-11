"use client";

import { useOAuthCallbackVm } from "@/modules/auth/viewModel/oauth-callback/oauthCallbackVm";
import { OAuthCallbackView } from "@/modules/auth/view/oauth-callback/OAuthCallbackView";

export default function OAuthCallbackPage() {
  const vm = useOAuthCallbackVm();
  return (
    <div className="flex flex-1 flex-col">
      <OAuthCallbackView vm={vm} />
    </div>
  );
}
