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

  
// Logout user and clear state
  const logout = async () => {
    // 1. CLEAR UI IMMEDIATELY (Do this first!)
    setUser(null); 
    
    try {
      // 2. Tell backend to remove cookie (in background)
      await api.post('/auth/logout');
    } catch (err) {
      // Even if this fails, the user is already logged out on the screen
      console.error("Logout error:", err);
    }

    // 3. Force a hard redirect to the Home Page
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};