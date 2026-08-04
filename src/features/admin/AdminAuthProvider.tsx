import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { adminApi } from "./adminApi";
import { AdminAuthContext } from "./AdminAuthContext";
import type { PlatformAdmin } from "./types";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<PlatformAdmin | null>(null);
  const [loading, setLoading] = useState(() =>
    window.location.pathname.startsWith("/admin"),
  );
  useEffect(() => {
    const clear = () => setAdmin(null);
    window.addEventListener("admin-auth:unauthorized", clear);
    if (!window.location.pathname.startsWith("/admin"))
      return () => window.removeEventListener("admin-auth:unauthorized", clear);
    let active = true;
    adminApi
      .me()
      .then(({ admin: current }) => {
        if (active) setAdmin(current);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      window.removeEventListener("admin-auth:unauthorized", clear);
    };
  }, []);
  const login = useCallback(async (email: string, password: string) => {
    const { admin: current } = await adminApi.login(email, password);
    setAdmin(current);
  }, []);
  const logout = useCallback(async () => {
    try {
      await adminApi.logout();
    } finally {
      setAdmin(null);
    }
  }, []);
  const value = useMemo(
    () => ({ admin, loading, login, logout }),
    [admin, loading, login, logout],
  );
  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}
