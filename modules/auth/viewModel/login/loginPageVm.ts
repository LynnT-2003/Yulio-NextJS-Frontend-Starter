"use client";

import * as React from "react";
import {
  oauthProviders,
  oauthStartUrls,
} from "@/lib/domain/auth/auth-api";
import { useAuth } from "@/providers/auth-provider";

export type LoginPageVm = {
  email: string;
  password: string;
  error: string | null;
  pending: boolean;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  oauthItems: { id: string; label: string; description: string; href: string }[];
};

export function useLoginPageVm(): LoginPageVm {
  const { login } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  const oauthItems = React.useMemo(
    () =>
      oauthProviders.map(({ id, label, description }) => ({
        id,
        label,
        description,
        href: oauthStartUrls[id](),
      })),
    []
  );

  const onSubmit = React.useCallback(
    async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setPending(true);
      try {
        await login(email.trim(), password);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Sign in failed");
      } finally {
        setPending(false);
      }
    },
    [email, password, login]
  );

  return {
    email,
    password,
    error,
    pending,
    setEmail,
    setPassword,
    onSubmit,
    oauthItems,
  };
}
