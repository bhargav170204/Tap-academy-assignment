import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManagerReports() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('authToken');
  const nav = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    if (!token) nav('/login');
    fetchEmployees();
  }, [token, nav]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`${baseUrl}/manager/attendance/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const empMap = new Map();
        data.data?.forEach((record: any) => {
          if (record.user && !empMap.has(record.user._id)) {
            empMap.set(record.user._id, record.user);
          }
        });
        setEmployees(Array.from(empMap.values()));
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      let url = `${baseUrl}/manager/attendance/all`;
      if (selectedEmployee !== 'all') {
        url = `${baseUrl}/manager/attendance/employee/${selectedEmployee}`;
      }

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        let filtered = data.data || [];
        if (startDate || endDate) {
          filtered = filtered.filter((record: any) => {
            const recordDate = record.date;
            if (startDate && recordDate < startDate) return false;
            if (endDate && recordDate > endDate) return false;
            return true;
          });
        }

        setReportData(filtered.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
    } catch (err) {
      console.error('Error generating report:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async () => {
    try {
      const res = await fetch(`${baseUrl}/manager/attendance/export`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Error exporting CSV:', err);
    }
  };

  const stats = {
    present: reportData.filter(r => r.status === 'present').length,
    absent: reportData.filter(r => r.status === 'absent').length,
    late: reportData.filter(r => r.status === 'late').length,
    avgHours: reportData.length > 0 
      ? (reportData.reduce((sum: number, r: any) => sum + (r.totalHours || 0), 0) / reportData.length).toFixed(2)
      : 0
  };

  return (
    <main className="min-h-screen bg-brand-gradient">
      <div className="bg-gradient-to-r from-brand-chesta to-brand-palma shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Attendance Reports</h1>
          <button onClick={() => nav('/manager')} className="px-4 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Generate Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-brand-blueDarken mb-1">Employee</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full px-4 py-2 border border-brand-olivia rounded-lg focus:ring-2 focus:ring-brand-chesta focus:border-transparent outline-none"
              >
                <option value="all">All Employees</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-blueDarken mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-brand-olivia rounded-lg focus:ring-2 focus:ring-brand-chesta focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-blueDarken mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-brand-olivia rounded-lg focus:ring-2 focus:ring-brand-chesta focus:border-transparent outline-none"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={generateReport}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-brand-chesta to-brand-brightSun text-white rounded-lg hover:shadow-md transition-all disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Generate'}
              </button>
            </div>
          </div>

          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-gradient-to-r from-brand-olivia to-brand-palma text-white rounded-lg hover:shadow-md transition-all"
          >
            📥 Export to CSV
          </button>
        </div>

        {/* Stats Summary */}
        {reportData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-lg shadow p-6">
              <p className="text-white opacity-75 text-sm font-medium">Present</p>
              <p className="text-3xl font-bold text-brand-olivia mt-2">{stats.present}</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-lg shadow p-6">
              <p className="text-white opacity-75 text-sm font-medium">Absent</p>
              <p className="text-3xl font-bold text-brand-chesta mt-2">{stats.absent}</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-lg shadow p-6">
              <p className="text-white opacity-75 text-sm font-medium">Late</p>
              <p className="text-3xl font-bold text-brand-brightSun mt-2">{stats.late}</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-lg shadow p-6">
              <p className="text-white opacity-75 text-sm font-medium">Avg Hours</p>
              <p className="text-3xl font-bold text-brand-palma mt-2">{stats.avgHours}</p>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-white mb-4">Report Data ({reportData.length} records)</h2>

          {reportData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-brand-brightSun to-brand-chesta">
                  <tr>
                    <th className="px-4 py-2 text-left text-white font-semibold">Date</th>
                    <th className="px-4 py-2 text-left text-white font-semibold">Employee</th>
                    <th className="px-4 py-2 text-left text-white font-semibold">Check In</th>
                    <th className="px-4 py-2 text-left text-white font-semibold">Check Out</th>
                    <th className="px-4 py-2 text-left text-white font-semibold">Hours</th>
                    <th className="px-4 py-2 text-left text-white font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((record: any, idx: number) => (
                    <tr key={idx} className="border-b hover:bg-brand-brightSun hover:bg-opacity-10">
                      <td className="px-4 py-2">{record.date}</td>
                      <td className="px-4 py-2">
                        <div>
                          <p className="font-medium text-brand-blueDarken">{record.user?.name}</p>
                          <p className="text-brand-olivia text-xs">{record.user?.email}</p>
                        </div>
                      </td>
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
            <p className="text-brand-olivia py-8 text-center">No data available. Generate a report first.</p>
          )}
        </div>
      </div>
    </main>
  );
}
