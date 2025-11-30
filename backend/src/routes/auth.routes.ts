
import { Router } from 'express';
import { body } from 'express-validator';
import * as ctrl from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', [
  body('name').isLength({ min: 2 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').optional().isIn(['employee', 'manager'])
], validate, ctrl.register);

router.post('/login', [
  body('email').isEmail(),
  body('password').exists()
], validate, ctrl.login);

router.get('/me', authMiddleware, ctrl.me);

export default router;
