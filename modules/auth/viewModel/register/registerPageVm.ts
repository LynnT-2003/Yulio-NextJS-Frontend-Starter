"use client";

import * as React from "react";
import { useAuth } from "@/providers/auth-provider";

const DEBOUNCE_MS = 400;

/** Length matches Nest `RegisterDto`; character classes are UI-only baseline security. */
function getPasswordIssues(password: string): string[] {
  if (password.length === 0) return [];

  const issues: string[] = [];

  if (password.length < 8)
    issues.push("Must be at least 8 characters"); if (password.length > 64)
    issues.push("Must be at most 64 characters"); if (!/[a-z]/.test(password))
    issues.push("Must include a lowercase letter"); if (!/[A-Z]/.test(password))
    issues.push("Must include an uppercase letter"); if (!/[0-9]/.test(password))
    issues.push("Must include a number"); if (!/[!@#$%^&*]/.test(password))
    issues.push("Must include a special character (!@#$%^&*)"); return issues;
}

export type RegisterPasswordFeedback =
  | { kind: "hidden" }
  | { kind: "invalid"; issues: string[] }
  | { kind: "valid" };

export type RegisterConfirmFeedback =
  | { kind: "hidden" }
  | { kind: "match" }
  | { kind: "mismatch" };

export type RegisterPageVm = {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  error: string | null;
  pending: boolean;
  canSubmit: boolean;
  passwordFeedback: RegisterPasswordFeedback;
  confirmFeedback: RegisterConfirmFeedback;
  setDisplayName: (v: string) => void;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function useRegisterPageVm(): RegisterPageVm {
  const { register } = useAuth();
  const [displayName, setDisplayName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  /** Last settled values for helper text (updated after debounce). */
  const [snap, setSnap] = React.useState({ p: "", c: "" });

  React.useEffect(() => {
    const id = window.setTimeout(
      () => setSnap({ p: password, c: confirmPassword }),
      DEBOUNCE_MS
    );
    return () => window.clearTimeout(id);
  }, [password, confirmPassword]);

  const passwordFeedback: RegisterPasswordFeedback = (() => {
    if (snap.p.length === 0) return { kind: "hidden" };
    const issues = getPasswordIssues(snap.p);
    if (issues.length) return { kind: "invalid", issues };
    return { kind: "valid" };
  })();

  const confirmFeedback: RegisterConfirmFeedback = (() => {
    if (snap.c.length === 0) return { kind: "hidden" };
    if (snap.p === snap.c) return { kind: "match" };
    return { kind: "mismatch" };
  })();

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSubmit =
    displayName.trim().length > 0 &&
    emailOk &&
    getPasswordIssues(password).length === 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const onSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);

      if (!displayName.trim()) {
        setError("Display name is required");
        return;
      }
      if (!email.trim()) {
        setError("Email is required");
        return;
      }
      if (!emailOk) {
        setError("Enter a valid email address");
        return;
      }
      const issues = getPasswordIssues(password);
      if (issues.length) {
        setError(issues[0] ?? "Password does not meet requirements");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

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
    [displayName, email, emailOk, password, confirmPassword, register]
  );

  return {
    displayName,
    email,
    password,
    confirmPassword,
    error,
    pending,
    canSubmit,
    passwordFeedback,
    confirmFeedback,
    setDisplayName,
    setEmail,
    setPassword,
    setConfirmPassword,
    onSubmit,
  };
}
