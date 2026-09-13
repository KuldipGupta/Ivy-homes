import React from 'react';
import { Link } from 'react-router-dom';
import { Building, MapPin, Calendar, CheckCircle2, ShieldCheck, Home } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export default function ProjectCard({ project }) {
  if (!project) return null;

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
    amenities = []
  } = project;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col group">
      {/* Top Banner */}
      <div className="relative h-44 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 p-4 flex flex-col justify-between overflow-hidden">
        <div className="flex justify-between items-start z-10">
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500 text-white backdrop-blur-md capitalize">
            {project_status || 'Under Construction'}
          </span>
          <span className="text-[11px] text-slate-300 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
            {total_listings || 0} active listings
          </span>
        </div>

        <div className="z-10">
          <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wider block mb-0.5">
            {developer_name || 'Premier Builder'}
          </span>
          <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
            {apartment_name}
          </h3>
        </div>
      </div>

      {/* Body Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Locality & RERA */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="flex items-center text-emerald-700 font-medium capitalize">
              <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-600 flex-shrink-0" />
              {locality}
            </span>
            {rera_number && (
              <span className="text-[10px] text-slate-400 font-mono truncate max-w-[130px]" title={rera_number}>
                {rera_number}
              </span>
            )}
          </div>

          {/* Key Specs */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Configuration</span>
              <span className="font-semibold text-slate-700">
                {min_area_sqft} - {max_area_sqft} sq.ft
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Possession</span>
              <span className="font-semibold text-slate-700">
                {possession_date ? possession_date.slice(0, 7) : 'Ready'}
              </span>
            </div>
          </div>

          {/* Amenities sample */}
          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {amenities.slice(0, 4).map((am, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md capitalize">
                  {am}
                </span>
              ))}
              {amenities.length > 4 && (
                <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                  +{amenities.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="block text-[10px] text-slate-400 uppercase font-semibold">Starting From</span>
            <span className="text-base font-extrabold text-slate-900">
              {formatINR(price_min_inr)} - {formatINR(price_max_inr)}
            </span>
          </div>

          <Link
            to={`/projects/${project_id}`}
            className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            Explore
          </Link>
        </div>
      </div>
    </div>
  );
}
