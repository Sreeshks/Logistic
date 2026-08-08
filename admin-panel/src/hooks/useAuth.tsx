import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser } from '../types/auth';
import { getStoredUser, setStoredUser, setAccessToken, setRefreshToken, clearAuthStorage, getAccessToken } from '../utils/token';
import { authApi } from '../api/auth.api';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (tokens: { access_token: string; refresh_token: string }, user: AdminUser) => void;
  logout: () => Promise<void>;
  updateUser: (user: AdminUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(getStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            setStoredUser(res.data);
          }
        } catch {
          clearAuthStorage();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (tokens: { access_token: string; refresh_token: string }, userData: AdminUser) => {
    setAccessToken(tokens.access_token);
    setRefreshToken(tokens.refresh_token);
    setStoredUser(userData);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors
    } finally {
      clearAuthStorage();
      setUser(null);
    }
  };

  const updateUser = (userData: AdminUser) => {
    setStoredUser(userData);
    setUser(userData);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
