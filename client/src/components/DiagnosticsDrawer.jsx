import React from 'react';
import { useDiagnostics } from '../context/DiagnosticsContext';
import { Activity, X, Trash2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DiagnosticsDrawer() {
  const { logs, isOpen, setIsOpen, fetchLogs, clearLogs, isLoading } = useDiagnostics();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-xl hover:bg-slate-800 hover:scale-105 transition-all border border-slate-700"
      >
        <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
        <span>API Diagnostics</span>
        {logs.length > 0 && (
          <span className="px-1.5 py-0.2 bg-emerald-600 rounded-full text-[10px] font-bold">
            {logs.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-32px)] bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-700 flex flex-col overflow-hidden max-h-[520px] transition-all">
      {/* Header */}
      <div className="p-3.5 bg-slate-850 border-b border-slate-750 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-xs tracking-tight">Live API Diagnostics</span>
          <span className="text-[10px] text-slate-400 font-mono">({logs.length})</span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={fetchLogs}
            disabled={isLoading}
            className="p-1 text-slate-400 hover:text-white rounded"
            title="Refresh logs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={clearLogs}
            className="p-1 text-slate-400 hover:text-rose-400 rounded"
            title="Clear logs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Log list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 font-mono text-[11px]">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No API requests recorded yet.
          </div>
        ) : (
          logs.map((log) => {
            const is2xx = log.status >= 200 && log.status < 300;
            const is4xx = log.status >= 400 && log.status < 500;
            return (
              <div
                key={log.id}
                className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        log.method === 'GET'
                          ? 'bg-blue-900/60 text-blue-300'
                          : log.method === 'POST'
                          ? 'bg-emerald-900/60 text-emerald-300'
                          : 'bg-rose-900/60 text-rose-300'
                      }`}
                    >
                      {log.method}
                    </span>
                    <span className="text-slate-200 truncate max-w-[170px]" title={log.endpoint}>
                      {log.endpoint}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] text-slate-400">{log.durationMs}ms</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        is2xx
                          ? 'bg-emerald-950 text-emerald-400'
                          : is4xx
                          ? 'bg-amber-950 text-amber-400'
                          : 'bg-rose-950 text-rose-400'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                </div>

                {log.query && Object.keys(log.query).length > 0 && (
                  <div className="text-[10px] text-slate-400 truncate bg-slate-900/60 px-1.5 py-0.5 rounded">
                    params: {JSON.stringify(log.query)}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer info */}
      <div className="p-2 bg-slate-850 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between">
        <span>Security: Credentials sanitized</span>
        <span>Auto-polling active</span>
      </div>
    </div>
  );
}
