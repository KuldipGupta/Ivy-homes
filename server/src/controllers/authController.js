import { loginUser, refreshUserToken, logoutUser } from '../services/authService.js';
import { sendResponse } from '../utils/responseHandler.js';
import { ApiError } from '../utils/apiError.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw ApiError.badRequest('Email and password are required');
    }

    const data = await loginUser(email, password);
    return sendResponse(res, 200, 'Login successful', data);
  } catch (err) {
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      throw ApiError.badRequest('refresh_token is required');
    }

    const data = await refreshUserToken(refresh_token);
    return sendResponse(res, 200, 'Token refreshed successfully', data);
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    const token = req.token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : '');
    const data = await logoutUser(token);
    return sendResponse(res, 200, 'Logout successful', data);
  } catch (err) {
    next(err);
  }
}

export async function getProfile(req, res, next) {
  try {
    return sendResponse(res, 200, 'Profile retrieved', {
      user: req.user
    });
  } catch (err) {
    next(err);
  }
}
