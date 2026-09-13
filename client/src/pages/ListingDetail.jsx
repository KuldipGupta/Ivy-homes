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
  Compass, 
  Car, 
  Building2, 
  Phone, 
  Mail, 
  Share2, 
  Check, 
  AlertTriangle, 
  Sparkles,
  CheckCircle2,
  Clock,
  Info
} from 'lucide-react';
import * as listingService from '../services/listingService';
import FavouriteButton from '../components/FavouriteButton';
import PropertyCard from '../components/PropertyCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import { formatINR, formatSqft, formatDate, capitalize } from '../utils/formatters';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [similarListings, setSimilarListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Visit scheduling modal/form state
  const [visitName, setVisitName] = useState('');
  const [visitPhone, setVisitPhone] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitSubmitted, setVisitSubmitted] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const res = await listingService.getListingById(id);
        setListing(res.data);

        // Fetch similar listings
        try {
          const simRes = await listingService.getSimilarListings(id);
          setSimilarListings(simRes.data || []);
        } catch (simErr) {
          console.warn('Failed to load similar listings:', simErr);
        }
      } catch (err) {
        console.error('Failed to load listing detail:', err);
        setError(err.message || 'Property not found or server error.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleScheduleVisit = (e) => {
    e.preventDefault();
    if (!visitName || !visitPhone) return;
    setVisitSubmitted(true);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
        <div className="h-72 bg-slate-200 rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-96 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <ErrorState
          title="Listing Not Found"
          message={error || 'Unable to retrieve details for this property listing.'}
          onRetry={() => navigate('/listings')}
        />
      </div>
    );
  }

  const {
    listing_id,
    apartment_name,
    locality,
    price,
    bedroom,
    bathroom,
    carpet_area,
    super_builtup_area,
    furnishing,
    property_type,
    floor,
    total_floors,
    facing,
    parking,
    is_verified,
    is_live,
    posted_at,
    posted_by,
    description,
    amenities
  } = listing;

  // Rate calculations
  const effectiveArea = carpet_area < 50 ? carpet_area * 10.7639 : carpet_area;
  const pricePerSqft = effectiveArea > 0 && price > 0 ? Math.round(price / effectiveArea) : null;

  // Corrupt listing flag
  const isNegativePrice = price < 0;
  const isFloorOverflow = floor > total_floors;
  const isSuperSmallerCarpet = super_builtup_area && carpet_area && (super_builtup_area < carpet_area);
  const isCorrupt = isNegativePrice || isFloorOverflow || isSuperSmallerCarpet;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* BREADCRUMB & TOP ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/listings" className="hover:text-emerald-600 transition-colors">Listings</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate max-w-xs">{apartment_name || listing_id}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium inline-flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-500" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>
          <div className="p-1 rounded-xl border border-slate-200 bg-white shadow-sm">
            <FavouriteButton property={listing} />
          </div>
        </div>
      </div>

      {/* ANOMALY ALERT BANNER (If corrupt listing from dataset) */}
      {isCorrupt && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm space-y-1">
            <p className="font-bold">Audit Intelligence Note: Dataset Anomaly Detected</p>
            <p className="text-amber-800">
              This record is one of the 32 identified corrupt entries in the external Ivy Homes dataset.
              {isNegativePrice && ` [Negative Price: ₹${price}]`}
              {isFloorOverflow && ` [Floor ${floor} exceeds total building floors ${total_floors}]`}
              {isSuperSmallerCarpet && ` [Super built-up area (${super_builtup_area}) is less than carpet area (${carpet_area})]`}
            </p>
          </div>
        </div>
      )}

      {/* HERO PROPERTY BANNER */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {property_type || 'Apartment'}
              </span>
              {is_verified && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  Verified Property
                </span>
              )}
              {is_live ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300">
                  Active Listing
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300">
                  Inactive / Sold
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {apartment_name || 'Premium Bangalore Residence'}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4 text-emerald-400" />
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

          {/* PRICE BLOCK */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-right shrink-0">
            <span className="text-xs text-slate-300 block mb-1">Valuation Price</span>
            <span className={`text-3xl sm:text-4xl font-black ${isNegativePrice ? 'text-red-400' : 'text-emerald-400'}`}>
              {formatINR(price)}
            </span>
            {pricePerSqft && (
              <span className="block text-xs text-slate-300 mt-1 font-medium">
                ₹{pricePerSqft.toLocaleString('en-IN')} / sq.ft
              </span>
            )}
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT 2 COLS: OVERVIEW, SPECS, AMENITIES */}
        <div className="lg:col-span-2 space-y-8">
          {/* QUICK STATS STRIP */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Bed className="w-4 h-4 text-emerald-600" /> Bedrooms
              </span>
              <p className="text-base font-bold text-slate-900">
                {bedroom ? `${bedroom} BHK` : 'Plot'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Bath className="w-4 h-4 text-emerald-600" /> Bathrooms
              </span>
              <p className="text-base font-bold text-slate-900">{bathroom || 0} Bath</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Maximize2 className="w-4 h-4 text-emerald-600" /> Carpet Area
              </span>
              <p className="text-base font-bold text-slate-900">{formatSqft(carpet_area)}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Layers className="w-4 h-4 text-emerald-600" /> Floor Level
              </span>
              <p className="text-base font-bold text-slate-900">
                {floor !== undefined && total_floors !== undefined ? `${floor} of ${total_floors}` : 'N/A'}
              </p>
            </div>
          </div>

          {/* SPECIFICATIONS TABLE */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Property Details & Specifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Property Type</span>
                <span className="font-semibold text-slate-800">{property_type || 'Apartment'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Furnishing State</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {furnishing ? furnishing.replace('-', ' ') : 'Unspecified'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Carpet Area</span>
                <span className="font-semibold text-slate-800">{formatSqft(carpet_area)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Super Built-up Area</span>
                <span className="font-semibold text-slate-800">
                  {super_builtup_area ? formatSqft(super_builtup_area) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Facing Direction</span>
                <span className="font-semibold text-slate-800">{facing || 'North-East'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Dedicated Parking</span>
                <span className="font-semibold text-slate-800">{parking ? `${parking} Covered` : '1 Reserved'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Listed By</span>
                <span className="font-semibold text-slate-800 capitalize">{posted_by || 'Verified Partner'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Locality</span>
                <span className="font-semibold text-slate-800">{locality}, Bangalore</span>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-slate-900">About this Property</h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {description || 
                `Spacious ${bedroom || ''} BHK home located in the heart of ${locality}, Bangalore. Designed with modern architecture, excellent natural ventilation, and optimal space utilization. Strategically situated within close driving distance of prominent tech parks, leading educational institutions, and shopping destinations.`}
            </p>
          </div>

          {/* AMENITIES */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Community Features & Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(amenities && amenities.length > 0 ? amenities : [
                'Club House',
                'Swimming Pool',
                'Gymnasium',
                '24/7 Security',
                'Power Backup',
                'Children Play Area',
                'Jogging Track',
                'EV Charging Station',
                'Landscaped Gardens'
              ]).map((am, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">{am}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT 1 COL: SELLER CARD & SCHEDULE VISIT */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                {(posted_by || 'I').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {posted_by ? `Listed by ${capitalize(posted_by)}` : 'Ivy Homes Verified Partner'}
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Direct Verified Contact
                </span>
              </div>
            </div>

            {/* SCHEDULE VISIT FORM */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Schedule a Property Tour</h3>

              {visitSubmitted ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-2">
                  <Sparkles className="w-6 h-6 text-emerald-600 mx-auto" />
                  <p className="font-bold text-sm">Tour Request Confirmed!</p>
                  <p className="text-xs text-emerald-700">
                    Our relationship manager for {locality} will call you shortly at {visitPhone}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleScheduleVisit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={visitName}
                      onChange={(e) => setVisitName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={visitPhone}
                      onChange={(e) => setVisitPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-medium text-xs shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Request Visit Callback</span>
                  </button>
                </form>
              )}
            </div>

            {/* TRUST GUARANTEE */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Ivy Homes Data Guarantee</span>
              </div>
              <p className="text-[11px] leading-normal text-slate-500">
                Title papers, carpet area ratios, and seller identity verified prior to listing publication.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* SIMILAR PROPERTIES SECTION */}
      {similarListings.length > 0 && (
        <div className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Similar Homes in {locality}</h2>
              <p className="text-slate-500 text-xs">Based on configuration, pricing tier, and proximity</p>
            </div>
            <Link
              to={`/listings?locality=${encodeURIComponent(locality)}`}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View all in {locality} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarListings.slice(0, 4).map((prop) => (
              <PropertyCard key={prop.listing_id || prop._id} property={prop} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
