import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as diagnosticsService from '../services/diagnosticsService';

const DiagnosticsContext = createContext(null);

export function DiagnosticsProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await diagnosticsService.getDiagnosticsLogs();
      setLogs(res.data || []);
    } catch (e) {
      // Ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearLogs = async () => {
    try {
      await diagnosticsService.clearDiagnosticsLogs();
      setLogs([]);
    } catch (e) {}
  };

  useEffect(() => {
    fetchLogs();
    const timer = setInterval(() => {
      if (isOpen) {
        fetchLogs();
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [isOpen, fetchLogs]);

  return (
    <DiagnosticsContext.Provider
      value={{
        logs,
        isOpen,
        setIsOpen,
        isLoading,
        fetchLogs,
        clearLogs
      }}
    >
      {children}
    </DiagnosticsContext.Provider>
  );
}

export function useDiagnostics() {
  const ctx = useContext(DiagnosticsContext);
  if (!ctx) throw new Error('useDiagnostics must be used within DiagnosticsProvider');
  return ctx;
}
