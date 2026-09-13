import { Router } from 'express';
import { getAllRentals, getSingleRental } from '../controllers/rentalController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getAllRentals);
router.get('/:id', authMiddleware, getSingleRental);

export default router;
