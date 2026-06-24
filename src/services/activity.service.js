import { apiClient, toApiError } from '@/lib/apiClient';

// Admin activity logs.
export const activityService = {
  async logs(params = {}) {
    try {
      const { data } = await apiClient.get('/admin/activities', { params });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch activity logs');
    }
  },

  async loginActivities(params = {}) {
    try {
      const { data } = await apiClient.get('/admin/activities/login', { params });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch login activities');
    }
  },

  async userCreationLogs(params = {}) {
    try {
      const { data } = await apiClient.get('/admin/activities/user-created', { params });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch user creation logs');
    }
  },
};
