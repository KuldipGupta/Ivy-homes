import { ApiError } from '../utils/apiError.js';

export function errorMiddleware(err, req, res, next) {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details = null;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err.isAxiosError && err.response) {
    statusCode = err.response.status;
    message = err.response.data?.detail || err.response.statusText || 'Upstream API Error';
    details = err.response.data;
  } else if (err.name === 'ValidationError') {
    statusCode = 422;
    message = err.message;
    details = err.errors;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for field: ${err.path}`;
  } else if (err.message) {
    message = err.message;
  }

  // Never crash or leave client hanging
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    details: process.env.NODE_ENV === 'development' ? details : undefined
  });
}
