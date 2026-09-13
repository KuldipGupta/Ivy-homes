import { Router } from 'express';
import { getAllRentals, getSingleRental } from '../controllers/rentalController.js';
import { optionalAuthMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuthMiddleware, getAllRentals);
router.get('/:id', optionalAuthMiddleware, getSingleRental);

export default router;
