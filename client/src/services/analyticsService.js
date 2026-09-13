import api from './api';

export async function getAnalyticsSummary() {
  const res = await api.get('/analytics/summary');
  return res.data;
}
