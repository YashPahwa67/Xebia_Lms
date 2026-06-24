import { apiClient, toApiError } from '@/lib/apiClient';
import { env } from '@/config/env';
import { storage, decodeJwt } from '@/lib/storage';

function persist(token, user) {
  const role = user?.role?.name || user?.roleName || user?.role || '';
  storage.setSession({ token, user, role });
  return { token, user, role };
}

export const authService = {
  async login(email, password) {
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      if (!data?.token || !data?.user) throw new Error('Invalid response from server');
      return persist(data.token, data.user);
    } catch (error) {
      throw toApiError(error, 'Login failed');
    }
  },

  initiateGoogleLogin() {
    window.location.href = `${env.apiUrl}/auth/google`;
  },

  initiateGitHubLogin() {
    window.location.href = `${env.apiUrl}/auth/github`;
  },

  // OAuth callback: derive user from the JWT (backend exposes no /auth/me).
  handleOAuthSuccess(token) {
    if (!token) throw new Error('No token provided');
    const payload = decodeJwt(token) || {};
    const user = payload.user || {
      _id: payload.id || payload._id,
      email: payload.email,
      fullName: payload.fullName || payload.name,
      role: payload.role || payload.roleName,
    };
    return persist(token, user);
  },

  async forgotPassword(email) {
    try {
      const { data } = await apiClient.post('/auth/forgot-password', { email });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to send reset email');
    }
  },

  async resetPassword(token, password) {
    try {
      const { data } = await apiClient.put(`/auth/reset-password/${token}`, { password });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to reset password');
    }
  },

  async changePassword(currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      throw new Error('Current and new password are required');
    }
    try {
      const { data } = await apiClient.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to change password');
    }
  },

  logout() {
    storage.clear();
  },
};
