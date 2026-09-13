import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  RotateCcw, 
  X, 
  ChevronDown, 
  Sparkles,
  Building2,
  CheckCircle2
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import FilterPanel from '../components/FilterPanel';
import Pagination from '../components/Pagination';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import * as listingService from '../services/listingService';

export default function BrowseListings() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Local state for instant search input before committing
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // Extract query filters
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const locality = searchParams.get('locality') || '';
  const bhk = searchParams.get('bhk') || '';
  const property_type = searchParams.get('property_type') || '';
  const min_price = searchParams.get('min_price') || '';
  const max_price = searchParams.get('max_price') || '';
  const furnishing = searchParams.get('furnishing') || '';
  const status = searchParams.get('status') || '';
  const verified_only = searchParams.get('verified_only') || '';
  const sort = searchParams.get('sort') || '';
  const search = searchParams.get('search') || '';

  // Synchronize input if URL changes
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  // Fetch listings
  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        locality: locality || undefined,
        bhk: bhk || undefined,
        property_type: property_type || undefined,
        min_price: min_price || undefined,
        max_price: max_price || undefined,
        furnishing: furnishing || undefined,
        status: status || undefined,
        verified_only: verified_only || undefined,
        sort: sort || undefined,
        search: search || undefined
      };

      const res = await listingService.getListings(params);
      setListings(res.data || []);
      const meta = res.meta || res.pagination || {};
      setPagination({
        page: meta.page || page,
        limit: meta.page_size || limit,
        total: meta.total ?? (res.data ? res.data.length : 0),
        totalPages: meta.totalPages || meta.total_pages || Math.ceil((meta.total || 1) / limit)
      });
    } catch (err) {
      console.error('Fetch listings failed:', err);
      setError(err.message || 'Failed to load properties. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, locality, bhk, property_type, min_price, max_price, furnishing, status, verified_only, sort, search]);

  useEffect(() => {
    fetchListings();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchListings]);

  // Update query params helper
  const updateQueryParam = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        updated.delete(key);
      } else {
        updated.set(key, value);
      }
    });
    // Reset to page 1 on filter changes unless page itself is explicitly modified
    if (!('page' in newParams)) {
      updated.set('page', '1');
    }
    setSearchParams(updated);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQueryParam({ search: searchTerm.trim() });
  };

  const handlePageChange = (newPage) => {
    updateQueryParam({ page: newPage });
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams({ page: '1', limit: String(limit) }));
    setSearchTerm('');
  };

  // Active filter pills list
  const activeFilters = [];
  if (locality) activeFilters.push({ key: 'locality', label: `Locality: ${locality}` });
  if (bhk) activeFilters.push({ key: 'bhk', label: `${bhk} BHK` });
  if (property_type) activeFilters.push({ key: 'property_type', label: property_type });
  if (min_price) activeFilters.push({ key: 'min_price', label: `Min ₹${Number(min_price).toLocaleString('en-IN')}` });
  if (max_price) activeFilters.push({ key: 'max_price', label: `Max ₹${Number(max_price).toLocaleString('en-IN')}` });
  if (furnishing) activeFilters.push({ key: 'furnishing', label: furnishing.replace('-', ' ') });
  if (status) activeFilters.push({ key: 'status', label: `Status: ${status}` });
  if (verified_only === 'true') activeFilters.push({ key: 'verified_only', label: 'Verified Only' });
  if (search) activeFilters.push({ key: 'search', label: `"${search}"` });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* HEADER SECTION */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Bangalore Verified Properties For Sale
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Showing {pagination.total.toLocaleString()} audited properties matching your criteria
            </p>
          </div>

          {/* Quick Search & Mobile Filter Toggle */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-72">
              <input
                type="text"
                placeholder="Search apartment, society..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    updateQueryParam({ search: '' });
                  }}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              <span>Filters</span>
              {activeFilters.length > 0 && (
                <span className="w-5 h-5 bg-emerald-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {activeFilters.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ACTIVE FILTER PILLS & SORT ROW */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {activeFilters.length > 0 ? (
              <>
                <span className="text-xs font-semibold text-slate-500 mr-1">Active filters:</span>
                {activeFilters.map((flt) => (
                  <button
                    key={flt.key}
                    type="button"
                    onClick={() => updateQueryParam({ [flt.key]: '' })}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium hover:bg-emerald-100 transition-colors"
                  >
                    <span className="capitalize">{flt.label}</span>
                    <X className="w-3 h-3 text-emerald-600" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline underline-offset-2 ml-1"
                >
                  Clear All
                </button>
              </>
            ) : (
              <span className="text-xs text-slate-500">
                All Bangalore regions & specifications included
              </span>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="sort-select" className="text-xs text-slate-500 font-medium">
              Sort By:
            </label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => updateQueryParam({ sort: e.target.value })}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
            >
              <option value="">Featured (Default)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="area_desc">Area: Largest First</option>
              <option value="newest">Newest Listed</option>
            </select>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-20 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
              Filter Properties
            </h2>
            {activeFilters.length > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-slate-500 hover:text-emerald-600 font-medium"
              >
                Reset
              </button>
            )}
          </div>

          <FilterPanel
            searchParams={searchParams}
            onUpdateFilters={updateQueryParam}
          />
        </aside>

        {/* MOBILE SLIDE-OUT DRAWER */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowMobileFilters(false)}
            />
            <div className="relative ml-auto w-full max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
                    Filters
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterPanel
                  searchParams={searchParams}
                  onUpdateFilters={(params) => {
                    updateQueryParam(params);
                    setShowMobileFilters(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* PROPERTY LISTINGS GRID */}
        <main className="lg:col-span-3 space-y-6">
          {error ? (
            <ErrorState message={error} onRetry={fetchListings} />
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(limit)].map((_, i) => (
                <LoadingSkeleton key={i} />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <EmptyState
              title="No properties found"
              description="We couldn't find any homes matching your specific criteria. Try loosening your price filters or checking other localities."
              onReset={clearAllFilters}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {listings.map((prop) => (
                  <PropertyCard key={prop.listing_id || prop._id} property={prop} />
                ))}
              </div>

              {/* PAGINATION */}
              <div className="pt-6 border-t border-slate-200">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  pageSize={pagination.limit}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
