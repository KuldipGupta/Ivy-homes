import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Bed, 
  Bath, 
  Maximize2, 
  Layers, 
  KeyRound, 
  Wallet, 
  Users, 
  CheckCircle2, 
  Sparkles,
  Phone,
  Mail,
  Share2,
  Check
} from 'lucide-react';
import * as rentalService from '../services/rentalService';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import { formatRent, formatINR, formatSqft, formatDate, capitalize } from '../utils/formatters';

export default function RentalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Visit scheduling modal/form
  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [scheduled, setScheduled] = useState(false);

  useEffect(() => {
    async function loadRental() {
      setLoading(true);
      setError(null);
      try {
        const res = await rentalService.getRentalById(id);
        setRental(res.data);
      } catch (err) {
        console.error('Failed to load rental details:', err);
        setError(err.message || 'Rental home not found.');
      } finally {
        setLoading(false);
      }
    }
    loadRental();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSchedule = (e) => {
    e.preventDefault();
    if (!tenantName || !tenantPhone) return;
    setScheduled(true);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="h-72 bg-slate-200 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-96 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !rental) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <ErrorState
          title="Rental Listing Not Found"
          message={error || 'Unable to retrieve information for this rental home.'}
          onRetry={() => navigate('/rentals')}
        />
      </div>
    );
  }

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
    preferred_tenant,
    floor,
    total_floors,
    posted_by,
    posted_at,
    description,
    amenities
  } = rental;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* BREADCRUMBS & TOP ROW */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/rentals" className="hover:text-blue-600 transition-colors">Rentals</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate max-w-xs">{apartment_name || title}</span>
        </div>

        <button
          onClick={handleShare}
          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium inline-flex items-center gap-1.5 shadow-sm"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-500" />}
          <span>{copied ? 'Link Copied' : 'Share'}</span>
        </button>
      </div>

      {/* HERO BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Verified Rental
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Zero Brokerage Fraud
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {title || apartment_name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4 text-blue-400" />
                {locality}, Bangalore
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4 text-slate-400" />
                Listed {formatDate(posted_at)}
              </span>
              <span className="inline-flex items-center gap-1">
                ID: {listing_id}
              </span>
            </div>
          </div>

          {/* RENT BREAKDOWN CARD */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-right shrink-0">
            <span className="text-xs text-slate-300 block mb-1">Monthly Rent</span>
            <span className="text-3xl sm:text-4xl font-black text-emerald-400">
              {formatRent(price)}
            </span>
            <div className="mt-2 text-xs text-slate-300 space-y-0.5">
              <p>Security Deposit: <strong>{formatINR(deposit)}</strong></p>
              {maintenance && <p>Maintenance: <strong>₹{maintenance}/mo</strong></p>}
            </div>
          </div>
        </div>
      </div>

      {/* TWO-COLUMN DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          {/* QUICK STATS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Bed className="w-4 h-4 text-blue-600" /> Bedrooms
              </span>
              <p className="text-base font-bold text-slate-900">{bedroom} BHK</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Bath className="w-4 h-4 text-blue-600" /> Bathrooms
              </span>
              <p className="text-base font-bold text-slate-900">{bathroom || 1} Bath</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Maximize2 className="w-4 h-4 text-blue-600" /> Carpet Area
              </span>
              <p className="text-base font-bold text-slate-900">{formatSqft(carpet_area)}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Users className="w-4 h-4 text-blue-600" /> Tenants
              </span>
              <p className="text-base font-bold text-slate-900 capitalize">
                {preferred_tenant || 'All Welcome'}
              </p>
            </div>
          </div>

          {/* RENTAL SPECS */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Rental Terms & Inventory</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Security Deposit</span>
                <span className="font-semibold text-slate-800">{formatINR(deposit)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Furnishing Level</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {furnishing ? furnishing.replace('-', ' ') : 'Semi-Furnished'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Floor Level</span>
                <span className="font-semibold text-slate-800">
                  {floor !== undefined && total_floors !== undefined ? `Floor ${floor} of ${total_floors}` : 'Mid Floor'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Tenant Preference</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {preferred_tenant || 'Family / Working Professionals'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Society Maintenance</span>
                <span className="font-semibold text-slate-800">
                  {maintenance ? `₹${maintenance} / month` : 'Included in rent'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Listed By</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {posted_by || 'Direct Owner'}
                </span>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900">About this Rental Flat</h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {description || 
                `Well-ventilated ${bedroom} BHK flat in ${apartment_name || locality}. Thoughtfully designed layout with natural lighting, modular kitchen cabinets, geysers, and wardrobes. Prime location with immediate access to tech parks, shopping supermarkets, and arterial Bangalore ring roads.`}
            </p>
          </div>

          {/* AMENITIES */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Amenities & Inclusions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(amenities && amenities.length > 0 ? amenities : [
                'Modular Kitchen',
                'Water Heaters / Geysers',
                'Covered Parking',
                '24/7 Security Guard',
                'Power Backup',
                'Lift Access'
              ]).map((am, i) => (
                <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="truncate">{am}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COL: VISIT SCHEDULER */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                {(posted_by || 'L').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {posted_by ? `Managed by ${capitalize(posted_by)}` : 'Direct Owner Listing'}
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> ID Verified Landlord
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Book a Rental Tour</h3>

              {scheduled ? (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-center space-y-2">
                  <Sparkles className="w-6 h-6 text-blue-600 mx-auto" />
                  <p className="font-bold text-sm">Visit Request Received!</p>
                  <p className="text-xs text-blue-700">
                    The owner will call you at {tenantPhone} to coordinate entry access.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSchedule} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Nair"
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={tenantPhone}
                      onChange={(e) => setTenantPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Target Move-in Date</label>
                    <input
                      type="date"
                      value={moveInDate}
                      onChange={(e) => setMoveInDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-medium text-xs shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Request Rental Walkthrough</span>
                  </button>
                </form>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
              <p className="font-semibold text-slate-700">Ivy Homes Tenant Protection</p>
              <p className="text-[11px]">
                Standard legal rental agreement templates, verified title checks, and escrow security deposit guidance.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
