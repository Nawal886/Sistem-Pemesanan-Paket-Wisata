import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load user from local storage initially for fast render
    const storedUser = localStorage.getItem('wisataku_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user');
      }
    }

    const initAuth = async () => {
      const token = localStorage.getItem('wisataku_token');
      if (token) {
        try {
          const res = await authService.getProfile();
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('wisataku_user', JSON.stringify(res.data.data));
          }
        } catch (error) {
          console.error('Session expired or invalid token', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('wisataku_token', token);
    localStorage.setItem('wisataku_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('wisataku_token');
    localStorage.removeItem('wisataku_user');
    setUser(null);
  };

  const updateUser = (userData) => {
    localStorage.setItem('wisataku_user', JSON.stringify(userData));
    setUser(userData);
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
