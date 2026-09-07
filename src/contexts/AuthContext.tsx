import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { username: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('fastype_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('fastype_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      if (!email || !password) return { success: false, error: 'Please fill in all fields' };
      const response = await authApi.login({ email, password });
      if (!response.success || !response.data) return { success: false, error: response.error || 'Login failed' };
      setUser(response.data.user);
      localStorage.setItem('fastype_user', JSON.stringify(response.data.user));
      localStorage.setItem('fastype_token', response.data.token);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: { username: string; email: string; password: string }): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      if (!data.username || !data.email || !data.password) return { success: false, error: 'Please fill in all fields' };
      if (data.password.length < 8) return { success: false, error: 'Password must be at least 8 characters' };
      const response = await authApi.signup(data);
      if (!response.success || !response.data) return { success: false, error: response.error || 'Signup failed' };
      setUser(response.data.user);
      localStorage.setItem('fastype_user', JSON.stringify(response.data.user));
      localStorage.setItem('fastype_token', response.data.token);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    localStorage.removeItem('fastype_user');
    localStorage.removeItem('fastype_token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };