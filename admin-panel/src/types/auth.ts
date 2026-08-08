export type AdminRole = 'SUPER_ADMIN' | 'ADMIN';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in?: number;
}

export interface LoginResponseData {
  tokens: AuthTokens;
  user: AdminUser;
}
