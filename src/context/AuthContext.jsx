import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.sub); // make sure to always use `sub`
      setIsLoggedIn(true);
    } else {
      setUsername('');
      setIsLoggedIn(false);
    }
  }, []);

  const loginUser = (token) => {
    const decoded = jwtDecode(token);
    const extractedUsername = decoded.sub;

    localStorage.setItem('token', token);
    localStorage.setItem('username', extractedUsername);

    setUsername(extractedUsername);
    setIsLoggedIn(true);
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
