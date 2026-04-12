"use client";

import * as React from "react";
import { useAuth } from "@/providers/auth-provider";
import {
  listModerationUsers,
  suspendModerationUser,
  unsuspendModerationUser,
} from "@/lib/domain/admin/moderation-api";
import type { ModerationUser } from "@/lib/types/api";
import { ApiError } from "@/lib/domain/api/ApiError";

export type SuspendedFilter = "all" | "active" | "suspended";

const DEFAULT_LIMIT = 20;

export type ModerationPageVm = {
  items: ModerationUser[];
  total: number;
  page: number;
  limit: number;
  searchDraft: string;
  suspendedFilter: SuspendedFilter;
  loading: boolean;
  listError: string | null;
  actionError: string | null;
  actionUserId: string | null;
  currentUserId: string | undefined;
  suspendTarget: ModerationUser | null;
  suspendReason: string;
  totalPages: number;
  setSearchDraft: (v: string) => void;
  setSuspendedFilter: (v: SuspendedFilter) => void;
  setSuspendReason: (v: string) => void;
  applyFilters: () => void;
  goPage: (p: number) => void;
  refresh: () => Promise<void>;
  openSuspend: (u: ModerationUser) => void;
  closeSuspend: () => void;
  submitSuspend: () => Promise<void>;
  submitUnsuspend: (u: ModerationUser) => Promise<void>;
};

function suspendedParam(
  f: SuspendedFilter
): boolean | undefined {
  if (f === "active") return false;
  if (f === "suspended") return true;
  return undefined;
}

export function useModerationPageVm(): ModerationPageVm {
  const { user } = useAuth();
  const [items, setItems] = React.useState<ModerationUser[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(DEFAULT_LIMIT);
  const [searchDraft, setSearchDraft] = React.useState("");
  const [committedSearch, setCommittedSearch] = React.useState("");
  const [suspendedFilter, setSuspendedFilterState] =
    React.useState<SuspendedFilter>("all");
  const [loading, setLoading] = React.useState(true);
  const [listError, setListError] = React.useState<string | null>(null);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [actionUserId, setActionUserId] = React.useState<string | null>(null);
  const [suspendTarget, setSuspendTarget] = React.useState<ModerationUser | null>(
    null
  );
  const [suspendReason, setSuspendReason] = React.useState("");

  const load = React.useCallback(async () => {
    setLoading(true);
    setListError(null);
    try {
      const res = await listModerationUsers({
        page,
        limit,
        search: committedSearch || undefined,
        suspended: suspendedParam(suspendedFilter),
      });
      setItems(res.items);
      setTotal(res.total);
    } catch (e) {
      const msg =
        e instanceof ApiError
          ? e.message
          : e instanceof Error
            ? e.message
            : "Failed to load users";
      setListError(msg);
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit, committedSearch, suspendedFilter]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const setSuspendedFilter = React.useCallback((v: SuspendedFilter) => {
    setSuspendedFilterState(v);
    setPage(1);
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const applyFilters = React.useCallback(() => {
    setCommittedSearch(searchDraft);
    setPage(1);
  }, [searchDraft]);

  const goPage = React.useCallback((p: number) => {
    setPage(Math.max(1, p));
  }, []);

  const openSuspend = React.useCallback((u: ModerationUser) => {
    setActionError(null);
    setSuspendReason("");
    setSuspendTarget(u);
  }, []);

  const closeSuspend = React.useCallback(() => {
    setSuspendTarget(null);
    setSuspendReason("");
  }, []);

  const submitSuspend = React.useCallback(async () => {
    if (!suspendTarget) return;
    setActionError(null);
    setActionUserId(suspendTarget._id);
    try {
      const updated = await suspendModerationUser(
        suspendTarget._id,
        suspendReason
      );
      setItems((prev) =>
        prev.map((row) => (row._id === updated._id ? updated : row))
      );
      closeSuspend();
    } catch (e) {
      setActionError(
        e instanceof ApiError ? e.message : "Could not suspend user"
      );
    } finally {
      setActionUserId(null);
    }
  }, [suspendTarget, suspendReason, closeSuspend]);

  const submitUnsuspend = React.useCallback(async (u: ModerationUser) => {
    if (!window.confirm(`Restore access for ${u.displayName}?`)) return;
    setActionError(null);
    setActionUserId(u._id);
    try {
      const updated = await unsuspendModerationUser(u._id);
      setItems((prev) =>
        prev.map((row) => (row._id === updated._id ? updated : row))
      );
    } catch (e) {
      setActionError(
        e instanceof ApiError ? e.message : "Could not unsuspend user"
      );
    } finally {
      setActionUserId(null);
    }
  }, []);

  return {
    items,
    total,
    page,
    limit,
    searchDraft,
    suspendedFilter,
    loading,
    listError,
    actionError,
    actionUserId,
    currentUserId: user?._id,
    suspendTarget,
    suspendReason,
    totalPages,
    setSearchDraft,
    setSuspendedFilter,
    setSuspendReason,
    applyFilters,
    goPage,
    refresh: load,
    openSuspend,
    closeSuspend,
    submitSuspend,
    submitUnsuspend,
  };
}
