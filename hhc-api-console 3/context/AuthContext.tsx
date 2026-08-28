import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getStoredToken, setStoredToken } from '../storage';
import { configureClient } from '../api/client';
import { decodeJwt } from '../api/auth';
import * as AuthApi from '../api/auth';

interface AuthContextValue {
  token: string | null;
  userId: string | number | null;
  role: 'Admin' | 'User' | null;
  expiresAt: number | null; // ms epoch
  ready: boolean;
  login: (username: string, password: string) => Promise<void>;
  requestOtp: (email: string) => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function decodeSession(token: string) {
  const payload = decodeJwt(token);
  return {
    userId: payload?.id ?? null,
    role: (payload?.access_role as 'Admin' | 'User' | undefined) ?? null,
    expiresAt: payload?.exp ? payload.exp * 1000 : null,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | number | null>(null);
  const [role, setRole] = useState<'Admin' | 'User' | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  const setSession = useCallback((newToken: string | null) => {
    setToken(newToken);
    setStoredToken(newToken);
    if (newToken) {
      const decoded = decodeSession(newToken);
      setUserId(decoded.userId);
      setRole(decoded.role);
      setExpiresAt(decoded.expiresAt);
    } else {
      setUserId(null);
      setRole(null);
      setExpiresAt(null);
    }
  }, []);

  const logout = useCallback(() => setSession(null), [setSession]);

  // Wire the API client to always read the latest token and to sign out on 401.
  useEffect(() => {
    configureClient({
      getToken: () => token,
      onUnauthorized: () => setSession(null),
    });
  }, [token, setSession]);

  // Restore a persisted session on launch, dropping it if already expired.
  useEffect(() => {
    (async () => {
      const stored = await getStoredToken();
      if (stored) {
        const decoded = decodeSession(stored);
        if (decoded.expiresAt && decoded.expiresAt > Date.now()) {
          setToken(stored);
          setUserId(decoded.userId);
          setRole(decoded.role);
          setExpiresAt(decoded.expiresAt);
        } else {
          await setStoredToken(null);
        }
      }
      setReady(true);
    })();
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      const result = await AuthApi.loginWithPassword({ username, password });
      setSession(result.data.access_token);
    },
    [setSession]
  );

  const requestOtp = useCallback(async (email: string) => {
    await AuthApi.requestOtp(email);
  }, []);

  const verifyOtp = useCallback(
    async (email: string, otp: string) => {
      const result = await AuthApi.verifyOtp(email, otp);
      setSession(result.data.accessToken);
    },
    [setSession]
  );

  const signup = useCallback(
    async (firstName: string, lastName: string, email: string, password: string) => {
      const result = await AuthApi.register({ first_name: firstName, last_name: lastName, email, password });
      setSession(result.data.access_token);
    },
    [setSession]
  );

  const value = useMemo(
    () => ({ token, userId, role, expiresAt, ready, login, requestOtp, verifyOtp, signup, logout }),
    [token, userId, role, expiresAt, ready, login, requestOtp, verifyOtp, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
