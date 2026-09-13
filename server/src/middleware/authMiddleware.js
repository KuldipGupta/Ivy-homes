import { ApiError } from '../utils/apiError.js';

function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  try {
    if (parts.length === 3) {
      return JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'));
    }
    if (parts.length === 2) {
      return JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf-8'));
    }
  } catch (e) {
    return null;
  }
  return null;
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Authentication token is required. Please log in.'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = decodeJwtPayload(token);

    if (!decoded) {
      return next(ApiError.unauthorized('Invalid authentication token format.'));
    }

    // Check expiration
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return next(ApiError.unauthorized('Authentication session has expired. Please refresh token or log in again.'));
    }

    req.user = {
      email: decoded.sub || decoded.email || 'demo@ivy.homes',
      key: decoded.key
    };
    req.token = token;
    next();
  } catch (err) {
    return next(ApiError.unauthorized('Failed to authenticate token.'));
  }
}

export function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = decodeJwtPayload(token);
    if (decoded && (!decoded.exp || Date.now() < decoded.exp * 1000)) {
      req.user = {
        email: decoded.sub || decoded.email || 'demo@ivy.homes',
        key: decoded.key
      };
      req.token = token;
    }
  } catch (e) {
    // Non-blocking for optional auth
  }

  next();
}
