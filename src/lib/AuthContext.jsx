
import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { setToken, clearToken, getToken } from '@/api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]                               = useState(null);
  const [isAuthenticated, setIsAuthenticated]         = useState(false);
  const [isLoadingAuth, setIsLoadingAuth]             = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError]                     = useState(null);
  const [authChecked, setAuthChecked]                 = useState(false);
  const [appPublicSettings, setAppPublicSettings]     = useState({ id: 'vedasampatti', public_settings: {} });

  // On mount: check if a token exists and verify it
  useEffect(() => {
    const token = getToken();
    if (token) {
      api.get('/auth/me')
        .then((data) => {
          if (data?.user) {
            setUser(data.user);
            setIsAuthenticated(true);
          }
        })
        .catch(() => {
          clearToken();
        })
        .finally(() => {
          setIsLoadingAuth(false);
          setAuthChecked(true);
        });
    } else {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  }, []);

  const checkUserAuth = async () => {
    const token = getToken();
    if (!token) { setAuthChecked(true); setIsLoadingAuth(false); return; }
    try {
      const data = await api.get('/auth/me');
      if (data?.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      }
    } catch {
      clearToken();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    setToken(data.token);
    setUser(data.user);
    setIsAuthenticated(true);
    return data.user;
  };

  const register = async (name, email, phoneNumber, password, q1, a1, q2, a2) => {
    const data = await api.post('/auth/register', {
      name,
      email,
      phone_number: phoneNumber,
      password,
      password_confirmation: password,
      security_question_1: q1,
      security_answer_1: a1,
      security_question_2: q2,
      security_answer_2: a2,
    });
    setToken(data.token);
    setUser(data.user);
    setIsAuthenticated(true);
    return data.user;
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    clearToken();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  const navigateToLogin = () => { window.location.href = '/login'; };

  const checkAppState = async () => { /* no-op */ };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      login,
      register,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
