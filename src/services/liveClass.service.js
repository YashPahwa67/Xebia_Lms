import { apiClient, toApiError } from '@/lib/apiClient';

export const liveClassService = {
  async list() {
    try {
      const { data } = await apiClient.get('/live-classes');
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch live classes');
    }
  },

  async create(payload) {
    try {
      const { data } = await apiClient.post('/live-classes', payload);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to create live class');
    }
  },

  async update(id, payload) {
    try {
      const { data } = await apiClient.put(`/live-classes/${id}`, payload);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to update live class');
    }
  },

  async remove(id) {
    try {
      const { data } = await apiClient.delete(`/live-classes/${id}`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to delete live class');
    }
  },

  async join(id) {
    try {
      const { data } = await apiClient.post(`/live-classes/${id}/join`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to join live class');
    }
  },
};
