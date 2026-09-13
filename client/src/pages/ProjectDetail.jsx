import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Building2, 
  Layers, 
  Maximize2, 
  CheckCircle2, 
  Sparkles,
  Phone,
  Mail,
  FileText,
  Share2,
  Check,
  AlertCircle
} from 'lucide-react';
import * as projectService from '../services/projectService';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import { formatINR, formatDate, capitalize } from '../utils/formatters';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Brochure / site visit form
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  useEffect(() => {
    async function loadProject() {
      setLoading(true);
      setError(null);
      try {
        const res = await projectService.getProjectById(id);
        setProject(res.data);
      } catch (err) {
        console.error('Failed to load project detail:', err);
        setError(err.message || 'Project not found.');
      } finally {
        setLoading(false);
      }
    }
    loadProject();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;
    setLeadSubmitted(true);
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

  if (error || !project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <ErrorState
          title="Project Not Found"
          message={error || 'Unable to retrieve project details.'}
          onRetry={() => navigate('/projects')}
        />
      </div>
    );
  }

  const {
    project_id,
    apartment_name,
    developer_name,
    locality,
    project_status,
    total_units,
    total_towers,
    total_floors,
    possession_date,
    rera_number,
    min_area_sqft,
    max_area_sqft,
    total_listings,
    price_min_inr,
    price_max_inr,
    amenities = [],
    description
  } = project;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* BREADCRUMB */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
          <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/projects" className="hover:text-purple-600 transition-colors">Projects</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium truncate max-w-xs">{apartment_name}</span>
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
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 capitalize">
                {project_status || 'Under Construction'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                RERA Registered
              </span>
            </div>

            <div>
              <p className="text-purple-300 text-sm font-semibold tracking-wide uppercase">
                {developer_name || 'Premier Bangalore Developer'}
              </p>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
                {apartment_name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4 text-purple-400" />
                {locality}, Bangalore
              </span>
              {rera_number && (
                <span className="inline-flex items-center gap-1 font-mono text-slate-300">
                  RERA: {rera_number}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                ID: {project_id}
              </span>
            </div>
          </div>

          {/* PRICE RANGE */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-right shrink-0">
            <span className="text-xs text-slate-300 block mb-1">Price Spectrum</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">
              {formatINR(price_min_inr)} - {formatINR(price_max_inr)}
            </span>
            <span className="block text-xs text-slate-300 mt-1">
              Configuration: {min_area_sqft} - {max_area_sqft} sq.ft
            </span>
          </div>
        </div>
      </div>

      {/* TWO-COLUMN DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          {/* ARCHITECTURAL SPECS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Building2 className="w-4 h-4 text-purple-600" /> Total Units
              </span>
              <p className="text-base font-bold text-slate-900">{total_units || 'N/A'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Layers className="w-4 h-4 text-purple-600" /> Towers
              </span>
              <p className="text-base font-bold text-slate-900">{total_towers || 1} Towers</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Maximize2 className="w-4 h-4 text-purple-600" /> Max Floors
              </span>
              <p className="text-base font-bold text-slate-900">{total_floors ? `G + ${total_floors}` : 'Multi-Storey'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-purple-600" /> Possession
              </span>
              <p className="text-base font-bold text-slate-900">
                {possession_date ? formatDate(possession_date) : 'Ready to Move'}
              </p>
            </div>
          </div>

          {/* PROJECT OVERVIEW */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Master Plan & Overview</h2>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {description || 
                `${apartment_name} by ${developer_name || 'reputed builder'} is a master-planned residential township in ${locality}, Bangalore. Spanning across manicured acres, the development offers open green lungs, expansive lifestyle clubhouses, and modern clubhouse facilities.`}
            </p>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4">
              <Link
                to={`/listings?locality=${encodeURIComponent(locality)}`}
                className="px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Browse homes in {locality}</span>
                &rarr;
              </Link>
            </div>
          </div>

          {/* AMENITIES */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">World-Class Clubhouse Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(amenities.length > 0 ? amenities : [
                'Olympic Swimming Pool',
                'Grand Clubhouse',
                'Fully Equipped Gym',
                'Tennis & Badminton Courts',
                'Jogging / Cycling Tracks',
                '24/7 Gated Security',
                'Amphitheatre',
                'Pet Park'
              ]).map((am, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span className="truncate capitalize">{am}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COL: BROCHURE & SITE VISIT */}
        <aside className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {developer_name || 'Authorized Builder Partner'}
                </p>
                <span className="inline-flex items-center gap-1 text-xs text-purple-600 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Official RERA Partner
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-sm">Download Brochure & Price Sheet</h3>

              {leadSubmitted ? (
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-center space-y-2">
                  <Sparkles className="w-6 h-6 text-purple-600 mx-auto" />
                  <p className="font-bold text-sm">Brochure Sent!</p>
                  <p className="text-xs text-purple-700">
                    Floor plans and unit availability have been dispatched to {leadPhone}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Reddy"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-xl font-medium text-xs shadow-md shadow-purple-700/20 transition-all flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Get Instant Master Plan</span>
                  </button>
                </form>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
              <p className="font-semibold text-slate-700">Ivy Homes Quality Seal</p>
              <p className="text-[11px]">
                Verified RERA title certifications, land clear approvals, and sanctioned building floor blueprints.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
