import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error communicating with the property service. Please try again.',
  onRetry
}) {
  return (
    <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center flex flex-col items-center justify-center max-w-md mx-auto my-12 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-2" />
          Retry Request
        </button>
      )}
    </div>
  );
}
