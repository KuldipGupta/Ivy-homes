import { getAnalyticsSummary } from '../services/analyticsService.js';
import { sendResponse } from '../utils/responseHandler.js';

export function getSummary(req, res, next) {
  try {
    const summary = getAnalyticsSummary();
    return sendResponse(res, 200, 'Analytics summary generated', summary);
  } catch (err) {
    next(err);
  }
}
