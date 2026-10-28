import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ahad_macbook_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const { success, error: toastError } = useToast();

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const userData = res.data.data;
      setUser(userData);
      localStorage.setItem('ahad_macbook_user', JSON.stringify(userData));
      success(`Welcome back, ${userData.name}!`);
      return userData;
    } catch (err) {
      toastError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', userData);
      const newUser = res.data.data;
      setUser(newUser);
      localStorage.setItem('ahad_macbook_user', JSON.stringify(newUser));
      success(`Account created! Welcome to Ahad MacBook, ${newUser.name}.`);
      return newUser;
    } catch (err) {
      toastError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ahad_macbook_user');
    success('Logged out successfully');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        login,
        register,
        logout,
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
