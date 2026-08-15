import axios from 'axios';

const getApiUrl = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl) return envUrl;
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  return `http://${hostname}:4000/api/v1`;
};

const API_URL = getApiUrl();

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Access Token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hrms_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto Refresh Token Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('hrms_refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          const { accessToken, refreshToken: newRefresh } = res.data;
          localStorage.setItem('hrms_access_token', accessToken);
          localStorage.setItem('hrms_refresh_token', newRefresh);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshErr) {
          localStorage.removeItem('hrms_access_token');
          localStorage.removeItem('hrms_refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  },
);
