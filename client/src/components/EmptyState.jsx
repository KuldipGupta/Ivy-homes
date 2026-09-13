import React from 'react';
import { SearchX } from 'lucide-react';

export default function EmptyState({
  title = 'No properties found',
  description = 'Try adjusting your search or clearing your active filters to find available properties.',
  actionLabel = 'Reset Filters',
  onAction,
  icon: Icon = SearchX
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-12 shadow-sm">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed max-w-sm mb-6">
        {description}
      </p>
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
