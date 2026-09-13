import { getListings, getListingById, getSimilarListings } from '../services/listingService.js';
import { sendResponse } from '../utils/responseHandler.js';
import { ApiError } from '../utils/apiError.js';

export function getAllListings(req, res, next) {
  try {
    const result = getListings(req.query);
    return sendResponse(res, 200, 'Listings fetched successfully', result.results, {
      total: result.total,
      page: result.page,
      page_size: result.page_size,
      total_pages: result.total_pages,
      has_more: result.has_more
    });
  } catch (err) {
    next(err);
  }
}

export function getSingleListing(req, res, next) {
  try {
    const { id } = req.params;
    const listing = getListingById(id);

    if (!listing) {
      throw ApiError.notFound(`Listing with ID '${id}' not found`);
    }

    return sendResponse(res, 200, 'Listing details retrieved', listing);
  } catch (err) {
    next(err);
  }
}

export function getSimilar(req, res, next) {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit, 10) || 6;
    const similar = getSimilarListings(id, limit);

    return sendResponse(res, 200, 'Similar listings retrieved', similar);
  } catch (err) {
    next(err);
  }
}
