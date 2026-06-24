import axios from 'axios';
import { env } from '@/config/env';
import { storage } from '@/lib/storage';

// shared axios instance for all the services
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: env.apiTimeout, // 60s default to absorb Render cold starts
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true,
});

// Attach the bearer token on every request.
apiClient.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global 401 handling: clear the session and bounce to login.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.clear();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

// Normalize an axios error into a plain Error with the best available message.
export function toApiError(error, fallback = 'Something went wrong') {
  const data = error?.response?.data;
  if (data?.errors?.length) {
    const detail = data.errors
      .map((e) => (e.path ? `${e.path}: ${e.message}` : e.message))
      .join(', ');
    return new Error(detail || data.message || fallback);
  }
  return new Error(data?.message || error?.message || fallback);
}
