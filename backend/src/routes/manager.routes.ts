
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleGuard } from '../middleware/role.middleware';
import * as ctrl from '../controllers/manager.controller';

const router = Router();

router.get('/attendance/all', authMiddleware, roleGuard('manager'), ctrl.getAllAttendance);
router.get('/attendance/employee/:id', authMiddleware, roleGuard('manager'), ctrl.getEmployeeAttendance);
router.get('/attendance/summary', authMiddleware, roleGuard('manager'), ctrl.getSummary);
router.get('/attendance/export', authMiddleware, roleGuard('manager'), ctrl.exportCSV);
router.get('/attendance/today-status', authMiddleware, roleGuard('manager'), ctrl.todayStatus);

export default router;
