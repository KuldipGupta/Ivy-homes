import { Router } from 'express';
import { getFavourites, getSavedIds, saveFavourite, deleteFavourite } from '../controllers/favouriteController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getFavourites);
router.get('/ids', getSavedIds);
router.post('/', saveFavourite);
router.delete('/:id', deleteFavourite);

export default router;
