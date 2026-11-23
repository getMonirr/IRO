"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, refreshAccessToken, setToken } from "./api";
import type { UserRec } from "./types";

type Ctx = {
  user: UserRec | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
const AuthCtx = createContext<Ctx | null>(null);
export const useAuth = () => {
  const c = useContext(AuthCtx);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserRec | null>(null);
  const [loading, setLoading] = useState(true);

  // restore the session from the refresh cookie
  useEffect(() => {
    (async () => {
      if (await refreshAccessToken()) {
        try { setUser((await api<UserRec>("/auth/me")).data); } catch { /* not logged in */ }
      }
      setLoading(false);
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const r = await api<{ accessToken: string; user: UserRec }>("/auth/login", { method: "POST", body: { email, password } });
    setToken(r.data.accessToken);
    setUser(r.data.user);
  }, []);

  const logout = useCallback(async () => {
    try { await api("/auth/logout", { method: "POST" }); } catch { /* ignore */ }
    setToken(null);
    setUser(null);
  }, []);

  return <AuthCtx.Provider value={{ user, loading, login, logout }}>{children}</AuthCtx.Provider>;
}
