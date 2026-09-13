import { getRentals, getRentalById } from '../services/rentalService.js';
import { sendResponse } from '../utils/responseHandler.js';
import { ApiError } from '../utils/apiError.js';

export function getAllRentals(req, res, next) {
  try {
    const result = getRentals(req.query);
    return sendResponse(res, 200, 'Rentals fetched successfully', result.results, {
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

export function getSingleRental(req, res, next) {
  try {
    const { id } = req.params;
    const rental = getRentalById(id);

    if (!rental) {
      throw ApiError.notFound(`Rental with ID '${id}' not found`);
    }

    return sendResponse(res, 200, 'Rental details retrieved', rental);
  } catch (err) {
    next(err);
  }
}
