import React from 'react';

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden animate-pulse flex flex-col">
      <div className="h-48 bg-slate-200" />
      <div className="p-4 flex-1 space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-slate-200 rounded" />
          <div className="h-3 w-16 bg-slate-200 rounded" />
        </div>
        <div className="h-5 w-3/4 bg-slate-200 rounded" />
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100">
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded" />
        </div>
        <div className="h-3 w-1/2 bg-slate-200 rounded" />
        <div className="pt-2 flex justify-between items-center">
          <div className="h-6 w-24 bg-slate-200 rounded" />
          <div className="h-7 w-20 bg-slate-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-6">
      <div className="h-6 w-48 bg-slate-200 rounded" />
      <div className="h-72 bg-slate-200 rounded-3xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="h-8 w-3/4 bg-slate-200 rounded" />
          <div className="h-4 w-1/2 bg-slate-200 rounded" />
          <div className="h-32 bg-slate-200 rounded-2xl" />
        </div>
        <div className="space-y-4">
          <div className="h-48 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default CardSkeleton;
