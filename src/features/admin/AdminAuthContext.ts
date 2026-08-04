import { createContext } from "react";
import type { PlatformAdmin } from "./types";

export interface AdminAuthValue {
  admin: PlatformAdmin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
export const AdminAuthContext = createContext<AdminAuthValue | null>(null);
