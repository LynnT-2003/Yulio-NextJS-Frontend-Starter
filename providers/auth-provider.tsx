"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { AuthResponse, User } from "../lib/types/api";
import { tokenStore } from "../lib/domain/api/tokenStore";
import {
  clearPersistedSession,
  readPersistedSession,
  writePersistedSession,
} from "../lib/domain/auth/session-storage";
import {
  loginRequest,
  logoutRequest,
  registerRequest,
  type RegisterBody,
} from "../lib/domain/auth/auth-api";
import { getCurrentUser } from "../lib/domain/user/user-api";
import {
  setAccountSuspendedHandler,
  setSessionExpiredHandler,
} from "../lib/domain/api/NetworkManager";
import { ApiError } from "../lib/domain/api/ApiError";
import { routes } from "../lib/config/routes";

export type AuthContextValue = {
  user: User | null;
  /** False until client has read localStorage and synced tokenStore. */
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (body: RegisterBody) => Promise<void>;
  /** After OAuth JSON paste or token refresh from elsewhere. */
  applyAuthResponse: (auth: AuthResponse) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

function userIdFromAuthUser(u: AuthResponse["user"]): string {
  return String(u._id);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const p = readPersistedSession();
    if (p) {
      tokenStore.setSession(p.accessToken, p.refreshToken, p.userId);
      setUser(p.user);
    }
    setReady(true);
  }, []);

  const clearClientSession = React.useCallback(() => {
    tokenStore.clear();
    clearPersistedSession();
    setUser(null);
  }, []);

  React.useEffect(() => {
    setSessionExpiredHandler(() => {
      clearClientSession();
      router.replace(routes.login);
    });
    setAccountSuspendedHandler(() => {
      clearClientSession();
      router.replace(`${routes.login}?suspended=1`);
    });
  }, [router, clearClientSession]);

  const applyAuthResponse = React.useCallback((auth: AuthResponse) => {
    const userId = userIdFromAuthUser(auth.user);
    tokenStore.setSession(
      auth.tokens.accessToken,
      auth.tokens.refreshToken,
      userId
    );
    writePersistedSession({
      accessToken: auth.tokens.accessToken,
      refreshToken: auth.tokens.refreshToken,
      userId,
      user: auth.user,
    });
    setUser(auth.user);
  }, []);

  const login = React.useCallback(
    async (email: string, password: string) => {
      const auth = await loginRequest({ email, password });
      applyAuthResponse(auth);
      router.push(routes.account);
    },
    [applyAuthResponse, router]
  );

  const register = React.useCallback(
    async (body: RegisterBody) => {
      const auth = await registerRequest(body);
      applyAuthResponse(auth);
      router.push(routes.account);
    },
    [applyAuthResponse, router]
  );

  const logout = React.useCallback(async () => {
    const p = readPersistedSession();
    const userId = p?.userId ?? tokenStore.getUserId();
    const refreshToken = p?.refreshToken ?? tokenStore.getRefreshToken();
    if (userId && refreshToken) {
      try {
        await logoutRequest({ userId, refreshToken });
      } catch {
        /* clear client session regardless */
      }
    }
    clearClientSession();
    router.push(routes.home);
  }, [router, clearClientSession]);

  const refreshUser = React.useCallback(async () => {
    try {
      const next = await getCurrentUser();
      setUser(next);
      const p = readPersistedSession();
      if (p) {
        writePersistedSession({
          ...p,
          user: next,
        });
      }
    } catch (e) {
      if (e instanceof ApiError && e.isAccountSuspended) {
        return;
      }
      throw e;
    }
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      login,
      register,
      applyAuthResponse,
      logout,
      refreshUser,
    }),
    [user, ready, login, register, applyAuthResponse, logout, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
