import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', '..', 'data');

let rentalsCache = [];

function loadRentalsData() {
  if (rentalsCache.length > 0) return rentalsCache;
  const filePath = path.join(dataDir, 'rentals.json');
  if (fs.existsSync(filePath)) {
    try {
      rentalsCache = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
      console.error('[Error reading rentals.json]:', e.message);
    }
  }
  return rentalsCache;
}

export function getRentals(params = {}) {
  const all = loadRentalsData();

  let {
    locality,
    bhk,
    bedroom,
    furnishing,
    min_rent,
    max_rent,
    sort_by,
    order = 'asc',
    search,
    page = 1,
    limit = 20,
    offset
  } = params;

  page = Math.max(1, parseInt(page, 10) || 1);
  limit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  const targetBhk = bhk !== undefined ? parseInt(bhk, 10) : (bedroom !== undefined ? parseInt(bedroom, 10) : null);

  let filtered = all.filter(r => {
    // Locality
    if (locality && locality.trim() !== '' && locality.toLowerCase() !== 'all') {
      if ((r.locality || '').toLowerCase() !== locality.trim().toLowerCase()) {
        return false;
      }
    }

    // BHK
    if (targetBhk !== null && !isNaN(targetBhk)) {
      if (targetBhk === 4) {
        if (r.bedroom < 4) return false;
      } else {
        if (r.bedroom !== targetBhk) return false;
      }
    }

    // Furnishing
    if (furnishing && furnishing.trim() !== '' && furnishing.toLowerCase() !== 'all') {
      if ((r.furnishing || '').toLowerCase() !== furnishing.trim().toLowerCase()) {
        return false;
      }
    }

    // Min Rent
    if (min_rent !== undefined && min_rent !== '') {
      const minVal = parseFloat(min_rent);
      if (!isNaN(minVal) && r.price < minVal) return false;
    }

    // Max Rent
    if (max_rent !== undefined && max_rent !== '') {
      const maxVal = parseFloat(max_rent);
      if (!isNaN(maxVal) && r.price > maxVal) return false;
    }

    // Search
    if (search && search.trim() !== '') {
      const s = search.trim().toLowerCase();
      const matchTitle = (r.title || '').toLowerCase().includes(s);
      const matchApt = (r.apartment_name || '').toLowerCase().includes(s);
      const matchLoc = (r.locality || '').toLowerCase().includes(s);
      if (!matchTitle && !matchApt && !matchLoc) return false;
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

export function getRentalById(id) {
  const all = loadRentalsData();
  const rental = all.find(r => r.listing_id === id);
  return rental || null;
}
