class DiagnosticsStore {
  constructor(maxEntries = 100) {
    this.maxEntries = maxEntries;
    this.logs = [];
  }

  addEntry({ method, endpoint, status, durationMs, query = {}, error = null }) {
    // Sanitize query params
    const sanitizedQuery = { ...query };
    delete sanitizedQuery.password;
    delete sanitizedQuery.api_key;
    delete sanitizedQuery.token;

    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      method: method.toUpperCase(),
      endpoint,
      status,
      durationMs,
      query: sanitizedQuery,
      error: error ? (error.message || String(error)) : null,
      isSuccess: status >= 200 && status < 400
    };

    this.logs.unshift(entry);
    if (this.logs.length > this.maxEntries) {
      this.logs.pop();
    }
    return entry;
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

export const diagnosticsStore = new DiagnosticsStore();
