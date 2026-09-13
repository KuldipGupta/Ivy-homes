import { Router } from 'express';
import { getSummary } from '../controllers/analyticsController.js';
import { optionalAuthMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/summary', optionalAuthMiddleware, getSummary);

export default router;
