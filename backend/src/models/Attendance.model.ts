
import { Schema, model, Document, Types } from 'mongoose';
export interface IAttendance extends Document {
  user: Types.ObjectId;
  date: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  status: 'present'|'absent'|'late'|'half-day';
  totalHours?: number;
  createdAt: Date;
}
const AttendanceSchema = new Schema<IAttendance>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  checkInTime: { type: Date },
  checkOutTime: { type: Date },
  status: { type: String, enum: ['present','absent','late','half-day'], default: 'present' },
  totalHours: { type: Number },
  createdAt: { type: Date, default: Date.now }
});
AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });
export const Attendance = model<IAttendance>('Attendance', AttendanceSchema);
