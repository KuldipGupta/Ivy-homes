import api from './api';

export async function getRentals(params = {}) {
  const res = await api.get('/rentals', { params });
  return res.data;
}

export async function getRentalById(id) {
  const res = await api.get(`/rentals/${id}`);
  return res.data;
}
