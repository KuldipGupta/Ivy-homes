import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { normalizeArea } from '../utils/unitConverter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', '..', 'data');

let listingsCache = [];

function loadListingsData() {
  if (listingsCache.length > 0) return listingsCache;
  const filePath = path.join(dataDir, 'listings.json');
  if (fs.existsSync(filePath)) {
    try {
      listingsCache = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
      console.error('[Error reading listings.json]:', e.message);
    }
  }
  return listingsCache;
}

export function getListings(params = {}) {
  const all = loadListingsData();

  let {
    locality,
    bhk,
    bedroom,
    min_price,
    max_price,
    furnishing,
    property_type,
    sort_by,
    order = 'asc',
    search,
    is_live,
    page = 1,
    limit = 20,
    offset
  } = params;

  page = Math.max(1, parseInt(page, 10) || 1);
  limit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  // Determine BHK
  const targetBhk = bhk !== undefined ? parseInt(bhk, 10) : (bedroom !== undefined ? parseInt(bedroom, 10) : null);

  // Apply filters
  let filtered = all.filter(item => {
    // Locality
    if (locality && locality.trim() !== '' && locality.toLowerCase() !== 'all') {
      if ((item.locality || '').toLowerCase() !== locality.trim().toLowerCase()) {
        return false;
      }
    }

    // BHK
    if (targetBhk !== null && !isNaN(targetBhk)) {
      if (targetBhk === 4) {
        // 4+ BHK
        if (item.bedroom < 4) return false;
      } else {
        if (item.bedroom !== targetBhk) return false;
      }
    }

    // Min Price
    if (min_price !== undefined && min_price !== '') {
      const minP = parseFloat(min_price);
      if (!isNaN(minP) && item.price < minP) return false;
    }

    // Max Price
    if (max_price !== undefined && max_price !== '') {
      const maxP = parseFloat(max_price);
      if (!isNaN(maxP) && item.price > maxP) return false;
    }

    // Furnishing
    if (furnishing && furnishing.trim() !== '' && furnishing.toLowerCase() !== 'all') {
      if ((item.furnishing || '').toLowerCase() !== furnishing.trim().toLowerCase()) {
        return false;
      }
    }

    // Property Type
    if (property_type && property_type.trim() !== '' && property_type.toLowerCase() !== 'all') {
      if ((item.property_type || '').toLowerCase() !== property_type.trim().toLowerCase()) {
        return false;
      }
    }

    // is_live
    if (is_live !== undefined && is_live !== '') {
      const liveBool = is_live === 'true' || is_live === true;
      if (item.is_live !== liveBool) return false;
    }

    // Search term (apartment name, locality, description)
    if (search && search.trim() !== '') {
      const s = search.trim().toLowerCase();
      const matchName = (item.apartment_name || '').toLowerCase().includes(s);
      const matchLoc = (item.locality || '').toLowerCase().includes(s);
      const matchDesc = (item.description || '').toLowerCase().includes(s);
      const matchId = (item.listing_id || '').toLowerCase().includes(s);
      if (!matchName && !matchLoc && !matchDesc && !matchId) return false;
    }

    return true;
  });

  // Sorting
  const isDesc = String(order).toLowerCase() === 'desc';
  if (sort_by) {
    filtered.sort((a, b) => {
      let aVal = a[sort_by];
      let bVal = b[sort_by];

      if (sort_by === 'posted_at') {
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

  // Pagination calculation
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

export function getListingById(id) {
  const all = loadListingsData();
  const listing = all.find(l => l.listing_id === id);
  return listing || null;
}

export function getSimilarListings(id, limit = 6) {
  const target = getListingById(id);
  if (!target) return [];

  const all = loadListingsData();

  // Find properties in the same locality, same BHK, price within ±25%
  const minPrice = target.price * 0.75;
  const maxPrice = target.price * 1.25;

  const similar = all.filter(l => {
    if (l.listing_id === id) return false;
    if (l.locality?.toLowerCase() !== target.locality?.toLowerCase()) return false;
    if (l.bedroom !== target.bedroom) return false;
    if (l.price < minPrice || l.price > maxPrice) return false;
    return true;
  });

  return similar.slice(0, limit);
}
