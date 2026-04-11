import { getRequest, patchRequest } from "../api/NetworkManager";
import { apiPath } from "../../config/api-path";
import type { User } from "../../types/api";

export async function getCurrentUser(): Promise<User> {
  return getRequest<User>(apiPath("users/me"));
}

export type UpdateProfileBody = {
  displayName?: string;
  avatar?: string | null;
};

export async function updateCurrentUser(
  body: UpdateProfileBody
): Promise<User> {
  return patchRequest<User, UpdateProfileBody>(apiPath("users/me"), body);
}
