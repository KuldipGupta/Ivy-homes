import api from './api';

export async function getFavourites() {
  const res = await api.get('/favourites');
  return res.data;
}

export async function getSavedIds() {
  const res = await api.get('/favourites/ids');
  return res.data;
}

export async function addFavourite(id) {
  const res = await api.post('/favourites', { id });
  return res.data;
}

export async function removeFavourite(id) {
  const res = await api.delete(`/favourites/${id}`);
  return res.data;
}
