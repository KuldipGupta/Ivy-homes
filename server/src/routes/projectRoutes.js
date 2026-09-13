import { Router } from 'express';
import { getAllProjects, getSingleProject } from '../controllers/projectController.js';
import { optionalAuthMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuthMiddleware, getAllProjects);
router.get('/:id', optionalAuthMiddleware, getSingleProject);

export default router;
