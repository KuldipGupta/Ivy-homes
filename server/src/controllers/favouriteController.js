import { addFavourite, removeFavourite, getUserFavourites, getFavouriteIds } from '../services/favouriteService.js';
import { sendResponse } from '../utils/responseHandler.js';
import { ApiError } from '../utils/apiError.js';

export async function getFavourites(req, res, next) {
  try {
    const userEmail = req.user?.email || 'demo@ivy.homes';
    const favs = await getUserFavourites(userEmail);
    return sendResponse(res, 200, 'Saved properties retrieved', favs, {
      count: favs.length
    });
  } catch (err) {
    next(err);
  }
}

export async function getSavedIds(req, res, next) {
  try {
    const userEmail = req.user?.email || 'demo@ivy.homes';
    const ids = await getFavouriteIds(userEmail);
    return sendResponse(res, 200, 'Saved property IDs retrieved', ids);
  } catch (err) {
    next(err);
  }
}

export async function saveFavourite(req, res, next) {
  try {
    const userEmail = req.user?.email || 'demo@ivy.homes';
    const { id } = req.body;

    if (!id) {
      throw ApiError.badRequest('Property ID is required');
    }

    const saved = await addFavourite(userEmail, id);
    return sendResponse(res, 201, 'Property saved to favourites', saved);
  } catch (err) {
    next(err);
  }
}

export async function deleteFavourite(req, res, next) {
  try {
    const userEmail = req.user?.email || 'demo@ivy.homes';
    const { id } = req.params;

    if (!id) {
      throw ApiError.badRequest('Property ID is required');
    }

    const result = await removeFavourite(userEmail, id);
    return sendResponse(res, 200, 'Property removed from favourites', result);
  } catch (err) {
    next(err);
  }
}
