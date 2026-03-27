'use client';
import axios from 'axios';

const API_URL = '';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (data: { email: string; password: string; full_name?: string }) =>
    api.post('/api/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  me: () => api.get('/api/auth/me'),
};

export const resumeApi = {
  upload: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post('/api/resume/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  list: () => api.get('/api/resume/'),
  get: (id: number) => api.get(`/api/resume/${id}`),
};

export const analysisApi = {
  run: (resume_id: number, job_description: string) =>
    api.post('/api/analysis/run', { resume_id, job_description }),
  history: () => api.get('/api/analysis/history'),
  get: (id: number) => api.get(`/api/analysis/${id}`),
};

export default api;
