"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { parseAuthResponseFromPastedJson } from "@/modules/auth/utils/parse-oauth-json";

export type OAuthImportVm = {
  text: string;
  error: string | null;
  setText: (v: string) => void;
  onApply: (e: React.SubmitEvent<HTMLFormElement>) => void;
};

export function useOAuthImportVm(): OAuthImportVm {
  const { applyAuthResponse } = useAuth();
  const router = useRouter();
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const onApply = React.useCallback(
    (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      try {
        const auth = parseAuthResponseFromPastedJson(text);
        applyAuthResponse(auth);
        router.push("/account");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Invalid JSON");
      }
    },
    [text, applyAuthResponse, router]
  );

  return { text, error, setText, onApply };
}
