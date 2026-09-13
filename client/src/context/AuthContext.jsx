import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ivy_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ivy_token') || '');
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('ivy_refresh_token') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshTimerRef = useRef(null);

  const clearRefreshTimer = () => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  };

  const scheduleTokenRefresh = useCallback((rToken) => {
    clearRefreshTimer();
    if (!rToken) return;

    // Refresh every 12 minutes (token expires in 15 minutes / 900 seconds)
    const intervalMs = 12 * 60 * 1000;
    refreshTimerRef.current = setInterval(async () => {
      try {
        const res = await authService.refresh(rToken);
        if (res.data?.access_token) {
          const newToken = res.data.access_token;
          setToken(newToken);
          localStorage.setItem('ivy_token', newToken);
          console.log('[Auth] Token silently refreshed successfully.');
        }
      } catch (err) {
        console.warn('[Auth] Silent refresh failed:', err.message);
      }
    }, intervalMs);
  }, []);

  useEffect(() => {
    if (refreshToken) {
      scheduleTokenRefresh(refreshToken);
    }
    return () => clearRefreshTimer();
  }, [refreshToken, scheduleTokenRefresh]);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.login(email, password);
      const data = res.data;

      setToken(data.access_token);
      setRefreshToken(data.refresh_token);
      setUser(data.user);

      localStorage.setItem('ivy_token', data.access_token);
      localStorage.setItem('ivy_refresh_token', data.refresh_token);
      localStorage.setItem('ivy_user', JSON.stringify(data.user));

      scheduleTokenRefresh(data.refresh_token);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please check your credentials.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    clearRefreshTimer();
    try {
      await authService.logout();
    } catch (e) {
      // Stateless
    } finally {
      setToken('');
      setRefreshToken('');
      setUser(null);
      localStorage.removeItem('ivy_token');
      localStorage.removeItem('ivy_refresh_token');
      localStorage.removeItem('ivy_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        error,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
