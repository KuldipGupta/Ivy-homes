import axios from 'axios';
import { config } from '../config/env.js';

export const ivyApi = axios.create({
  baseURL: config.ivyApiBaseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': config.ivyApiKey
  }
});

// Helper to create authenticated instance with user bearer token
export function createAuthenticatedClient(token) {
  return axios.create({
    baseURL: config.ivyApiBaseUrl,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': config.ivyApiKey,
      'Authorization': `Bearer ${token}`
    }
  });
}
