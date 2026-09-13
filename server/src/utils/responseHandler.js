export function sendResponse(res, statusCode, message, data = null, meta = null) {
  const response = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    data
  };

  if (meta) {
    const enrichedMeta = {
      ...meta,
      totalPages: meta.total_pages ?? meta.totalPages,
      total_pages: meta.total_pages ?? meta.totalPages
    };
    response.meta = enrichedMeta;
    response.pagination = enrichedMeta;
  }

  return res.status(statusCode).json(response);
}
