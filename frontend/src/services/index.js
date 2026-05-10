import api from './api';

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
};

export const paketService = {
  getAll: (params = {}) => api.get('/paket', { params }),
  getById: (id) => api.get(`/paket/${id}`),
  create: (data) => api.post('/paket', data),
  update: (id, data) => api.put(`/paket/${id}`, data),
  delete: (id) => api.delete(`/paket/${id}`),
};

export const destibasiService = {
  getAll: (params = {}) => api.get('/destinasi', { params }),
  getById: (id) => api.get(`/destinasi/${id}`),
  create: (data) => api.post('/destinasi', data),
  update: (id, data) => api.put(`/destinasi/${id}`, data),
  delete: (id) => api.delete(`/destinasi/${id}`),
};

export const pemesananService = {
  getAll: (params = {}) => api.get('/pemesanan', { params }),
  getById: (id) => api.get(`/pemesanan/${id}`),
  getMyPemesanan: (params = {}) => api.get('/my/pemesanan', { params }),
  create: (data) => api.post('/pemesanan', data),
  update: (id, data) => api.put(`/pemesanan/${id}`, data),
  delete: (id) => api.delete(`/pemesanan/${id}`),
};

export const ulasanService = {
  getAll: (params = {}) => api.get('/ulasan', { params }),
  getById: (id) => api.get(`/ulasan/${id}`),
  create: (data) => api.post('/ulasan', data),
  update: (id, data) => api.put(`/ulasan/${id}`, data),
  delete: (id) => api.delete(`/ulasan/${id}`),
};
