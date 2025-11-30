
import { Router } from 'express';
import * as ctrl from '../controllers/attendance.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.post('/checkin', authMiddleware, ctrl.checkin);
router.post('/checkout', authMiddleware, ctrl.checkout);
router.get('/my-history', authMiddleware, ctrl.myHistory);
router.get('/my-summary', authMiddleware, ctrl.mySummary);
router.get('/today', authMiddleware, ctrl.today);

export default router;
