import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('saasflow_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('saasflow_token'));
  const [loading, setLoading] = useState(true);

  // Verify and hydrate current user on mount
  const checkAuth = useCallback(async () => {
    const storedToken = localStorage.getItem('saasflow_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const data = await authService.getCurrentUser();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('saasflow_user', JSON.stringify(data.user));
      } else {
        logout();
      }
    } catch (error) {
      console.warn('Session verification failed:', error.response?.data?.message || error.message);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (credentials) => {
    const data = await authService.login(credentials);
    if (data.success && data.token) {
      localStorage.setItem('saasflow_token', data.token);
      localStorage.setItem('saasflow_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return data;
    }
    throw new Error(data.message || 'Login failed');
  };

  // Register handler
  const register = async (userData) => {
    const data = await authService.register(userData);
    if (data.success && data.token) {
      localStorage.setItem('saasflow_token', data.token);
      localStorage.setItem('saasflow_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return data;
    }
    throw new Error(data.message || 'Registration failed');
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('saasflow_token');
    localStorage.removeItem('saasflow_user');
    setToken(null);
    setUser(null);
  };

  // Update user data in local state
  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedFields };
      localStorage.setItem('saasflow_user', JSON.stringify(merged));
      return merged;
    });
  };

  const isPro = user?.subscriptionPlan === 'pro';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        isPro,
        login,
        register,
        logout,
        updateUser,
        refreshUser: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
