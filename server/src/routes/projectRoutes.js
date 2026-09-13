import { Router } from 'express';
import { getAllProjects, getSingleProject } from '../controllers/projectController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getAllProjects);
router.get('/:id', authMiddleware, getSingleProject);

export default router;
