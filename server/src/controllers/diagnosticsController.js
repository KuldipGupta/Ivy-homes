import { diagnosticsStore } from '../utils/diagnosticsStore.js';
import { sendResponse } from '../utils/responseHandler.js';

export function getDiagnostics(req, res, next) {
  try {
    const logs = diagnosticsStore.getLogs();
    return sendResponse(res, 200, 'Diagnostics logs retrieved', logs, {
      count: logs.length
    });
  } catch (err) {
    next(err);
  }
}

export function clearDiagnostics(req, res, next) {
  try {
    diagnosticsStore.clearLogs();
    return sendResponse(res, 200, 'Diagnostics logs cleared', []);
  } catch (err) {
    next(err);
  }
}
