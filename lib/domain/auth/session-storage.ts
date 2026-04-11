import type { User } from "../../types/api";

const STORAGE_KEY = "oneforall_session_v1";

export type PersistedSession = {
  accessToken: string;
  refreshToken: string;
  userId: string;
  user: User;
};

export function readPersistedSession(): PersistedSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedSession;
    if (
      typeof parsed.accessToken !== "string" ||
      typeof parsed.refreshToken !== "string" ||
      typeof parsed.userId !== "string" ||
      !parsed.user ||
      typeof parsed.user._id === "undefined"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writePersistedSession(session: PersistedSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearPersistedSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
