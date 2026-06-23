'use client';

import { useCallback, useEffect, useState } from 'react';
import { ADMIN_SESSION_KEY } from '../lib/admin-auth';

export function useAdminAuth() {
  const [password, setPassword] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) ?? '';
    }
    return '';
  });
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useCallback(async (pwd: string, verifyUrl = '/api/orders') => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(verifyUrl, { headers: { 'x-admin-password': pwd } });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Invalid password');
        setAuthenticated(false);
        return false;
      }
      sessionStorage.setItem(ADMIN_SESSION_KEY, pwd);
      setAuthenticated(true);
      return true;
    } catch {
      setError('Network error');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setAuthenticated(false);
    setPassword('');
  }, []);

  const getPassword = useCallback(() => sessionStorage.getItem(ADMIN_SESSION_KEY) ?? '', []);

  useEffect(() => {
    const saved = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (saved) {
      login(saved);
    }
  }, [login]);

  return { password, setPassword, authenticated, loading, error, login, logout, getPassword };
}
