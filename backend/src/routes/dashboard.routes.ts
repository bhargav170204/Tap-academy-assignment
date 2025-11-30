
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import * as ctrl from '../controllers/dashboard.controller';

const router = Router();
router.get('/employee', authMiddleware, ctrl.employeeDashboard);
router.get('/manager', authMiddleware, ctrl.managerDashboard);

export default router;
