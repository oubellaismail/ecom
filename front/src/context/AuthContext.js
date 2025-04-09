import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access_token'));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('is_admin') === 'true');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user data from localStorage if available
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
      }
    }

    // Check login status
    setIsLoggedIn(!!localStorage.getItem('access_token'));
    setIsAdmin(localStorage.getItem('is_admin') === 'true');
  }, []);

  const login = (authData) => {
    // Store all auth data from API response
    if (authData.access_token) {
      localStorage.setItem('access_token', authData.access_token);

      if (authData.refresh_token) {
        localStorage.setItem('refresh_token', authData.refresh_token);
      }

      if (authData.user) {
        localStorage.setItem('user', JSON.stringify(authData.user));
        setUser(authData.user);
      }

      if (authData.is_admin !== undefined) {
        localStorage.setItem('is_admin', authData.is_admin);
        setIsAdmin(authData.is_admin);
      }

      setIsLoggedIn(true);
    }
  };

  const logout = () => {
    // Clear all auth data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('is_admin');

    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      isAdmin,
      user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);