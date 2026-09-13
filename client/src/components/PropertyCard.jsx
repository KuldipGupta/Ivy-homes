import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Bed, Bath, Maximize2, Calendar, Layers, AlertCircle } from 'lucide-react';
import FavouriteButton from './FavouriteButton';
import { formatINR, formatSqft, formatDate, capitalize } from '../utils/formatters';

export default function PropertyCard({ property }) {
  if (!property) return null;

  const {
    listing_id,
    apartment_name,
    locality,
    price,
    bedroom,
    bathroom,
    carpet_area,
    furnishing,
    property_type,
    floor,
    total_floors,
    is_verified,
    is_live,
    posted_at,
    posted_by
  } = property;

  // Placeholder aesthetic gradient image based on property ID
  const isCorrupt = price < 0 || (floor > total_floors);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col group relative">
      {/* Top Media / Hero Thumbnail */}
      <div className="relative h-48 bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-900 overflow-hidden">
        {/* Subtle decorative architectural pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {is_verified && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur-md shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Verified
            </span>
          )}
          {is_live === false && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/90 text-white backdrop-blur-md">
              Withdrawn / Inactive
            </span>
          )}
          {isCorrupt && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-600 text-white backdrop-blur-md">
              <AlertCircle className="w-3 h-3 mr-1" />
              Data Anomaly
            </span>
          )}
        </div>

        {/* Favorite Button on Card */}
        <div className="absolute top-3 right-3 z-10">
          <FavouriteButton property={property} />
        </div>

        {/* Property Type tag & Locality banner */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white z-10">
          <span className="text-xs font-medium uppercase tracking-wider bg-slate-900/80 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10">
            {property_type || 'Apartment'}
          </span>
          <span className="text-xs text-slate-300 bg-slate-900/60 px-2 py-0.5 rounded backdrop-blur-sm flex items-center">
            <Calendar className="w-3 h-3 mr-1 text-slate-400" />
            {formatDate(posted_at)}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Locality & Seller */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="flex items-center text-emerald-700 font-medium capitalize">
              <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-600 flex-shrink-0" />
              {locality || 'Bangalore'}
            </span>
            <span className="capitalize px-1.5 py-0.5 bg-slate-100 rounded text-[11px] text-slate-600 font-medium">
              By {posted_by || 'Agent'}
            </span>
          </div>

          {/* Title / Apartment Name */}
          <Link to={`/listings/${listing_id}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1 mb-2">
              {apartment_name || 'Independent Residence'}
            </h3>
          </Link>

          {/* Specs Row */}
          <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-100 text-xs text-slate-600 my-2">
            <div className="flex items-center space-x-1.5">
              <Bed className="w-4 h-4 text-slate-400" />
              <span className="font-semibold">{bedroom ? `${bedroom} BHK` : 'Plot'}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Bath className="w-4 h-4 text-slate-400" />
              <span>{bathroom || 0} Bath</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Maximize2 className="w-4 h-4 text-slate-400" />
              <span className="truncate">{formatSqft(carpet_area)}</span>
            </div>
          </div>

          {/* Floor & Furnishing pills */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-3">
            {floor !== undefined && total_floors !== undefined && (
              <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                <Layers className="w-3 h-3 mr-1 text-slate-400" />
                Floor {floor} of {total_floors}
              </span>
            )}
            {furnishing && (
              <span className="capitalize px-2 py-0.5 bg-slate-100 rounded text-slate-600 truncate">
                {furnishing.replace('-', ' ')}
              </span>
            )}
          </div>
        </div>

        {/* Footer: Price & CTA */}
        {(() => {
          const isRental = !!property.deposit || (listing_id && String(listing_id).startsWith('R'));
          const targetUrl = isRental ? `/rentals/${listing_id}` : `/listings/${listing_id}`;
          return (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="block text-[11px] text-slate-400 font-medium">
                  {isRental ? 'Monthly Rent' : 'Offer Price'}
                </span>
                <span className={`text-lg font-extrabold ${price < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                  {price < 0 ? `-₹${Math.abs(price).toLocaleString('en-IN')}` : (isRental ? `₹${price?.toLocaleString('en-IN')}/mo` : formatINR(price))}
                </span>
              </div>

              <Link
                to={targetUrl}
                className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
              >
                View Details
              </Link>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
