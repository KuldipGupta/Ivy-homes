import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: attach token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('ivy_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor: handle 401 token expiration
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('ivy_refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post('/api/auth/refresh', {
            refresh_token: refreshToken
          });

          if (res.data?.data?.access_token) {
            const newToken = res.data.data.access_token;
            localStorage.setItem('ivy_token', newToken);
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        } catch (refreshErr) {
          // Token refresh failed, purge credentials and redirect to login
          localStorage.removeItem('ivy_token');
          localStorage.removeItem('ivy_refresh_token');
          localStorage.removeItem('ivy_user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      } else {
        localStorage.removeItem('ivy_token');
        localStorage.removeItem('ivy_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
