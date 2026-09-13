import api from './api';

export async function getListings(params = {}) {
  const res = await api.get('/listings', { params });
  return res.data;
}

export async function getListingById(id) {
  const res = await api.get(`/listings/${id}`);
  return res.data;
}

export async function getSimilarListings(id) {
  const res = await api.get(`/listings/${id}/similar`);
  return res.data;
}
