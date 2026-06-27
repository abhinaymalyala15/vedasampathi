/**
 * Vedasampatti API Client
 * Replaces base44Client.js — connects to the real Laravel backend.
 *
 * Usage:
 *   import api from '@/api/apiClient';
 *   const scholars = await api.get('/scholars');
 *   const result  = await api.post('/auth/login', { email, password });
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// ── Token helpers ─────────────────────────────────────────────────────────────
export const getToken  = ()        => localStorage.getItem('vs_token');
export const setToken  = (token)   => localStorage.setItem('vs_token', token);
export const clearToken = ()       => localStorage.removeItem('vs_token');

// ── Core fetch wrapper ────────────────────────────────────────────────────────
async function request(method, path, body = null, isFormData = false) {
  const token = getToken();

  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';
  headers['Accept'] = 'application/json';

  const options = { method, headers };
  if (body) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, options);

  // Handle 401 — redirect to login
  if (response.status === 401) {
    clearToken();
    window.location.href = '/login';
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

// ── API methods ───────────────────────────────────────────────────────────────
const api = {
  get:    (path)              => request('GET',    path),
  post:   (path, body)        => request('POST',   path, body),
  put:    (path, body)        => request('PUT',    path, body),
  patch:  (path, body)        => request('PATCH',  path, body),
  delete: (path)              => request('DELETE', path),
  upload: (path, formData)    => request('POST',   path, formData, true),
};

export default api;
