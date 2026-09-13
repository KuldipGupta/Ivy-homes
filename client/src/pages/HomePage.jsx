import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Building2, 
  Home, 
  KeyRound, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ChevronRight,
  BadgeAlert
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import * as listingService from '../services/listingService';
import { formatINR } from '../utils/formatters';

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [searchLocality, setSearchLocality] = useState('');
  const [selectedBhk, setSelectedBhk] = useState('');

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await listingService.getListings({ limit: 6, status: 'active' });
        setFeaturedListings(res.data || []);
      } catch (err) {
        console.error('Failed to load featured listings:', err);
      } finally {
        setLoadingFeatured(false);
      }
    }
    loadFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocality.trim()) params.set('locality', searchLocality.trim());
    if (selectedBhk) params.set('bhk', selectedBhk);
    navigate(`/listings?${params.toString()}`);
  };

  const quickLocalities = [
    'Sarjapur Road',
    'Whitefield',
    'Indiranagar',
    'Bellandur',
    'Electronic City',
    'HSR Layout'
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-medium backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Bangalore's Verified Real Estate Marketplace</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Find Your Dream Home with <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Audited Price Intelligence
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg leading-relaxed">
            Browse through 4,700+ verified listings, certified rental homes, and premier residential developments across Bangalore with complete data transparency.
          </p>

          {/* SEARCH BAR CARD */}
          <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-2xl border border-white/20 text-slate-800">
            <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3 items-center">
              <div className="flex-1 flex items-center gap-3 w-full px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
                <input
                  type="text"
                  placeholder="Enter locality (e.g. Sarjapur Road, Whitefield)..."
                  value={searchLocality}
                  onChange={(e) => setSearchLocality(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-sm text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="w-full md:w-44 px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <select
                  value={selectedBhk}
                  onChange={(e) => setSelectedBhk(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-sm text-slate-700"
                >
                  <option value="">Any BHK</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4+ BHK</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-medium text-sm transition-all shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </form>

            {/* Quick locality tags */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <span className="font-semibold text-slate-600">Popular:</span>
              {quickLocalities.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    setSearchLocality(loc);
                    navigate(`/listings?locality=${encodeURIComponent(loc)}`);
                  }}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-colors font-medium"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* METRICS & BENCHMARK BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Home className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">4,700</p>
              <p className="text-xs text-slate-500 font-medium">Verified Listings</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">3,722</p>
              <p className="text-xs text-slate-500 font-medium">Active & Ready</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">₹21,141</p>
              <p className="text-xs text-slate-500 font-medium">Avg ₹/sq.ft (Sarjapur)</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">520</p>
              <p className="text-xs text-slate-500 font-medium">Bangalore Projects</p>
            </div>
          </div>
        </div>
      </section>

      {/* THREE PILLAR PRODUCT PATHWAYS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/listings"
            className="group relative bg-gradient-to-b from-white to-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Home className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
              Buy Properties
            </h2>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              Explore 4,700 audited homes, penthouses, villas, and plots across Bangalore with strict price validation.
            </p>
            <span className="inline-flex items-center text-sm font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
              Browse Buy Listings <ArrowRight className="w-4 h-4 ml-1" />
            </span>
          </Link>

          <Link
            to="/rentals"
            className="group relative bg-gradient-to-b from-white to-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
              Verified Rentals
            </h2>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              Discover 1,900+ certified rental flats with transparent deposit terms and tenant compatibility checks.
            </p>
            <span className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
              Explore Rental Homes <ArrowRight className="w-4 h-4 ml-1" />
            </span>
          </Link>

          <Link
            to="/projects"
            className="group relative bg-gradient-to-b from-white to-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-purple-500 hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">
              New Developments
            </h2>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              Discover 520 residential township projects from verified tier-1 builders with RERA credentials and delivery schedules.
            </p>
            <span className="inline-flex items-center text-sm font-semibold text-purple-600 group-hover:translate-x-1 transition-transform">
              View Township Projects <ArrowRight className="w-4 h-4 ml-1" />
            </span>
          </Link>
        </div>
      </section>

      {/* SARJAPUR ROAD ASSIGNED LOCALITY SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>Assigned Locality Focus: Sarjapur Road</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Bangalore's High-Growth Tech & Residential Corridor
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Home to major tech parks, premier international schools, and modern gated communities. Our comprehensive audit establishes authoritative benchmarks for this vital corridor:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-emerald-400 text-xl font-bold">₹70,79,400</p>
                <p className="text-xs text-slate-300 mt-1">Total Monthly Rent across 176 Active Units</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-emerald-400 text-xl font-bold">₹21,141 / sq.ft</p>
                <p className="text-xs text-slate-300 mt-1">Verified 2 BHK Benchmark Sale Rate</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-emerald-400 text-xl font-bold">100% Audited</p>
                <p className="text-xs text-slate-300 mt-1">Corrupt Listings & Fraud Neutralized</p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/listings?locality=Sarjapur+Road"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors inline-flex items-center gap-2"
              >
                <span>View Sarjapur Road Homes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/insights"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors inline-flex items-center gap-2"
              >
                <span>Explore Full Audit Report</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Audited Inventory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Featured Properties</h2>
            <p className="text-slate-600 text-sm mt-1">Hand-picked verified listings with verified documentation and transparent pricing.</p>
          </div>
          <Link
            to="/listings"
            className="mt-4 sm:mt-0 inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            <span>View all 4,700 listings</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loadingFeatured ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse space-y-4">
                <div className="w-full h-48 bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
                <div className="flex justify-between pt-2">
                  <div className="h-6 bg-slate-200 rounded w-1/3" />
                  <div className="h-6 bg-slate-200 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((prop) => (
              <PropertyCard key={prop.listing_id || prop._id} property={prop} />
            ))}
          </div>
        )}
      </section>

      {/* WHY IVY HOMES - TRUST & DATA AUDIT VALUE PROP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100 rounded-3xl p-8 sm:p-12 border border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Why Home Buyers Trust Ivy Homes
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              We apply rigorous data engineering and reverse-engineering audits to eliminate duplicates, fake listings, and mathematical anomalies from property portals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Fraud & Scam Neutralization</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Our rule engine automatically detected and quarantined 92 scam listings soliciting advance registration fees or non-refundable booking tokens.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <BadgeAlert className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Zero Mathematical Corruptions</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Every property undergoes a 4-rule integrity pipeline checking for negative pricing, floor overflow, inverted carpet areas, and bedroom discrepancies.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Accurate Rate Benchmarking</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                We normalize unit discrepancies (converting square-meter records to square-feet) to provide reliable price/sq.ft analytics for every locality.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
