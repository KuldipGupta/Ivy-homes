import React from 'react';
import { Filter, X, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { LOCALITIES, BHK_OPTIONS, FURNISHING_OPTIONS, PROPERTY_TYPES, SORT_OPTIONS } from '../constants/filters';

export default function FilterPanel({
  filters,
  onFilterChange,
  onReset,
  isOpen = false,
  onClose,
  totalResults = 0
}) {
  const hasActiveFilters =
    (filters.locality && filters.locality !== 'all') ||
    (filters.bhk && filters.bhk !== 'all') ||
    (filters.furnishing && filters.furnishing !== 'all') ||
    (filters.property_type && filters.property_type !== 'all') ||
    filters.min_price ||
    filters.max_price;

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-sm tracking-tight">Filter Properties</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset all
          </button>
        )}
      </div>

      {/* 1. Locality Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Locality
        </label>
        <select
          value={filters.locality || 'all'}
          onChange={(e) => onFilterChange('locality', e.target.value)}
          className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
        >
          {LOCALITIES.map((loc) => (
            <option key={loc.value} value={loc.value}>
              {loc.label}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Bedrooms / BHK */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Bedrooms
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {BHK_OPTIONS.map((opt) => {
            const active = (filters.bhk || 'all') === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFilterChange('bhk', opt.value)}
                className={`py-2 text-xs font-semibold rounded-lg border transition-all text-center ${
                  active
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {opt.label.replace(' BHK', '').replace('All BHK', 'All')}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Price Range */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Price Budget (INR)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Min Price</span>
            <input
              type="number"
              placeholder="e.g. 5000000"
              value={filters.min_price || ''}
              onChange={(e) => onFilterChange('min_price', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Max Price</span>
            <input
              type="number"
              placeholder="e.g. 20000000"
              value={filters.max_price || ''}
              onChange={(e) => onFilterChange('max_price', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
          <span>₹50 Lakhs</span>
          <span>₹2 Crores</span>
        </div>
      </div>

      {/* 4. Furnishing */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Furnishing
        </label>
        <div className="flex flex-wrap gap-1.5">
          {FURNISHING_OPTIONS.map((furn) => {
            const active = (filters.furnishing || 'all') === furn.value;
            return (
              <button
                key={furn.value}
                type="button"
                onClick={() => onFilterChange('furnishing', furn.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  active
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {furn.label.replace('All Furnishing', 'All')}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Property Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Property Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PROPERTY_TYPES.map((type) => {
            const active = (filters.property_type || 'all') === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => onFilterChange('property_type', type.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  active
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {type.label.replace('All Property Types', 'All')}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Sorting */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Sort By
        </label>
        <select
          value={filters.sort || 'price|asc'}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
        >
          {SORT_OPTIONS.map((sort) => (
            <option key={sort.value} value={sort.value}>
              {sort.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-72 bg-white rounded-2xl border border-slate-200/80 p-5 h-fit sticky top-20 shadow-sm">
        {content}
      </aside>

      {/* Mobile Slide-over Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                  <span className="font-bold text-lg text-slate-900">Filter Properties</span>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {content}
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200">
                <button
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-colors text-center"
                >
                  Show Results ({totalResults})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
