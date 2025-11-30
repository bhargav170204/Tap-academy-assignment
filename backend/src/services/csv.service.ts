
import { Parser } from 'json2csv';
export const attendanceToCSV = (rows: any[]) => {
  const fields = ['date', 'userName', 'userEmail', 'checkInTime', 'checkOutTime', 'status', 'totalHours'];
  const data = rows.map(r => ({
    date: r.date,
    userName: r.user?.name ?? '',
    userEmail: r.user?.email ?? '',
    checkInTime: r.checkInTime?.toISOString() ?? '',
    checkOutTime: r.checkOutTime?.toISOString() ?? '',
    status: r.status,
    totalHours: r.totalHours
  }));
  const parser = new Parser({ fields });
  return parser.parse(data);
};
