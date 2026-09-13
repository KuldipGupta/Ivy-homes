import { Router } from 'express';
import { getAllListings, getSingleListing, getSimilar } from '../controllers/listingController.js';
import { optionalAuthMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Publicly browseable or enriched when authenticated
router.get('/', optionalAuthMiddleware, getAllListings);
router.get('/:id', optionalAuthMiddleware, getSingleListing);
router.get('/:id/similar', optionalAuthMiddleware, getSimilar);

export default router;
