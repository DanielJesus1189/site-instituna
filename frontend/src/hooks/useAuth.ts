import { useCallback, useEffect, useState } from 'react';
import {
  fetchCurrentUser,
  login as loginRequest,
  type AuthUser,
} from '../api/client';
import {
  AUTH_UNAUTHORIZED_EVENT,
  clearAuthToken,
  getAuthToken,
  setAuthToken,
} from '../auth/token';

interface UseAuthResult {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isChecking: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export function useAuth(): UseAuthResult {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isChecking, setIsChecking] = useState(() => Boolean(getAuthToken()));

  // Validate a token persisted from a previous session.
  useEffect(() => {
    if (!getAuthToken()) {
      setIsChecking(false);
      return;
    }

    let cancelled = false;

    fetchCurrentUser()
      .then((currentUser) => {
        if (!cancelled) setUser(currentUser);
      })
      .catch(() => {
        if (!cancelled) {
          clearAuthToken();
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // The API client clears the token when it receives a 401; mirror that in state.
  useEffect(() => {
    function handleUnauthorized() {
      setUser(null);
    }

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const { token, user: loggedInUser } = await loginRequest(username, password);
    setAuthToken(token);
    setUser(loggedInUser);
  }, []);

  const logout = useCallback(() => {
    clearAuthToken();
    setUser(null);
  }, []);

  return {
    user,
    isAuthenticated: Boolean(user),
    isChecking,
    login,
    logout,
  };
}
