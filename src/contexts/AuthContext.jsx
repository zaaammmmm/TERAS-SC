import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const defaultUser = { name: 'User', email: 'user@student.uin-suka.ac.id', role: 'user' };
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : defaultUser;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user, token]);

  const login = useCallback((userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
