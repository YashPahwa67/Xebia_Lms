import { apiClient, toApiError } from '@/lib/apiClient';

export const learnerContentService = {
  async enrolledContent(params = {}) {
    try {
      const { data } = await apiClient.get('/learner/content', { params });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch content');
    }
  },

  async byCategory(category, params = {}) {
    try {
      const { data } = await apiClient.get(`/learner/content/category/${category}`, { params });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch content');
    }
  },

  async access(courseId, contentId) {
    try {
      const { data } = await apiClient.get(
        `/learner/course/${courseId}/content/${contentId}/access`,
      );
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to access content');
    }
  },

  async view(courseId, contentId) {
    const { url } = await this.access(courseId, contentId);
    window.open(url, '_blank', 'noopener,noreferrer');
  },

  async download(courseId, contentId) {
    const data = await this.access(courseId, contentId);
    const link = document.createElement('a');
    link.href = data.url;
    link.download = data.metadata?.title || 'download';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
