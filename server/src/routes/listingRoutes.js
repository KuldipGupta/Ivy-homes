import { Router } from 'express';
import { getAllListings, getSingleListing, getSimilar } from '../controllers/listingController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

// Publicly browseable or protected per requirements
router.get('/', authMiddleware, getAllListings);
router.get('/:id', authMiddleware, getSingleListing);
router.get('/:id/similar', authMiddleware, getSimilar);

export default router;
