import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, signupUser } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          setUser(null);
        }
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, pass) => {
    const data = await loginUser({ email, pass });
    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      
      // Store basic user identity
      const userData = { email, name: email.split('@')[0] };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return data;
    }
    throw new Error('Token not returned from server');
  }, []);

  const signup = useCallback(async (name, email, pass) => {
    const data = await signupUser({ name, email, pass });
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated,
        login,
        signup,
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
