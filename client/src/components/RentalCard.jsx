import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize2, Shield, Calendar, Wallet } from 'lucide-react';
import { formatRent, formatINR, formatSqft, formatDate } from '../utils/formatters';

export default function RentalCard({ rental }) {
  if (!rental) return null;

  const {
    listing_id,
    title,
    apartment_name,
    locality,
    price,
    deposit,
    maintenance,
    bedroom,
    bathroom,
    carpet_area,
    furnishing,
    posted_by,
    posted_at
  } = rental;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col group">
      {/* Top Banner */}
      <div className="relative h-44 bg-gradient-to-tr from-teal-900 via-slate-800 to-slate-900 p-4 flex flex-col justify-between overflow-hidden">
        <div className="flex justify-between items-start z-10">
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur-md">
            For Rent
          </span>
          <span className="text-xs text-slate-300 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm flex items-center">
            <Calendar className="w-3 h-3 mr-1 text-slate-400" />
            {formatDate(posted_at)}
          </span>
        </div>

        <div className="z-10">
          <span className="text-xs text-emerald-300 capitalize flex items-center font-medium mb-1">
            <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
            {locality || 'Bangalore'}
          </span>
          <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
            {apartment_name || title}
          </h3>
        </div>
      </div>

      {/* Body Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-slate-600 font-medium line-clamp-1 mb-2">
            {title}
          </p>

          {/* Specs grid */}
          <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-100 text-xs text-slate-600 mb-3">
            <div className="flex items-center space-x-1.5">
              <Bed className="w-4 h-4 text-slate-400" />
              <span className="font-semibold">{bedroom} BHK</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Bath className="w-4 h-4 text-slate-400" />
              <span>{bathroom || 1} Bath</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Maximize2 className="w-4 h-4 text-slate-400" />
              <span className="truncate">{formatSqft(carpet_area)}</span>
            </div>
          </div>

          {/* Deposit & Maintenance Info */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg mb-3">
            <span>Deposit: <strong className="text-slate-700">{formatINR(deposit)}</strong></span>
            {maintenance ? (
              <span>Maint: <strong className="text-slate-700">₹{maintenance}/mo</strong></span>
            ) : (
              <span>Furnishing: <strong className="capitalize text-slate-700">{furnishing?.replace('-', ' ')}</strong></span>
            )}
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="block text-[11px] text-slate-400 font-medium">Monthly Rent</span>
            <span className="text-xl font-black text-emerald-700 tracking-tight">
              {formatRent(price)}
            </span>
          </div>

          <Link
            to={`/rentals/${listing_id}`}
            className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
