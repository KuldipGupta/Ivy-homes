import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { normalizeProjectPrice } from '../utils/unitConverter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', '..', 'data');

let projectsCache = [];
let listingsCache = [];

function loadProjectsData() {
  if (projectsCache.length > 0) return projectsCache;
  const filePath = path.join(dataDir, 'projects.json');
  if (fs.existsSync(filePath)) {
    try {
      const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      projectsCache = raw.map(p => ({
        ...p,
        price_min_inr: normalizeProjectPrice(p.price_min),
        price_max_inr: normalizeProjectPrice(p.price_max)
      }));
    } catch (e) {
      console.error('[Error reading projects.json]:', e.message);
    }
  }
  return projectsCache;
}

function loadListingsData() {
  if (listingsCache.length > 0) return listingsCache;
  const filePath = path.join(dataDir, 'listings.json');
  if (fs.existsSync(filePath)) {
    try {
      listingsCache = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {}
  }
  return listingsCache;
}

export function getProjects(params = {}) {
  const all = loadProjectsData();

  let {
    locality,
    project_status,
    sort_by,
    order = 'asc',
    search,
    page = 1,
    limit = 20,
    offset
  } = params;

  page = Math.max(1, parseInt(page, 10) || 1);
  limit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  let filtered = all.filter(p => {
    // Locality
    if (locality && locality.trim() !== '' && locality.toLowerCase() !== 'all') {
      if ((p.locality || '').toLowerCase() !== locality.trim().toLowerCase()) {
        return false;
      }
    }

    // Status
    if (project_status && project_status.trim() !== '' && project_status.toLowerCase() !== 'all') {
      if ((p.project_status || '').toLowerCase() !== project_status.trim().toLowerCase()) {
        return false;
      }
    }

    // Search
    if (search && search.trim() !== '') {
      const s = search.trim().toLowerCase();
      const matchName = (p.apartment_name || '').toLowerCase().includes(s);
      const matchDev = (p.developer_name || '').toLowerCase().includes(s);
      const matchLoc = (p.locality || '').toLowerCase().includes(s);
      if (!matchName && !matchDev && !matchLoc) return false;
    }

    return true;
  });

  // Sorting
  const isDesc = String(order).toLowerCase() === 'desc';
  if (sort_by) {
    filtered.sort((a, b) => {
      let aVal = a[sort_by];
      let bVal = b[sort_by];

      if (sort_by === 'price_min') {
        aVal = a.price_min_inr;
        bVal = b.price_min_inr;
      } else if (sort_by === 'price_max') {
        aVal = a.price_max_inr;
        bVal = b.price_max_inr;
      } else if (sort_by === 'launch_date' || sort_by === 'possession_date') {
        aVal = new Date(aVal || 0).getTime();
        bVal = new Date(bVal || 0).getTime();
      }

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      if (aVal < bVal) return isDesc ? 1 : -1;
      if (aVal > bVal) return isDesc ? -1 : 1;
      return 0;
    });
  }

  const total = filtered.length;
  let startIdx = (page - 1) * limit;
  if (offset !== undefined && offset !== '') {
    startIdx = Math.max(0, parseInt(offset, 10) || 0);
  }

  const results = filtered.slice(startIdx, startIdx + limit);
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page: Math.floor(startIdx / limit) + 1,
    page_size: limit,
    total_pages: totalPages,
    has_more: startIdx + limit < total,
    results
  };
}

export function getProjectById(id) {
  const all = loadProjectsData();
  const project = all.find(p => p.project_id === id);
  if (!project) return null;

  // Retrieve actual linked listings
  const listings = loadListingsData();
  const projectListings = listings.filter(l => l.project_id === id);

  return {
    ...project,
    actual_listings_count: projectListings.length,
    listings: projectListings
  };
}
