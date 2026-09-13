import api from './api';

export async function getDiagnosticsLogs() {
  const res = await api.get('/diagnostics');
  return res.data;
}

export async function clearDiagnosticsLogs() {
  const res = await api.post('/diagnostics/clear');
  return res.data;
}
