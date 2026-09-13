import api from './api';

export async function login(email, password) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function refresh(refreshToken) {
  const res = await api.post('/auth/refresh', { refresh_token: refreshToken });
  return res.data;
}

export async function logout() {
  try {
    const res = await api.post('/auth/logout');
    return res.data;
  } catch (e) {
    return { ok: true };
  }
}

export async function getMe() {
  const res = await api.get('/auth/me');
  return res.data;
}
