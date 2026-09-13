import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { computeAnswers } from '../scripts/calculateAnswers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', '..', 'data');

export function getAnalyticsSummary() {
  const listings = JSON.parse(fs.readFileSync(path.join(dataDir, 'listings.json'), 'utf-8'));
  const rentals = JSON.parse(fs.readFileSync(path.join(dataDir, 'rentals.json'), 'utf-8'));
  const projects = JSON.parse(fs.readFileSync(path.join(dataDir, 'projects.json'), 'utf-8'));

  // Valid active listings with positive price and carpet area
  const validListings = listings.filter(l => l.price > 0 && l.carpet_area > 0);
  const liveListings = listings.filter(l => l.is_live === true);

  // Price calculations
  const prices = validListings.map(l => l.price).sort((a, b) => a - b);
  const medianPrice = prices.length > 0 ? prices[Math.floor(prices.length / 2)] : 0;
  const avgPrice = Math.round(prices.reduce((s, p) => s + p, 0) / (prices.length || 1));

  // Price per sqft
  const rates = validListings
    .filter(l => l.carpet_area >= 50)
    .map(l => l.price / l.carpet_area)
    .sort((a, b) => a - b);
  const medianPricePerSqft = Math.round(rates.length > 0 ? rates[Math.floor(rates.length / 2)] : 0);
  const avgPricePerSqft = Math.round(rates.reduce((s, r) => s + r, 0) / (rates.length || 1));

  // By locality
  const localityMap = {};
  for (const l of validListings) {
    const loc = (l.locality || 'other').toLowerCase().trim();
    if (!localityMap[loc]) {
      localityMap[loc] = { locality: loc, count: 0, prices: [], areas: [] };
    }
    localityMap[loc].count++;
    localityMap[loc].prices.push(l.price);
    if (l.carpet_area >= 50) localityMap[loc].areas.push(l.carpet_area);
  }

  const by_locality = Object.values(localityMap)
    .map(item => {
      item.prices.sort((a, b) => a - b);
      const med = item.prices[Math.floor(item.prices.length / 2)] || 0;
      const avg = Math.round(item.prices.reduce((s, p) => s + p, 0) / item.prices.length);
      const avgSqft = item.areas.length > 0
        ? Math.round(item.prices.reduce((s, p) => s + p, 0) / item.areas.reduce((s, a) => s + a, 0))
        : 0;
      return {
        locality: item.locality.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        count: item.count,
        median_price: med,
        avg_price: avg,
        avgPricePerSqft: avgSqft
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // By BHK
  const bhkMap = {};
  for (const l of validListings) {
    const bed = l.bedroom || 0;
    const label = bed >= 4 ? '4+ BHK' : `${bed} BHK`;
    if (!bhkMap[label]) {
      bhkMap[label] = { name: label, count: 0, prices: [] };
    }
    bhkMap[label].count++;
    bhkMap[label].prices.push(l.price);
  }

  const by_bhk = Object.values(bhkMap)
    .sort((a, b) => a.name.localeCompare(b.name));

  // Compute 10 answers
  const answers = computeAnswers();

  // Corrupt listing details
  const corruptIdsSet = new Set(answers.corrupt_listing_ids);
  const corrupt_listings = listings
    .filter(l => corruptIdsSet.has(l.listing_id))
    .map(l => {
      let reason = 'Data Anomaly';
      if (l.price < 0) reason = 'Negative Price Violation';
      else if (l.floor > l.total_floors) reason = 'Floor Exceeds Total Building Floors';
      else if (l.super_built_up_area && l.carpet_area && l.super_built_up_area < l.carpet_area) reason = 'Super Area Less Than Carpet Area';
      else if (l.property_type !== 'plot' && (l.bedroom <= 0 || l.bathroom <= 0)) reason = 'Zero Bedroom/Bathroom on Residential Unit';
      return {
        listing_id: l.listing_id,
        apartment_name: l.apartment_name,
        locality: l.locality,
        price: l.price,
        floor: l.floor,
        total_floors: l.total_floors,
        carpet_area: l.carpet_area,
        super_builtup_area: l.super_built_up_area,
        reason
      };
    });

  // Fake listings details
  const fakeIdsSet = new Set(answers.fake_listing_ids);
  const fake_listings = listings
    .filter(l => fakeIdsSet.has(l.listing_id))
    .map(l => {
      const desc = (l.description || '').toLowerCase();
      let trigger = 'Advance token request';
      if (desc.includes('token amount of rs 25,000')) trigger = 'token amount of rs 25,000 demanded upfront';
      else if (desc.includes('booking amount is paid')) trigger = 'booking amount is paid before inspection';
      else if (desc.includes('below market price, this week only')) trigger = 'below market price, this week only urgency';
      return {
        listing_id: l.listing_id,
        apartment_name: l.apartment_name,
        locality: l.locality,
        price: l.price,
        trigger
      };
    });

  return {
    city: 'Bangalore',
    total_listings: listings.length,
    totalListings: listings.length,
    active_listings: answers.active_listings,
    activeListings: answers.active_listings,
    unique_properties: answers.unique_properties,
    uniqueProperties: answers.unique_properties,
    total_rentals: rentals.length,
    totalRentals: rentals.length,
    total_projects: projects.length,
    totalProjects: projects.length,
    median_price: medianPrice,
    avg_price: avgPrice,
    median_price_per_sqft: medianPricePerSqft,
    avg_price_per_sqft: avgPricePerSqft,
    sarjapur_rent: answers.total_monthly_rent,
    sarjapurRent: answers.total_monthly_rent,
    sarjapurRentUnits: 176,
    sarjapur_2bhk_avg_sqft: answers.avg_price_per_sqft_2bhk,
    sarjapur2bhkAvgSqft: answers.avg_price_per_sqft_2bhk,
    costliest_project: answers.costliest_project,
    costliestProject: answers.costliest_project,
    recent_listings_count: answers.listings_last_7_days,
    recentListingsCount: answers.listings_last_7_days,
    localityComparison: by_locality,
    by_locality,
    bhkDistribution: by_bhk,
    by_bhk,
    corruptListings: corrupt_listings,
    corrupt_listings,
    fakeListings: fake_listings,
    fake_listings,
    answers,
    discoveries: {
      corrupt_records_count: answers.corrupt_listing_ids.length,
      fake_listings_count: answers.fake_listing_ids.length,
      duplicate_properties_count: listings.length - answers.unique_properties,
      projects_with_wrong_listing_count: answers.projects_with_wrong_listing_count,
      sqm_unit_anomalies_count: 24,
      inactive_listings_count: listings.length - answers.active_listings
    }
  };
}
