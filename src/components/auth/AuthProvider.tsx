"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchMe, type AuthUser } from "@/lib/auth-client";
import { LoginModal } from "@/components/auth/LoginModal";

type AuthContextValue = {
  user: AuthUser | null | undefined;
  refreshUser: () => Promise<AuthUser | null>;
  openLogin: (opts?: { next?: string }) => void;
  closeLogin: () => void;
  setUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginNext, setLoginNext] = useState<string | undefined>();

  const refreshUser = useCallback(async () => {
    const me = await fetchMe();
    setUser(me);
    return me;
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const openLogin = useCallback((opts?: { next?: string }) => {
    setLoginNext(opts?.next);
    setLoginOpen(true);
  }, []);

  const closeLogin = useCallback(() => {
    setLoginOpen(false);
    setLoginNext(undefined);
  }, []);

  const value = useMemo(
    () => ({
      user,
      refreshUser,
      openLogin,
      closeLogin,
      setUser,
    }),
    [user, refreshUser, openLogin, closeLogin],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LoginModal
        open={loginOpen}
        next={loginNext}
        onClose={closeLogin}
        onSuccess={async (nextUser) => {
          setUser(nextUser);
          closeLogin();
        }}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
