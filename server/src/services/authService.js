import { ivyApi, createAuthenticatedClient } from './ivyApiService.js';
import { User } from '../models/User.js';
import { isDbConnected } from '../config/db.js';

export async function loginUser(email, password) {
  const response = await ivyApi.post('/auth/login', { email, password });
  const data = response.data;

  // Derive user friendly name based on email prefix if missing
  const derivedName = email.split('@')[0].toUpperCase();
  const userData = {
    email: data.user?.email || email,
    name: data.user?.name || derivedName
  };

  // Upsert user in MongoDB if DB is connected
  if (isDbConnected()) {
    try {
      await User.findOneAndUpdate(
        { email: userData.email },
        { email: userData.email, name: userData.name, lastLoginAt: new Date() },
        { upsert: true, new: true }
      );
    } catch (e) {
      console.warn('[User Model Save Error]:', e.message);
    }
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    token_type: data.token_type || 'Bearer',
    expires_in: data.expires_in || 900,
    user: userData
  };
}

export async function refreshUserToken(refreshToken) {
  const response = await ivyApi.post('/auth/refresh', {
    refresh_token: refreshToken
  });
  return response.data;
}

export async function logoutUser(token) {
  try {
    const client = createAuthenticatedClient(token);
    const response = await client.post('/auth/logout');
    return response.data;
  } catch (err) {
    // If upstream logout fails or is stateless, return success
    return { ok: true, note: 'Tokens are stateless; session cleared client-side' };
  }
}
