import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Home, ArrowRight, Trash2, ShieldCheck, MapPin } from 'lucide-react';
import { useFavourites } from '../context/FavouritesContext';
import PropertyCard from '../components/PropertyCard';
import EmptyState from '../components/EmptyState';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function SavedFavourites() {
  const { favourites, isLoading } = useFavourites();
  const [filterType, setFilterType] = useState('all');

  const filteredFavourites = favourites.filter((prop) => {
    if (filterType === 'sale') return !prop.deposit;
    if (filterType === 'rent') return !!prop.deposit;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
            <span>Personal Watchlist</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Saved Properties ({favourites.length})
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Properties you've bookmarked for price alerts, site tours, or comparison.
          </p>
        </div>

        {/* TABS */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({favourites.length})
          </button>
          <button
            onClick={() => setFilterType('sale')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterType === 'sale'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            For Sale
          </button>
          <button
            onClick={() => setFilterType('rent')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterType === 'rent'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            For Rent
          </button>
        </div>
      </div>

      {/* BODY */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <LoadingSkeleton key={n} />
          ))}
        </div>
      ) : favourites.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center max-w-lg mx-auto shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Your Watchlist is Empty</h2>
          <p className="text-slate-600 text-sm">
            Save interesting apartments or villas while exploring so you can compare prices and inspect specifications side-by-side.
          </p>
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-md shadow-emerald-700/20"
          >
            <span>Explore Bangalore Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : filteredFavourites.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          No properties found under the selected category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavourites.map((prop) => (
            <PropertyCard key={prop.listing_id || prop._id} property={prop} />
          ))}
        </div>
      )}
    </div>
  );
}
