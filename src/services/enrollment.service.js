import { apiClient, toApiError } from '@/lib/apiClient';

export const enrollmentService = {
  async enroll(courseId) {
    try {
      const { data } = await apiClient.post(`/learner/courses/${courseId}/enroll`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to enroll');
    }
  },

  async enrolledCourses(params = {}) {
    try {
      const { data } = await apiClient.get('/learner/courses/enrolled', { params });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch enrolled courses');
    }
  },

  async courseProgress(courseId) {
    try {
      const { data } = await apiClient.get(`/learner/courses/${courseId}/progress`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch progress');
    }
  },

  async updateProgress(courseId, payload) {
    try {
      const { data } = await apiClient.put(`/learner/courses/${courseId}/progress`, payload);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to update progress');
    }
  },

  // Trainer-side enrollment management.
  async enrollStudents(courseId, studentIds) {
    if (!studentIds?.length) throw new Error('Student IDs are required');
    try {
      const { data } = await apiClient.post(`/course/${courseId}/enroll-students`, { studentIds });
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to enroll students');
    }
  },

  async courseEnrollments(courseId) {
    try {
      const { data } = await apiClient.get(`/course/${courseId}/enrollments`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to fetch enrollments');
    }
  },

  async removeStudent(courseId, studentId) {
    try {
      const { data } = await apiClient.delete(`/course/${courseId}/enrollments/${studentId}`);
      return data;
    } catch (error) {
      throw toApiError(error, 'Failed to remove student');
    }
  },
};
