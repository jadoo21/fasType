import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { username: string; email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
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

  const login = async (email: string, _password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock login validation
    if (!email || !_password) {
      setLoading(false);
      return { success: false, error: 'Please fill in all fields' };
    }

    // Mock successful login
    const mockUser: User = {
      id: '1',
      username: email.split('@')[0],
      email: email,
      firstName: email.split('@')[0],
      lastName: 'User',
      createdAt: new Date().toISOString(),
      bestWpm: 72,
      averageWpm: 65,
      averageAccuracy: 96,
      testsCompleted: 28,
    };

    setUser(mockUser);
    localStorage.setItem('fastype_user', JSON.stringify(mockUser));
    setLoading(false);
    return { success: true };
  };

  const signup = async (data: { username: string; email: string; password: string }): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock signup validation
    if (!data.username || !data.email || !data.password) {
      setLoading(false);
      return { success: false, error: 'Please fill in all fields' };
    }

    if (data.password.length < 8) {
      setLoading(false);
      return { success: false, error: 'Password must be at least 8 characters' };
    }

    // Mock successful signup
    const mockUser: User = {
      id: Date.now().toString(),
      username: data.username,
      email: data.email,
      firstName: data.username,
      createdAt: new Date().toISOString(),
      bestWpm: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      testsCompleted: 0,
    };

    setUser(mockUser);
    localStorage.setItem('fastype_user', JSON.stringify(mockUser));
    setLoading(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fastype_user');
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