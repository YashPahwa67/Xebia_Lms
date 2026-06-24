import { apiClient, toApiError } from '@/lib/apiClient';

export const batchService = {
  async list(params = {}) {
    try {
      const { data } = await apiClient.get('/trainer/batches', { params });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch batches');
    }
  },

  async create(payload) {
    try {
      const { data } = await apiClient.post('/trainer/batches', payload);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to create batch');
    }
  },

  async update(id, payload) {
    try {
      const { data } = await apiClient.put(`/trainer/batches/${id}`, payload);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to update batch');
    }
  },

  async remove(id) {
    try {
      const { data } = await apiClient.delete(`/trainer/batches/${id}`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to delete batch');
    }
  },

  async stats(id) {
    try {
      const { data } = await apiClient.get(`/trainer/batches/${id}/stats`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch batch stats');
    }
  },

  // Accepts either { studentId } or { email }.
  async addStudent(batchId, identifier) {
    try {
      const { data } = await apiClient.post(`/trainer/batches/${batchId}/students`, identifier);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to add student');
    }
  },

  async updateStudentStatus(batchId, studentId, statusData) {
    try {
      const { data } = await apiClient.put(
        `/trainer/batches/${batchId}/students/${studentId}`,
        statusData,
      );
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to update student status');
    }
  },

  async removeStudent(batchId, studentId) {
    try {
      const { data } = await apiClient.delete(
        `/trainer/batches/${batchId}/students/${studentId}`,
      );
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to remove student');
    }
  },
};
