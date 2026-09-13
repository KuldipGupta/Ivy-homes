import { diagnosticsStore } from '../utils/diagnosticsStore.js';

export function requestLogger(req, res, next) {
  const startMs = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startMs;
    // Log non-static requests
    if (req.originalUrl.startsWith('/api/')) {
      diagnosticsStore.addEntry({
        method: req.method,
        endpoint: req.originalUrl.split('?')[0],
        status: res.statusCode,
        durationMs,
        query: req.query
      });
    }
  });

  next();
}
