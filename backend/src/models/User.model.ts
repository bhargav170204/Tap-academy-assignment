
import { Schema, model, Document } from 'mongoose';
export type Role = 'employee' | 'manager';
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  employeeId: string;
  department?: string;
  createdAt: Date;
}
const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee','manager'], default: 'employee' },
  employeeId: { type: String, required: true, unique: true },
  department: { type: String },
  createdAt: { type: Date, default: Date.now }
});
export const User = model<IUser>('User', UserSchema);
