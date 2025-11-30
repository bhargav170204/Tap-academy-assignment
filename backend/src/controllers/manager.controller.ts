
import { Request, Response } from 'express';
import { Attendance } from '../models/Attendance.model';
import { User } from '../models/User.model';
import { attendanceToCSV } from '../services/csv.service';
import dayjs from 'dayjs';

export const getAllAttendance = async (req: Request, res: Response) => {
  const rows = await Attendance.find().populate('user').sort({ date: -1 }).limit(500);
  res.json({ success: true, data: rows });
};

export const getEmployeeAttendance = async (req: Request, res: Response) => {
  const { id } = req.params;
  const rows = await Attendance.find({ user: id }).sort({ date: -1 });
  res.json({ success: true, data: rows });
};

export const getSummary = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  const summary = await Attendance.aggregate([
    { $match: {} },
    { $group: { _id: '$date', count: { $sum: 1 } } },
    { $sort: { _id: -1 } },
    { $limit: 30 }
  ]);
  res.json({ success: true, data: summary });
};

export const exportCSV = async (req: Request, res: Response) => {
  const rows = await Attendance.find().populate('user').limit(200);
  const csv = attendanceToCSV(rows as any);
  res.header('Content-Type', 'text/csv');
  res.attachment(`attendance-${dayjs().format('YYYYMMDD')}.csv`);
  res.send(csv);
};

export const todayStatus = async (req: Request, res: Response) => {
  const today = dayjs().format('YYYY-MM-DD');
  const rows = await Attendance.find({ date: today }).populate('user');
  res.json({ success: true, data: rows });
};
