import { apiRequest } from "@/shared/api/apiClient";
import type {
  AccountStatus,
  AdminOverview,
  PlatformAccount,
  PlatformAdmin,
} from "./types";

export const adminApi = {
  login: (email: string, password: string) =>
    apiRequest<{ admin: PlatformAdmin }>("/platform-admin/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  me: () => apiRequest<{ admin: PlatformAdmin }>("/platform-admin/auth/me"),
  logout: () =>
    apiRequest<void>("/platform-admin/auth/logout", { method: "POST" }),
  overview: () => apiRequest<AdminOverview>("/platform-admin/overview"),
  accounts: (input: { search?: string; status?: AccountStatus }) => {
    const query = new URLSearchParams();
    if (input.search) query.set("search", input.search);
    if (input.status) query.set("status", input.status);
    return apiRequest<{ data: PlatformAccount[]; meta: { total: number } }>(
      "/platform-admin/accounts?" + query,
    );
  },
  updateStatus: (id: string, status: AccountStatus) =>
    apiRequest<{ account: PlatformAccount }>(
      `/platform-admin/accounts/${id}/status`,
      { method: "PATCH", body: JSON.stringify({ status }) },
    ),
  revokeSessions: (id: string) =>
    apiRequest<void>(`/platform-admin/accounts/${id}/revoke-sessions`, {
      method: "POST",
    }),
};
