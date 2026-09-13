import { Favourite } from '../models/Favourite.js';
import { isDbConnected } from '../config/db.js';
import { getListingById } from './listingService.js';

// In-memory fallback if MongoDB connection is pending or unavailable
const memoryFavourites = new Map();

function getMemoryKey(email, id) {
  return `${email.toLowerCase()}:${id}`;
}

export async function addFavourite(userEmail, listingId) {
  const email = (userEmail || 'demo@ivy.homes').toLowerCase();
  const listing = getListingById(listingId) || {};

  if (isDbConnected()) {
    try {
      const fav = await Favourite.findOneAndUpdate(
        { userEmail: email, listingId },
        { userEmail: email, listingId, listingData: listing },
        { upsert: true, new: true }
      );
      return fav;
    } catch (e) {
      console.warn('[Favourite DB Upsert Warning]:', e.message);
    }
  }

  // Fallback to in-memory map
  const item = {
    userEmail: email,
    listingId,
    listingData: listing,
    createdAt: new Date()
  };
  memoryFavourites.set(getMemoryKey(email, listingId), item);
  return item;
}

export async function removeFavourite(userEmail, listingId) {
  const email = (userEmail || 'demo@ivy.homes').toLowerCase();

  if (isDbConnected()) {
    try {
      await Favourite.deleteOne({ userEmail: email, listingId });
    } catch (e) {
      console.warn('[Favourite DB Delete Warning]:', e.message);
    }
  }

  memoryFavourites.delete(getMemoryKey(email, listingId));
  return { success: true, listingId };
}

export async function getUserFavourites(userEmail) {
  const email = (userEmail || 'demo@ivy.homes').toLowerCase();

  if (isDbConnected()) {
    try {
      const favs = await Favourite.find({ userEmail: email }).sort({ createdAt: -1 });
      return favs.map(f => ({
        listing_id: f.listingId,
        saved_at: f.createdAt,
        ...f.listingData
      }));
    } catch (e) {
      console.warn('[Favourite DB Find Warning]:', e.message);
    }
  }

  // In-memory fallback
  const results = [];
  for (const [key, val] of memoryFavourites.entries()) {
    if (val.userEmail === email) {
      results.push({
        listing_id: val.listingId,
        saved_at: val.createdAt,
        ...val.listingData
      });
    }
  }
  return results;
}

export async function getFavouriteIds(userEmail) {
  const favs = await getUserFavourites(userEmail);
  return favs.map(f => f.listing_id);
}
