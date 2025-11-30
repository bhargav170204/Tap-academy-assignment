import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManagerAttendance() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const token = localStorage.getItem('authToken');
  const nav = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    if (!token) nav('/login');
    fetchAttendance();
  }, [token, nav]);

  const fetchAttendance = async () => {
    try {
      const res = await fetch(`${baseUrl}/manager/attendance/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAttendance(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filterStatus === 'all' 
    ? attendance 
    : attendance.filter(r => r.status === filterStatus);

  return (
    <main className="min-h-screen bg-brand-gradient">
      <div className="bg-gradient-to-r from-brand-chesta to-brand-palma shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">All Employees Attendance</h1>
          <button onClick={() => nav('/manager')} className="px-4 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filter */}
        <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-lg shadow p-6 mb-8">
          <label className="block text-sm font-medium text-white mb-2">Filter by Status</label>
          <div className="flex gap-2">
            {['all', 'present', 'absent', 'late'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg transition-colors font-medium capitalize ${
                  filterStatus === status
                    ? 'bg-gradient-to-r from-brand-chesta to-brand-brightSun text-white'
                    : 'bg-white border border-brand-olivia text-brand-blueDarken hover:bg-brand-brightSun hover:bg-opacity-10'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-lg shadow p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-chesta"></div>
            </div>
          ) : filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-brand-brightSun to-brand-chesta">
                  <tr>
                    <th className="px-4 py-2 text-left text-white font-semibold">Date</th>
                    <th className="px-4 py-2 text-left text-white font-semibold">Employee</th>
                    <th className="px-4 py-2 text-left text-white font-semibold">Department</th>
                    <th className="px-4 py-2 text-left text-white font-semibold">Check In</th>
                    <th className="px-4 py-2 text-left text-white font-semibold">Check Out</th>
                    <th className="px-4 py-2 text-left text-white font-semibold">Hours</th>
                    <th className="px-4 py-2 text-left text-white font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((record: any, idx: number) => (
                    <tr key={idx} className="border-b hover:bg-brand-brightSun hover:bg-opacity-10">
                      <td className="px-4 py-2">{record.date}</td>
                      <td className="px-4 py-2">
                        <div>
                          <p className="font-medium text-brand-blueDarken">{record.user?.name}</p>
                          <p className="text-brand-olivia text-xs">{record.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-2">{record.user?.department || '-'}</td>
                      <td className="px-4 py-2 text-sm">
                        {record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}
                      </td>
                      <td className="px-4 py-2">{record.totalHours ? record.totalHours.toFixed(2) : '-'}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            record.status === 'present'
                              ? 'bg-brand-olivia text-white'
                              : record.status === 'late'
                              ? 'bg-brand-brightSun text-white'
                              : 'bg-brand-chesta text-white'
                          }`}
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-brand-olivia py-8 text-center">No attendance records found</p>
          )}
        </div>
      </div>
    </main>
  );
}
