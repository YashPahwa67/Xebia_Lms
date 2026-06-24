import { apiClient, toApiError } from '@/lib/apiClient';
import { uploadViaPresignedUrl } from '@/lib/s3Upload';

export const usersService = {
  async list(params = {}) {
    try {
      const { data } = await apiClient.get('/users', { params });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch users');
    }
  },

  async create(payload) {
    try {
      const { data } = await apiClient.post('/users/create', payload);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to create user');
    }
  },

  async updateRole(userId, roleName) {
    try {
      const { data } = await apiClient.put(`/users/${userId}/update-role`, { roleName });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to update role');
    }
  },

  async remove(userId) {
    try {
      const { data } = await apiClient.delete(`/users/${userId}`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to delete user');
    }
  },

  async toggleActive(userId) {
    try {
      const { data } = await apiClient.put(`/users/${userId}/toggle-active`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to toggle activation');
    }
  },

  async updateProfile(payload) {
    try {
      const { data } = await apiClient.put('/users/me', payload);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to update profile');
    }
  },

  async dashboardStats() {
    try {
      const { data } = await apiClient.get('/users/dashboard-stats');
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch dashboard stats');
    }
  },

  async studentsWithDetails(params = {}) {
    try {
      const { data } = await apiClient.get('/users/students-details', { params });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch students');
    }
  },

  async trainers(params = {}) {
    try {
      const { data } = await apiClient.get('/users/trainers', { params });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch trainers');
    }
  },

  async trainerDetails(trainerId) {
    try {
      const { data } = await apiClient.get(`/users/trainers/${trainerId}/details`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch trainer details');
    }
  },

  // Bulk upload Excel via presigned S3, then trigger processing.
  async bulkUpload(file) {
    try {
      const { objectKey } = await uploadViaPresignedUrl(file, async ({ filename }) => {
        const { data } = await apiClient.post('/users/upload-users/presigned', { filename });
        return data;
      });
      const { data } = await apiClient.post('/users/upload-users', {
        key: objectKey,
        filename: file.name,
      });
      return data;
    } catch (error) {
      throw toApiError(error, 'Bulk upload failed');
    }
  },
};
