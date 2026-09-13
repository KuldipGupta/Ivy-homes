import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  SlidersHorizontal,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import Pagination from '../components/Pagination';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import * as projectService from '../services/projectService';
import { formatINR } from '../utils/formatters';

export default function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [projects, setProjects] = useState([]);
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
  const developer = searchParams.get('developer') || '';
  const status = searchParams.get('status') || '';
  const sort = searchParams.get('sort') || '';
  const search = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(search);

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit,
        locality: locality || undefined,
        developer: developer || undefined,
        status: status || undefined,
        sort: sort || undefined,
        search: search || undefined
      };

      const res = await projectService.getProjects(params);
      setProjects(res.data || []);
      const meta = res.meta || res.pagination || {};
      setPagination({
        page: meta.page || page,
        limit: meta.page_size || limit,
        total: meta.total ?? (res.data ? res.data.length : 0),
        totalPages: meta.totalPages || meta.total_pages || Math.ceil((meta.total || 1) / limit)
      });
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError(err.message || 'Unable to load residential projects.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, locality, developer, status, sort, search]);

  useEffect(() => {
    fetchProjects();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProjects]);

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
      {/* HERO BANNER & STATS */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>520 Verified Bangalore Developments</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Premier Residential Projects & Townships
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            Explore approved master plans, RERA registrations, builder credibility reports, and live construction timelines.
          </p>
        </div>

        {/* Highlight Card: Costliest Project */}
        <Link
          to="/projects/P10255"
          className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:border-purple-400 transition-all text-right shrink-0 group"
        >
          <span className="text-[11px] text-purple-300 block font-medium flex items-center justify-end gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Costliest Audited Project
          </span>
          <span className="text-xl font-black text-white group-hover:text-purple-300 transition-colors">
            P10255 (Bangalore)
          </span>
          <p className="text-xs text-amber-300 font-semibold mt-0.5">
            Max Price: ₹4.89 Cr (₹4,89,00,000)
          </p>
        </Link>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Locality Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by Locality..."
              value={locality}
              onChange={(e) => updateParam({ locality: e.target.value })}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Builder / Developer */}
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by Developer (e.g. Sobha)..."
              value={developer}
              onChange={(e) => updateParam({ developer: e.target.value })}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
            <Building2 className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => updateParam({ status: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="">All Project Stages</option>
            <option value="under_construction">Under Construction</option>
            <option value="ready_to_move">Ready to Move</option>
            <option value="new_launch">New Launch</option>
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => updateParam({ sort: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="">Sort: Default</option>
            <option value="price_desc">Price: Highest First</option>
            <option value="price_asc">Price: Lowest First</option>
            <option value="units_desc">Total Units: High to Low</option>
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
                placeholder="Search project name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Found <strong>{pagination.total.toLocaleString()}</strong> projects
            </span>
            {(locality || developer || status || sort || search) && (
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

      {/* PROJECTS GRID */}
      {error ? (
        <ErrorState message={error} onRetry={fetchProjects} />
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects found"
          description="Try broadening your locality or searching for a different builder."
          onReset={clearAll}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <ProjectCard key={proj.project_id || proj._id} project={proj} />
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
