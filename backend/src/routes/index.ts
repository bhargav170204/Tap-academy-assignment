
import { Router } from 'express';
import auth from './auth.routes';
import attendance from './attendance.routes';
import dashboard from './dashboard.routes';
import manager from './manager.routes';

const router = Router();
router.use('/auth', auth);
router.use('/attendance', attendance);
router.use('/dashboard', dashboard);
router.use('/manager', manager);

export default router;
