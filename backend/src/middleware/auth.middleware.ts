
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.model';
import { verifyAccessToken } from '../utils/jwt';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ success: false, error: 'No token' });
  const token = header.replace('Bearer ', '');
  try {
    const payload: any = verifyAccessToken(token);
    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ success: false, error: 'User not found' });
    (req as any).user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};
