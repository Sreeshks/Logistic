import { AdminUser } from '../types/auth';

const ACCESS_TOKEN_KEY = 'logistics_admin_access_token';
const REFRESH_TOKEN_KEY = 'logistics_admin_refresh_token';
const USER_KEY = 'logistics_admin_user';

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const getStoredUser = (): AdminUser | null => {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: AdminUser): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthStorage = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
