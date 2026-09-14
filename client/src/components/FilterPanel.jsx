import React from 'react';
import { Filter, RotateCcw, ShieldCheck, Check } from 'lucide-react';
import { LOCALITIES, BHK_OPTIONS, FURNISHING_OPTIONS, PROPERTY_TYPES } from '../constants/filters';

export default function FilterPanel({
  searchParams,
  onUpdateFilters,
  filters: propFilters = {},
  onFilterChange,
  onReset
}) {
  // Gracefully extract filter values from either searchParams or propFilters
  const locality = searchParams ? (searchParams.get('locality') || '') : (propFilters.locality || '');
  const bhk = searchParams ? (searchParams.get('bhk') || '') : (propFilters.bhk || '');
  const property_type = searchParams ? (searchParams.get('property_type') || '') : (propFilters.property_type || '');
  const min_price = searchParams ? (searchParams.get('min_price') || '') : (propFilters.min_price || '');
  const max_price = searchParams ? (searchParams.get('max_price') || '') : (propFilters.max_price || '');
  const furnishing = searchParams ? (searchParams.get('furnishing') || '') : (propFilters.furnishing || '');
  const status = searchParams ? (searchParams.get('status') || '') : (propFilters.status || '');
  const verified_only = searchParams ? (searchParams.get('verified_only') || '') : (propFilters.verified_only || '');

  const handleChange = (key, val) => {
    const value = (val === 'all' || val === undefined || val === null) ? '' : String(val);
    if (onUpdateFilters) {
      onUpdateFilters({ [key]: value });
    } else if (onFilterChange) {
      onFilterChange(key, value);
    }
  };

  const handleResetAll = () => {
    if (onReset) {
      onReset();
    } else if (onUpdateFilters) {
      onUpdateFilters({
        locality: '',
        bhk: '',
        property_type: '',
        min_price: '',
        max_price: '',
        furnishing: '',
        status: '',
        verified_only: ''
      });
    }
  };

  const hasActiveFilters = Boolean(
    locality ||
    bhk ||
    furnishing ||
    property_type ||
    min_price ||
    max_price ||
    status ||
    verified_only === 'true'
  );

  return (
    <div className="space-y-6">
      {/* 1. Locality Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Locality
        </label>
        <select
          value={locality || 'all'}
          onChange={(e) => handleChange('locality', e.target.value)}
          className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
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
            const active = (!bhk && opt.value === 'all') || (bhk === opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleChange('bhk', opt.value)}
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

      {/* 3. Price Budget (INR) */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Budget Range (INR)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Min (₹)</span>
            <input
              type="number"
              placeholder="e.g. 5000000"
              value={min_price || ''}
              onChange={(e) => handleChange('min_price', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">Max (₹)</span>
            <input
              type="number"
              placeholder="e.g. 25000000"
              value={max_price || ''}
              onChange={(e) => handleChange('max_price', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Quick budget presets */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {[
            { label: '< ₹1 Cr', min: '', max: '10000000' },
            { label: '₹1-2 Cr', min: '10000000', max: '20000000' },
            { label: '₹2-4 Cr', min: '20000000', max: '40000000' },
            { label: '> ₹4 Cr', min: '40000000', max: '' }
          ].map((preset) => {
            const isSelected = min_price === preset.min && max_price === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  if (onUpdateFilters) {
                    onUpdateFilters({ min_price: preset.min, max_price: preset.max });
                  } else {
                    handleChange('min_price', preset.min);
                    handleChange('max_price', preset.max);
                  }
                }}
                className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Property Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Property Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PROPERTY_TYPES.map((type) => {
            const active = (!property_type && type.value === 'all') || (property_type.toLowerCase() === type.value.toLowerCase());
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => handleChange('property_type', type.value)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  active
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {type.label.replace('All Property Types', 'All')}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Furnishing */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Furnishing
        </label>
        <div className="flex flex-wrap gap-1.5">
          {FURNISHING_OPTIONS.map((furn) => {
            const active = (!furnishing && furn.value === 'all') || (furnishing.toLowerCase() === furn.value.toLowerCase());
            return (
              <button
                key={furn.value}
                type="button"
                onClick={() => handleChange('furnishing', furn.value)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                  active
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {furn.label.replace('All Furnishing', 'All')}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Verification & Status Toggles */}
      <div className="pt-2 border-t border-slate-100 space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
          Trust & Availability
        </label>

        <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-medium text-slate-700 hover:text-slate-900">
          <input
            type="checkbox"
            checked={verified_only === 'true'}
            onChange={(e) => handleChange('verified_only', e.target.checked ? 'true' : '')}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified Listings Only
          </span>
        </label>

        <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-medium text-slate-700 hover:text-slate-900">
          <input
            type="checkbox"
            checked={status === 'active'}
            onChange={(e) => handleChange('status', e.target.checked ? 'active' : '')}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
          />
          <span>Active Properties Only</span>
        </label>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <div className="pt-2">
          <button
            type="button"
            onClick={handleResetAll}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200"
          >
            <RotateCcw className="w-3 h-3" />
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
