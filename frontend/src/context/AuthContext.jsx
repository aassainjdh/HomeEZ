import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [providerProfile, setProviderProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Load user details if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('homeez_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            if (res.data.provider) {
              setProviderProfile(res.data.provider);
            }
          } else {
            logout();
          }
        } catch (error) {
          console.error('Failed to load user profile', error);
          logout();
        }
      }
      setLoading(false);
    };

    // Dark Mode initialization
    const storedTheme = localStorage.getItem('homeez_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    loadUser();
  }, []);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    if (darkMode) {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
      localStorage.setItem('homeez_theme', 'light');
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('homeez_theme', 'dark');
    }
  };

  // Login User
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('homeez_token', res.data.token);
        // Refresh full user stats and provider profile
        const profileRes = await api.get('/auth/me');
        setUser(profileRes.data.user);
        if (profileRes.data.provider) {
          setProviderProfile(profileRes.data.provider);
        }
        setLoading(false);
        return { success: true };
      }
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid email or password'
      };
    }
  };

  // Register User
  const register = async (name, email, password, role, phone, address) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
        phone,
        address
      });
      if (res.data.success) {
        localStorage.setItem('homeez_token', res.data.token);
        const profileRes = await api.get('/auth/me');
        setUser(profileRes.data.user);
        if (profileRes.data.provider) {
          setProviderProfile(profileRes.data.provider);
        }
        setLoading(false);
        return { success: true };
      }
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Try again.'
      };
    }
  };

  // Update User Profile
  const updateProfile = async (formData) => {
    try {
      const res = await api.put('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.data.success) {
        setUser(prev => ({
          ...prev,
          name: res.data.name,
          phone: res.data.phone,
          address: res.data.address,
          profileImage: res.data.profileImage
        }));
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile'
      };
    }
  };

  // Update Provider Profile
  const updateProvider = async (providerData) => {
    try {
      const res = await api.put('/users/provider-profile', providerData);
      if (res.data.success) {
        setProviderProfile(res.data.provider);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update provider settings'
      };
    }
  };

  // Refresh User State
  const refreshMe = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        if (res.data.provider) {
          setProviderProfile(res.data.provider);
        }
      }
    } catch (error) {
      console.error('Error refreshing state', error);
    }
  };

  // Logout User
  const logout = () => {
    localStorage.removeItem('homeez_token');
    setUser(null);
    setProviderProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        providerProfile,
        loading,
        darkMode,
        toggleDarkMode,
        login,
        register,
        logout,
        updateProfile,
        updateProvider,
        refreshMe
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
