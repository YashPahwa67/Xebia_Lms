import { apiClient, toApiError } from '@/lib/apiClient';
import { uploadViaPresignedUrl } from '@/lib/s3Upload';

export const coursesService = {
  async list(params = {}) {
    try {
      const { data } = await apiClient.get('/course', { params });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch courses');
    }
  },

  async getById(courseId) {
    try {
      const { data } = await apiClient.get(`/course/${courseId}`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch course');
    }
  },

  async create({ title, description, modules = [] }) {
    if (!title || !description) throw new Error('Title and description are required');
    try {
      const { data } = await apiClient.post('/course', { title, description, modules });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to create course');
    }
  },

  async remove(courseId) {
    try {
      const { data } = await apiClient.delete(`/course/${courseId}`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to delete course');
    }
  },

  async approved(params = {}) {
    try {
      const { data } = await apiClient.get('/course/approved', { params });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch approved courses');
    }
  },

  async pending(params = {}) {
    try {
      const { data } = await apiClient.get('/course/pending', { params });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch pending courses');
    }
  },

  async approve(courseId, payload = {}) {
    try {
      const { data } = await apiClient.put(`/course/${courseId}/approve`, payload);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to approve course');
    }
  },

  async reject(courseId, reason = '') {
    try {
      const { data } = await apiClient.put(`/course/${courseId}/reject`, { reason });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to reject course');
    }
  },

  async requestApproval(courseId) {
    try {
      const { data } = await apiClient.post(`/course/${courseId}/request-approval`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to request approval');
    }
  },

  async stats(courseId) {
    try {
      const { data } = await apiClient.get(`/course/${courseId}/stats`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch course stats');
    }
  },

  async content(courseId, contentType) {
    try {
      const { data } = await apiClient.get(`/course/${courseId}/content`, {
        params: contentType ? { contentType } : {},
      });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch content');
    }
  },

  async contentViewUrl(courseId, contentId) {
    try {
      const { data } = await apiClient.get(`/course/${courseId}/content/${contentId}/view`);
      return data.url;
    } catch (error) {
      throw toApiError(error, 'Failed to get content URL');
    }
  },

  async deleteContent(courseId, contentId) {
    try {
      const { data } = await apiClient.delete(`/course/${courseId}/content/${contentId}`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to delete content');
    }
  },

  // Upload content: presign -> S3 PUT -> register metadata.
  async uploadContent(courseId, { file, title, description, type, category, isPublic = true }) {
    try {
      const { objectKey } = await uploadViaPresignedUrl(file, async (meta) => {
        const { data } = await apiClient.post(`/course/${courseId}/content/presign`, meta);
        return data;
      });
      const { data } = await apiClient.post(`/course/${courseId}/content`, {
        objectKey,
        title: title || file.name,
        description: description || '',
        type: type || 'document',
        fileSize: file.size,
        mimeType: file.type,
        originalName: file.name,
        category: category || 'resource',
        isPublic,
      });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to upload content');
    }
  },
};
