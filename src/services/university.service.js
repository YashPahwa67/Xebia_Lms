import { apiClient, toApiError } from '@/lib/apiClient';

export const universityService = {
  async list() {
    try {
      const { data } = await apiClient.get('/university');
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch universities');
    }
  },

  async getById(id) {
    try {
      const { data } = await apiClient.get(`/university/${id}`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch university');
    }
  },

  async create(payload) {
    try {
      const { data } = await apiClient.post('/university', payload);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to create university');
    }
  },

  async bulkUpload(payload) {
    try {
      const { data } = await apiClient.post('/university/bulk', payload);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to bulk upload universities');
    }
  },

  async update(id, payload) {
    try {
      const { data } = await apiClient.patch(`/university/${id}`, payload);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to update university');
    }
  },

  async toggleStatus(id) {
    try {
      const { data } = await apiClient.patch(`/university/${id}/status`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to toggle status');
    }
  },
};
