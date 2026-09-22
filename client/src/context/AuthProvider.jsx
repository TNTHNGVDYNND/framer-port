import { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // M-2/#31: no token in JS-land anymore — the JWT rides an HttpOnly cookie set by
  // the server. Auth state bootstraps from /api/users/profile: cookie valid → user;
  // anything else → guest. Legacy localStorage keys (pre-M-2 sessions) are cleared.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      localStorage.removeItem('token'); // legacy cleanup, one-time
      localStorage.removeItem('user');
      try {
        const response = await fetch(`${API_BASE}/api/users/profile`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok && !cancelled) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        // Network/server down: stay guest; profile check retries on next mount.
        console.error('Auth bootstrap error:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE}/api/users/login`, {
        method: 'POST',
        credentials: 'include', // the server sets the HttpOnly auth cookie here
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      setUser(data);

      showNotification('[ACCESS GRANTED] Login successful!');
      return data;
    } catch (error) {
      showNotification(`[ACCESS DENIED] ${error.message}`, 'error');
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Server clears the HttpOnly cookie (JS cannot). Best-effort: state clears
      // locally regardless of network outcome.
      await fetch(`${API_BASE}/api/users/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout request failed (cookie expires with session anyway):', error);
    }
    setUser(null);
    showNotification('[SESSION TERMINATED] Logged out successfully!');
  };

  const getProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/users/profile`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      setUser((current) => ({ ...current, ...data }));
      return data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return null;
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    loading,
    notification,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    getProfile,
    showNotification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Note: useAuth hook is exported from hooks/useAuth.js for Fast Refresh compatibility

export default AuthContext;
