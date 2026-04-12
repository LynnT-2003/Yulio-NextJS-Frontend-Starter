import { getRequest, postRequest } from "../api/NetworkManager";
import { apiPath } from "../../config/api-path";
import type { ModerationUser, ModerationUserListResult } from "../../types/api";

export type ModerationUserListParams = {
  page: number;
  limit: number;
  search?: string;
  /** Omit to list all users. */
  suspended?: boolean;
};

function moderationUsersPath(params: ModerationUserListParams): string {
  const sp = new URLSearchParams();
  sp.set("page", String(params.page));
  sp.set("limit", String(params.limit));
  const q = params.search?.trim();
  if (q) sp.set("search", q);
  if (params.suspended === true) sp.set("suspended", "true");
  if (params.suspended === false) sp.set("suspended", "false");
  const qs = sp.toString();
  return qs ? `admin/moderation/users?${qs}` : "admin/moderation/users";
}

export function listModerationUsers(
  params: ModerationUserListParams
): Promise<ModerationUserListResult> {
  return getRequest<ModerationUserListResult>(apiPath(moderationUsersPath(params)));
}

export function getModerationUser(userId: string): Promise<ModerationUser> {
  return getRequest<ModerationUser>(
    apiPath(`admin/moderation/users/${encodeURIComponent(userId)}`)
  );
}

export function suspendModerationUser(
  userId: string,
  reason?: string
): Promise<ModerationUser> {
  const trimmed = reason?.trim();
  return postRequest<ModerationUser, { reason?: string }>(
    apiPath(`admin/moderation/users/${encodeURIComponent(userId)}/suspend`),
    trimmed ? { reason: trimmed } : {}
  );
}

export function unsuspendModerationUser(userId: string): Promise<ModerationUser> {
  return postRequest<ModerationUser, Record<string, never>>(
    apiPath(`admin/moderation/users/${encodeURIComponent(userId)}/unsuspend`),
    {}
  );
}
