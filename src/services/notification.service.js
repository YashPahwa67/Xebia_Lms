import { apiClient, toApiError } from '@/lib/apiClient';

export const notificationService = {
  async list(params = {}) {
    try {
      const { data } = await apiClient.get('/notifications/', { params });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch notifications');
    }
  },

  async markRead(id) {
    try {
      const { data } = await apiClient.put(`/notifications/${id}/read`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to mark as read');
    }
  },

  async markAllRead() {
    try {
      const { data } = await apiClient.put('/notifications/mark-all-read');
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to mark all as read');
    }
  },

  async remove(id) {
    try {
      const { data } = await apiClient.delete(`/notifications/${id}`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to delete notification');
    }
  },
};
