
import { Request, Response } from 'express';
import { Attendance } from '../models/Attendance.model';
import { User } from '../models/User.model';
import dayjs from 'dayjs';

export const employeeDashboard = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const date = dayjs().format('YYYY-MM-DD');
  const today = await Attendance.findOne({ user: user._id, date });
  const summary = await Attendance.find({ user: user._id }).limit(30).sort({ date: -1 });
  res.json({ success: true, data: { today, recent: summary } });
};

export const managerDashboard = async (req: Request, res: Response) => {
  const totalEmployees = await User.countDocuments({ role: 'employee' });
  const today = dayjs().format('YYYY-MM-DD');
  const present = await Attendance.countDocuments({ date: today, status: { $ne: 'absent' } });
  res.json({ success: true, data: { totalEmployees, presentToday: present } });
};
