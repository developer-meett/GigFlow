import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await api.get('/auth/me'); 
        setUser(data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  // Login user and save to state
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data);
    return data;
  };

  
  const logout = async () => {
    // 1. Clear UI immediately (Make it feel instant)
    setUser(null);
    
    try {
      // 2. Tell Backend to remove cookie
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Logout failed", err);
    }
    
    // 3. Force redirect to Homepage to ensure clean state
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};