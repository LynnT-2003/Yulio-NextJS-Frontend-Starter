"use client";

import * as React from "react";
import { useAuth } from "@/providers/auth-provider";

export type RegisterPageVm = {
  displayName: string;
  email: string;
  password: string;
  error: string | null;
  pending: boolean;
  setDisplayName: (v: string) => void;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
};

export function useRegisterPageVm(): RegisterPageVm {
  const { register } = useAuth();
  const [displayName, setDisplayName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  const onSubmit = React.useCallback(
    async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setPending(true);
      try {
        await register({
          email: email.trim(),
          password,
          displayName: displayName.trim(),
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Registration failed");
      } finally {
        setPending(false);
      }
    },
    [displayName, email, password, register]
  );

  return {
    displayName,
    email,
    password,
    error,
    pending,
    setDisplayName,
    setEmail,
    setPassword,
    onSubmit,
  };
}
