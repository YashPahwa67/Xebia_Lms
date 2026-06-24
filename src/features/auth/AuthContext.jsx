import { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import { storage } from '@/lib/storage';
import { users as seedUsers, CURRENT } from '@/data/seed';

const AuthContext = createContext(null);

const ACTIONS = {
  INIT: 'INIT',
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

const initialState = {
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.LOGIN_START:
      return { ...state, isLoading: true, error: null };
    case ACTIONS.INIT:
    case ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: payload.user,
        token: payload.token,
        role: payload.role,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case ACTIONS.LOGIN_FAILURE:
      return { ...initialState, isLoading: false, error: payload };
    case ACTIONS.LOGOUT:
      return { ...initialState, isLoading: false };
    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    const token = storage.getToken();
    const user = storage.getUser();
    const role = storage.getRole();
    if (token && user) {
      dispatch({ type: ACTIONS.INIT, payload: { token, user, role } });
    } else {
      dispatch({ type: ACTIONS.LOGOUT });
    }
  }, []);

  const login = useCallback(async (email, password) => {
    dispatch({ type: ACTIONS.LOGIN_START });
    try {
      const result = await authService.login(email, password);
      dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({ type: ACTIONS.LOGIN_FAILURE, payload: error.message });
      throw error;
    }
  }, []);

  const completeOAuth = useCallback((token) => {
    dispatch({ type: ACTIONS.LOGIN_START });
    try {
      const result = authService.handleOAuthSuccess(token);
      dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: result });
      return result;
    } catch (error) {
      dispatch({ type: ACTIONS.LOGIN_FAILURE, payload: error.message });
      throw error;
    }
  }, []);

  // Demo login: sign in as a sample user for the given institution role.
  const loginAs = useCallback((role) => {
    const seed = seedUsers.find((u) => u.id === CURRENT[role]);
    const user = {
      _id: seed.id,
      id: seed.id,
      fullName: seed.name,
      email: seed.email,
      role,
      isActive: true,
    };
    storage.setSession({ token: 'demo-token', user, role });
    dispatch({ type: ACTIONS.LOGIN_SUCCESS, payload: { token: 'demo-token', user, role } });
    return { user, role };
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    dispatch({ type: ACTIONS.LOGOUT });
  }, []);

  const clearError = useCallback(() => dispatch({ type: ACTIONS.CLEAR_ERROR }), []);

  const value = useMemo(
    () => ({ ...state, login, loginAs, completeOAuth, logout, clearError }),
    [state, login, loginAs, completeOAuth, logout, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
