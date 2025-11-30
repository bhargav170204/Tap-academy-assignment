
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.model';
import bcrypt from 'bcrypt';
import { signAccessToken, signRefreshToken } from '../utils/jwt';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, department, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ success: false, error: 'Email already in use' });
    const validRoles = ['employee', 'manager'];
    const userRole = role && validRoles.includes(role) ? role : 'employee';
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
    const hashed = await bcrypt.hash(password, saltRounds);
    const employeeId = `EMP${Date.now().toString().slice(-6)}`;
    const user = await User.create({ name, email, password: hashed, employeeId, department, role: userRole });
    const access = signAccessToken({ id: user._id, role: user.role });
    const refresh = signRefreshToken({ id: user._id, role: user.role });
    res.status(201).json({ success: true, data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, tokens: { access, refresh } } });
  } catch (err) {
    next(err);
  }
};
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success: false, error: 'Invalid credentials' });
    const access = signAccessToken({ id: user._id, role: user.role });
    const refresh = signRefreshToken({ id: user._id, role: user.role });
    res.json({ success: true, data: { user: { id: user._id, name: user.name, email: user.email, role: user.role }, tokens: { access, refresh } } });
  } catch (err) {
    next(err);
  }
};
export const me = async (req: Request, res: Response) => {
  res.json({ success: true, data: (req as any).user });
};
