import api from './api';

export async function getProjects(params = {}) {
  const res = await api.get('/projects', { params });
  return res.data;
}

export async function getProjectById(id) {
  const res = await api.get(`/projects/${id}`);
  return res.data;
}
