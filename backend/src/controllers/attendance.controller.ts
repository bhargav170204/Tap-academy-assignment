
import { Request, Response, NextFunction } from 'express';
import { Attendance } from '../models/Attendance.model';
import dayjs from 'dayjs';

export const checkin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const date = dayjs().format('YYYY-MM-DD');
    const existing = await Attendance.findOne({ user: user._id, date });
    if (existing && existing.checkInTime) return res.status(400).json({ success: false, error: 'Already checked in' });
    const checkInTime = new Date();
    const status = (new Date(checkInTime).getHours() >= 9 ? 'late' : 'present');
    const attendance = existing
      ? await Attendance.findByIdAndUpdate(existing._id, { checkInTime, status }, { new: true })
      : await Attendance.create({ user: user._id, date, checkInTime, status });
    res.json({ success: true, data: attendance });
  } catch (err) {
    next(err);
  }
};

export const checkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    const date = dayjs().format('YYYY-MM-DD');
    const attendance = await Attendance.findOne({ user: user._id, date });
    if (!attendance || !attendance.checkInTime) return res.status(400).json({ success: false, error: 'Not checked in' });
    if (attendance.checkOutTime) return res.status(400).json({ success: false, error: 'Already checked out' });
    const checkOutTime = new Date();
    const totalHours = (checkOutTime.getTime() - attendance.checkInTime!.getTime()) / (1000*60*60);
    attendance.checkOutTime = checkOutTime;
    attendance.totalHours = Number(totalHours.toFixed(2));
    await attendance.save();
    res.json({ success: true, data: attendance });
  } catch (err) { next(err); }
};

export const myHistory = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { startDate, endDate } = req.query;
  const q: any = { user: user._id };
  if (startDate || endDate) {
    q.date = {};
    if (startDate) q.date.$gte = startDate;
    if (endDate) q.date.$lte = endDate;
  }
  const rows = await Attendance.find(q).sort({ date: -1 });
  res.json({ success: true, data: rows });
};

export const mySummary = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const rows = await Attendance.find({ user: user._id, status: { $ne: 'absent' } });
  const present = rows.filter(r => r.checkInTime).length;
  const avgHours = rows.reduce((s, r) => s + (r.totalHours || 0), 0) / (rows.length || 1);
  res.json({ success: true, data: { presentDays: present, averageHours: Number(avgHours.toFixed(2)) } });
};

export const today = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const date = dayjs().format('YYYY-MM-DD');
  const att = await Attendance.findOne({ user: user._id, date });
  res.json({ success: true, data: att });
};
