import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  KeyRound, 
  Search, 
  SlidersHorizontal, 
  X, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  DollarSign
} from 'lucide-react';
import RentalCard from '../components/RentalCard';
import Pagination from '../components/Pagination';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import * as rentalService from '../services/rentalService';

export default function RentalsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [rentals, setRentals] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '12', 10);
  const locality = searchParams.get('locality') || '';
  const bhk = searchParams.get('bhk') || '';
  const min_price = searchParams.get('min_price') || '';
  const max_price = searchParams.get('max_price') || '';
  const furnishing = searchParams.get('furnishing') || '';
  const sort = searchParams.get('sort') || '';
  const search = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(search);

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  const fetchRentals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        locality: locality || undefined,
        bhk: bhk || undefined,
        min_price: min_price || undefined,
        max_price: max_price || undefined,
        furnishing: furnishing || undefined,
        sort: sort || undefined,
        search: search || undefined
      };

      const res = await rentalService.getRentals(params);
      setRentals(res.data || []);
      const meta = res.meta || res.pagination || {};
      setPagination({
        page: meta.page || page,
        limit: meta.page_size || limit,
        total: meta.total ?? (res.data ? res.data.length : 0),
        totalPages: meta.totalPages || meta.total_pages || Math.ceil((meta.total || 1) / limit)
      });
    } catch (err) {
      console.error('Failed to load rentals:', err);
      setError(err.message || 'Unable to fetch rental properties.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, locality, bhk, min_price, max_price, furnishing, sort, search]);

  useEffect(() => {
    fetchRentals();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchRentals]);

  const updateParam = (newParams) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === '' || v === null || v === undefined) {
        next.delete(k);
      } else {
        next.set(k, v);
      }
    });
    if (!('page' in newParams)) {
      next.set('page', '1');
    }
    setSearchParams(next);
  };

  const clearAll = () => {
    setSearchParams(new URLSearchParams({ page: '1', limit: '12' }));
    setSearchTerm('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER & BANNER */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Bangalore Rental Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Verified Rental Flats & Apartments
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Zero brokerage scams, verified landlord agreements, and clear deposit schedules across 1,900+ certified homes.
          </p>
        </div>

        {/* Sarjapur rental stat card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-right shrink-0">
          <span className="text-[11px] text-blue-300 block font-medium">Assigned Locality Focus</span>
          <span className="text-xl sm:text-2xl font-black text-white">Sarjapur Road</span>
          <p className="text-xs text-emerald-400 font-semibold mt-0.5">
            ₹70.79 L / month (176 Active Units)
          </p>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Locality Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by Locality..."
              value={locality}
              onChange={(e) => updateParam({ locality: e.target.value })}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* BHK selector */}
          <select
            value={bhk}
            onChange={(e) => updateParam({ bhk: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All BHK Configurations</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
            <option value="4">4+ BHK</option>
          </select>

          {/* Furnishing */}
          <select
            value={furnishing}
            onChange={(e) => updateParam({ furnishing: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Any Furnishing</option>
            <option value="furnished">Furnished</option>
            <option value="semi-furnished">Semi-Furnished</option>
            <option value="unfurnished">Unfurnished</option>
          </select>

          {/* Max Rent Range */}
          <select
            value={max_price}
            onChange={(e) => updateParam({ max_price: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Any Monthly Rent</option>
            <option value="30000">Up to ₹30,000 / mo</option>
            <option value="50000">Up to ₹50,000 / mo</option>
            <option value="75000">Up to ₹75,000 / mo</option>
            <option value="100000">Up to ₹1,00,000 / mo</option>
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => updateParam({ sort: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Sort: Default</option>
            <option value="price_asc">Rent: Low to High</option>
            <option value="price_desc">Rent: High to Low</option>
          </select>
        </div>

        {/* Search & Active pills row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateParam({ search: searchTerm.trim() });
            }}
            className="flex items-center gap-2 max-w-sm w-full"
          >
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search apartment name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Found <strong>{pagination.total.toLocaleString()}</strong> rental homes
            </span>
            {(locality || bhk || max_price || furnishing || sort || search) && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RENTALS GRID */}
      {error ? (
        <ErrorState message={error} onRetry={fetchRentals} />
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      ) : rentals.length === 0 ? (
        <EmptyState
          title="No rentals match criteria"
          description="Try broadening your locality or increasing your rent budget filter."
          onReset={clearAll}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map((rental) => (
              <RentalCard key={rental.listing_id || rental._id} rental={rental} />
            ))}
          </div>

          <div className="pt-6 border-t border-slate-200">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              pageSize={pagination.limit}
              onPageChange={(p) => updateParam({ page: p })}
            />
          </div>
        </>
      )}
    </div>
  );
}
