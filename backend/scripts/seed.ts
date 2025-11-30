
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { User } from '../src/models/User.model';
import { Attendance } from '../src/models/Attendance.model';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/attendance';

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected');

  await Attendance.deleteMany({});
  await User.deleteMany({});

  const salt = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  const managerPassword = await bcrypt.hash('Manager@123', salt);

  const manager = await User.create({
    name: 'Demo Manager',
    email: 'manager@company.com',
    password: managerPassword,
    role: 'manager',
    employeeId: 'MGR001',
    department: 'HR'
  });

  const employees = [];
  for (let i=1;i<=10;i++) {
    const password = await bcrypt.hash('Employee@123', salt);
    const emp = await User.create({
      name: `Employee ${i}`,
      email: `employee${i}@company.com`,
      password,
      role: 'employee',
      employeeId: `EMP${100+i}`,
      department: i % 2 === 0 ? 'Engineering' : 'Sales'
    });
    employees.push(emp);
  }

  const days = 60;
  const start = dayjs().subtract(days, 'day');
  for (let d=0; d<days; d++) {
    const date = start.add(d, 'day').format('YYYY-MM-DD');
    for (const emp of employees) {
      const r = Math.random();
      if (r < 0.1) {
        await Attendance.create({ user: emp._id, date, status: 'absent' });
      } else {
        const checkInHour = r < 0.2 ? 9 + Math.floor(Math.random()*3) : 8 + Math.floor(Math.random()*2);
        const checkIn = dayjs(date).hour(checkInHour).minute(Math.floor(Math.random()*60)).toDate();
        let checkOut = dayjs(checkIn).add(8 + Math.floor(Math.random()*2), 'hour').toDate();
        const totalHours = (checkOut.getTime() - checkIn.getTime()) / (1000*60*60);
        const status = checkInHour >= 9 ? 'late' : 'present';
        await Attendance.create({ user: emp._id, date, checkInTime: checkIn, checkOutTime: checkOut, totalHours: Number(totalHours.toFixed(2)), status});
      }
    }
  }

  console.log('Seed done');
  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
