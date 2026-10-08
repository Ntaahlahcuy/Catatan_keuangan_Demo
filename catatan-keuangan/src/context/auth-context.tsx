import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import {
  getSession, getProfile, loginLocalUser, logoutLocalUser, migrateLegacyData,
  registerLocalUser, type UserProfile, type UserSession,
} from '../lib-storage';

type AuthState = {
  session: UserSession | null; profile: UserProfile | null; loading: boolean; error: string;
  retry: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (profile: UserProfile, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const retry = useCallback(async () => {
    setLoading(true); setError('');
    try {
      await migrateLegacyData();
      const savedSession = await getSession();
      setSession(savedSession);
      setProfile(savedSession ? await getProfile() : null);
    } catch {
      setSession(null); setProfile(null);
      setError('Penyimpanan aman belum dapat dibuka. Di web, gunakan localhost atau HTTPS lalu coba lagi.');
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { void retry(); }, [retry]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const next = await loginLocalUser(email, password);
      setProfile(await getProfile()); setSession(next);
    } catch (failure) {
      setProfile(null); setSession(null); throw failure;
    }
  }, []);
  const logout = useCallback(async () => {
    await logoutLocalUser(); setProfile(null); setSession(null);
  }, []);

  useEffect(() => {
    if (!session) return;
    const expire = () => { void logout().catch(() => { setSession(null); setProfile(null); }); };
    const timer = setTimeout(expire, Math.max(0, session.expiresAt - Date.now()));
    const listener = AppState.addEventListener('change', (state) => {
      if (state === 'active' && session.expiresAt <= Date.now()) expire();
    });
    return () => { clearTimeout(timer); listener.remove(); };
  }, [session, logout]);
  return <AuthContext.Provider value={{ session, profile, loading, error, retry, login, register: registerLocalUser, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const value = useContext(AuthContext);
  if (!value) throw new Error('AuthProvider belum tersedia.');
  return value;
}
