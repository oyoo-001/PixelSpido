import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '@/lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
        return;
      }
      
      api.setToken(token);
      const { user, subscription } = await api.auth.me();
      setUser(user);
      setSubscription(subscription);
      setIsAuthenticated(true);
      setAuthError(null);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
      setSubscription(null);
      
      if (error.status === 401 || error.status === 403) {
        setAuthError({ type: 'auth_required', message: 'Please login to continue' });
      }
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.auth.login({ email, password });
    
    if (response.requires2fa) {
      return response;
    }
    
    const { token, user } = response;
    api.setToken(token);
    setUser(user);
    setIsAuthenticated(true);
    setAuthError(null);
    // Fetch subscription after login
    try {
      const { subscription } = await api.auth.me();
      setSubscription(subscription);
    } catch (e) {
      console.error("Failed to get subscription:", e);
    }
    return user;
  };

  const register = async (email, name, password) => {
    const { token, user } = await api.auth.register({ email, name, password });
    api.setToken(token);
    setUser(user);
    setIsAuthenticated(true);
    setAuthError(null);
    // Fetch subscription after registration
    try {
      const { subscription } = await api.auth.me();
      setSubscription(subscription);
    } catch (e) {
      console.error("Failed to get subscription:", e);
    }
    return user;
  };

  const loginWithGoogle = async (googleToken) => {
    const { token, user } = await api.auth.google(googleToken);
    api.setToken(token);
    setUser(user);
    setIsAuthenticated(true);
    setAuthError(null);
    return user;
  };

  const logout = () => {
    api.auth.logout();
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      subscription,
      isAuthenticated, 
      isLoadingAuth,
      authError,
      login,
      register,
      loginWithGoogle,
      logout,
      navigateToLogin,
      checkUserAuth
    }}>
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