import { Router } from 'express';
import { getDiagnostics, clearDiagnostics } from '../controllers/diagnosticsController.js';

const router = Router();

router.get('/', getDiagnostics);
router.post('/clear', clearDiagnostics);

export default router;
