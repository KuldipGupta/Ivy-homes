export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg = 'Bad Request', details = null) {
    return new ApiError(400, msg, details);
  }

  static unauthorized(msg = 'Unauthorized', details = null) {
    return new ApiError(401, msg, details);
  }

  static forbidden(msg = 'Forbidden', details = null) {
    return new ApiError(403, msg, details);
  }

  static notFound(msg = 'Resource Not Found', details = null) {
    return new ApiError(404, msg, details);
  }

  static unprocessable(msg = 'Unprocessable Entity', details = null) {
    return new ApiError(422, msg, details);
  }

  static tooManyRequests(msg = 'Rate Limit Exceeded', details = null) {
    return new ApiError(429, msg, details);
  }

  static internal(msg = 'Internal Server Error', details = null) {
    return new ApiError(500, msg, details);
  }
}
