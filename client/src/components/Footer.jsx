import React from 'react';
import { Building2, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Ivy Homes</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Verified property marketplace built for Bengaluru homebuyers and tenants.
              Empirical data transparency and verified builder listings.
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Bangalore City Scoped · Sep 2026</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Marketplace</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/listings" className="hover:text-emerald-400 transition-colors">Browse Sale Listings</Link></li>
              <li><Link to="/rentals" className="hover:text-emerald-400 transition-colors">Residential Rentals</Link></li>
              <li><Link to="/projects" className="hover:text-emerald-400 transition-colors">Builder Projects</Link></li>
              <li><Link to="/insights" className="hover:text-emerald-400 transition-colors">Bangalore Market Insights</Link></li>
            </ul>
          </div>

          {/* Col 3: Localities */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Top Hubs</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-slate-300">Sarjapur Road (Assigned Locality)</span></li>
              <li><span className="hover:text-slate-300">Whitefield & IT Corridor</span></li>
              <li><span className="hover:text-slate-300">Koramangala & Indiranagar</span></li>
              <li><span className="hover:text-slate-300">HSR Layout & Bellandur</span></li>
            </ul>
          </div>

          {/* Col 4: Assignment info */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">Engineering Internship</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Software Engineering Internship Assignment implementation. Powered by Express.js, MongoDB, React, Vite & Tailwind CSS. Strictly JavaScript / Node.js.
            </p>
            <p className="text-[11px] text-slate-500 mt-2">
              Reference Time: 2026-09-10T00:00:00+05:30
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© 2026 Ivy Homes Marketplace. Built for Kuldip Gupta.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Engineered with high data integrity
          </p>
        </div>
      </div>
    </footer>
  );
}
