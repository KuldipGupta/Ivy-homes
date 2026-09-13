import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '..', '..', 'data');

export function computeAnswers() {
  const listings = JSON.parse(fs.readFileSync(path.join(dataDir, 'listings.json'), 'utf-8'));
  const rentals = JSON.parse(fs.readFileSync(path.join(dataDir, 'rentals.json'), 'utf-8'));
  const projects = JSON.parse(fs.readFileSync(path.join(dataDir, 'projects.json'), 'utf-8'));

  // Q1: total_listing_records
  const total_listing_records = listings.length;

  // Q2: unique_properties
  // Deduplicate on physical properties: apartment_name, locality, bedroom, floor, carpet_area, facing_direction
  const propMap = new Map();
  for (const l of listings) {
    const key = [
      (l.apartment_name || '').trim().toLowerCase(),
      (l.locality || '').trim().toLowerCase(),
      l.bedroom,
      l.floor,
      l.carpet_area,
      (l.facing_direction || '').trim().toLowerCase()
    ].join('|');
    if (!propMap.has(key)) {
      propMap.set(key, []);
    }
    propMap.get(key).push(l);
  }
  const unique_properties = propMap.size;

  // Q3: active_listings (is_live === true)
  const active_listings = listings.filter(l => l.is_live === true).length;

  // Q4: corrupt_listing_ids (physically impossible properties)
  // 1. Negative price (price < 0)
  // 2. Floor > total_floors
  // 3. Super built-up area < carpet area
  // 4. Impossible non-plot apartment/villa with 0 bedrooms & 0 bathrooms
  const corruptIdsSet = new Set();
  for (const l of listings) {
    let isCorrupt = false;
    if (l.price < 0) isCorrupt = true;
    if (l.floor !== undefined && l.total_floors !== undefined && l.floor > l.total_floors) isCorrupt = true;
    if (l.super_built_up_area && l.carpet_area && l.super_built_up_area < l.carpet_area) isCorrupt = true;
    if (l.property_type !== 'plot' && (l.bedroom <= 0 || l.bathroom <= 0)) isCorrupt = true;
    if (isCorrupt) {
      corruptIdsSet.add(l.listing_id);
    }
  }
  const corrupt_listing_ids = Array.from(corruptIdsSet).sort();

  // Q5: total_monthly_rent (assigned locality: Sarjapur Road)
  const sarjapurRentals = rentals.filter(r => r.locality && r.locality.trim().toLowerCase() === 'sarjapur road');
  const total_monthly_rent = sarjapurRentals.reduce((sum, r) => sum + (r.price || 0), 0);

  // Q9: fake_listing_ids (advance-fee / inquiry bait phrases)
  const baitPhrases = [
    'token amount of rs 25,000',
    'booking amount is paid',
    'below market price, this week only'
  ];
  const fakeIdsSet = new Set();
  for (const l of listings) {
    const desc = (l.description || '').toLowerCase();
    if (baitPhrases.some(p => desc.includes(p))) {
      fakeIdsSet.add(l.listing_id);
    }
  }
  const fake_listing_ids = Array.from(fakeIdsSet).sort();

  // Q6: avg_price_per_sqft_2bhk
  // Across retrievable listing records where is_live is true and bedroom is 2,
  // leaving out the records in answers to 4 and 9: mean of (price / carpet_area) to 2 decimals
  const eligible2bhk = listings.filter(l => {
    if (l.bedroom !== 2) return false;
    if (l.is_live !== true) return false;
    if (corruptIdsSet.has(l.listing_id)) return false;
    if (fakeIdsSet.has(l.listing_id)) return false;
    return true;
  });

  const sumPricePerSqft = eligible2bhk.reduce((acc, l) => acc + (l.price / l.carpet_area), 0);
  const avg_price_per_sqft_2bhk = Number((sumPricePerSqft / eligible2bhk.length).toFixed(2));

  // Q7: costliest_project
  // Project prices in dataset: values >= 10 are in Lakhs (x 100,000), values < 10 are in Crores (x 10,000,000)
  function toInr(val) {
    if (val === null || val === undefined) return 0;
    return val >= 10 ? Math.round(val * 100000) : Math.round(val * 10000000);
  }

  let costliestProject = null;
  let maxPriceInr = 0;
  for (const p of projects) {
    const inr = toInr(p.price_max);
    if (inr > maxPriceInr) {
      maxPriceInr = inr;
      costliestProject = p;
    }
  }
  const costliest_project = {
    project_id: costliestProject?.project_id || '',
    price_max_inr: maxPriceInr
  };

  // Q8: listings_last_7_days
  // In [REFERENCE - 7 days, REFERENCE) in IST
  // REFERENCE = 2026-09-10T00:00:00+05:30 -> UTC: 2026-09-09T18:30:00.000Z
  // REFERENCE - 7 days = 2026-09-03T00:00:00+05:30 -> UTC: 2026-09-02T18:30:00.000Z
  const refEndMs = Date.parse('2026-09-10T00:00:00+05:30');
  const refStartMs = Date.parse('2026-09-03T00:00:00+05:30');

  const listings_last_7_days = listings.filter(l => {
    const postMs = Date.parse(l.posted_at);
    return postMs >= refStartMs && postMs < refEndMs;
  }).length;

  // Q10: projects_with_wrong_listing_count
  const projectListingCounts = {};
  for (const l of listings) {
    if (l.project_id) {
      projectListingCounts[l.project_id] = (projectListingCounts[l.project_id] || 0) + 1;
    }
  }

  let projects_with_wrong_listing_count = 0;
  for (const p of projects) {
    const actualListings = projectListingCounts[p.project_id] || 0;
    if (p.total_listings !== actualListings) {
      projects_with_wrong_listing_count++;
    }
  }

  return {
    total_listing_records,
    unique_properties,
    active_listings,
    corrupt_listing_ids,
    total_monthly_rent,
    avg_price_per_sqft_2bhk,
    costliest_project,
    listings_last_7_days,
    fake_listing_ids,
    projects_with_wrong_listing_count
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log('Calculating answers from empirical API dataset...\n');
  const answers = computeAnswers();
  console.log(JSON.stringify(answers, null, 2));
}
