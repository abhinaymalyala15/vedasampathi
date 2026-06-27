/**
 * Vedasampatti API Client
 * Connects to your own backend (Laravel REST API).
 *
 * Configure via .env:
 *   VITE_API_BASE_URL=https://api.yourdomain.com/api
 *
 * Usage:
 *   import api from '@/api/apiClient';
 *   const scholars = await api.get('/scholars');
 *   await api.post('/auth/login', { email, password });
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api';

export const getToken = () => localStorage.getItem('vs_token');
export const setToken = (token) => localStorage.setItem('vs_token', token);
export const clearToken = () => localStorage.removeItem('vs_token');

async function request(method, path, body = null, isFormData = false) {
  const token = getToken();

  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!isFormData && body) headers['Content-Type'] = 'application/json';

  const options = { method, headers };
  if (body) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, options);

  if (response.status === 401) {
    clearToken();
    if (!window.location.pathname.startsWith('/login')) {
      window.location.href = '/login';
    }
    return null;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data?.message || `API error ${response.status}`);
    error.status = response.status;
    error.errors = data?.errors || null;
    throw error;
  }

  return data;
}

const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
  upload: (path, formData) => request('POST', path, formData, true),
  postForm: (path, formData) => request('POST', path, formData, true),
};

export default api;
