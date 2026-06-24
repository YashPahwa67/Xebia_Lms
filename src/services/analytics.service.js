import { apiClient, toApiError } from '@/lib/apiClient';

async function get(url, params, fallback) {
  try {
    const { data } = await apiClient.get(url, { params });
    return data;
  } catch (error) {
    throw toApiError(error, fallback);
  }
}

export const analyticsService = {
  // Admin
  loginAnalytics: (params = {}) =>
    get('/analytics/login-analytics', params, 'Failed to fetch login analytics'),
  userActivityTrend: (params = {}) =>
    get('/analytics/user-activity-trend', params, 'Failed to fetch activity trend'),
  trainerStats: (params = {}) =>
    get('/analytics/trainer-stats', params, 'Failed to fetch trainer stats'),

  // Trainer
  trainerDashboard: (params = {}) =>
    get('/trainer/analytics/dashboard-stats', params, 'Failed to fetch dashboard stats'),
  trainerPerformance: (params = {}) =>
    get('/trainer/analytics/performance', params, 'Failed to fetch performance'),
  trainerRecentActivity: (params = {}) =>
    get('/trainer/analytics/recent-activity', params, 'Failed to fetch recent activity'),
  trainerStudents: (params = {}) =>
    get('/trainer/students', params, 'Failed to fetch students'),
  trainerHours: (params = {}) =>
    get('/trainer/hours-analytics', params, 'Failed to fetch hours analytics'),
  trainerNotifications: (params = {}) =>
    get('/trainer/notifications', params, 'Failed to fetch notifications'),

  // Learner
  learnerDashboard: (params = {}) =>
    get('/learner/dashboard-stats', params, 'Failed to fetch dashboard stats'),
  learnerAnalytics: (params = {}) =>
    get('/learner/analytics/dashboard-stats', params, 'Failed to fetch analytics'),
  learnerPerformance: (params = {}) =>
    get('/learner/analytics/performance', params, 'Failed to fetch performance'),
  learnerRecentActivity: (params = {}) =>
    get('/learner/analytics/recent-activity', params, 'Failed to fetch recent activity'),
};
