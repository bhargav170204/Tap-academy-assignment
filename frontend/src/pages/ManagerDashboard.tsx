import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManagerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [todayStatus, setTodayStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken');
  const nav = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    if (!token) {
      nav('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await fetch(`${baseUrl}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.data);
        }
        const dashRes = await fetch(`${baseUrl}/dashboard/manager`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (dashRes.ok) {
          const dashData = await dashRes.json();
          setStats(dashData.data);
        }

        const statusRes = await fetch(`${baseUrl}/manager/attendance/today-status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setTodayStatus(statusData.data || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, nav, baseUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-chesta mx-auto mb-4"></div>
          <p className="text-brand-blueDarken">Loading...</p>
        </div>
      </div>
    );
  }

  const presentToday = todayStatus.filter((s: any) => s.status !== 'absent').length;
  const absentToday = todayStatus.filter((s: any) => s.status === 'absent').length;
  const lateToday = todayStatus.filter((s: any) => s.status === 'late').length;

  return (
    <main className="min-h-screen bg-brand-gradient">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-chesta to-brand-palma shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Manager Dashboard</h1>
            <p className="text-white text-sm opacity-90">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={() => { localStorage.removeItem('authToken'); nav('/login'); }}
            className="px-4 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium opacity-75">Total Employees</p>
                <p className="text-3xl font-bold text-brand-brightSun mt-2">{stats?.totalEmployees || 0}</p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium opacity-75">Present Today</p>
                <p className="text-3xl font-bold text-brand-olivia mt-2">{presentToday}</p>
              </div>
              <div className="text-4xl">✓</div>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium opacity-75">Absent Today</p>
                <p className="text-3xl font-bold text-brand-chesta mt-2">{absentToday}</p>
              </div>
              <div className="text-4xl">✗</div>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium opacity-75">Late Today</p>
                <p className="text-3xl font-bold text-brand-brightSun mt-2">{lateToday}</p>
              </div>
              <div className="text-4xl">⏰</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => nav('/manager/attendance')}
            className="bg-gradient-to-br from-brand-chesta to-brand-brightSun text-white rounded-lg shadow p-6 hover:shadow-lg transition-all text-center"
          >
            <div className="text-3xl mb-2">📋</div>
            <div className="font-bold">View All Attendance</div>
          </button>

          <button
            onClick={() => nav('/manager/reports')}
            className="bg-gradient-to-br from-brand-blueDarken to-brand-palma text-white rounded-lg shadow p-6 hover:shadow-lg transition-all text-center"
          >
            <div className="text-3xl mb-2">📊</div>
            <div className="font-bold">Generate Reports</div>
          </button>

          <button
            onClick={() => nav('/manager/calendar')}
            className="bg-gradient-to-br from-brand-olivia to-brand-palma text-white rounded-lg shadow p-6 hover:shadow-lg transition-all text-center"
          >
            <div className="text-3xl mb-2">📅</div>
            <div className="font-bold">Team Calendar</div>
          </button>
        </div>

        {/* Today's Attendance List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-brand-blueDarken mb-4">Today's Attendance</h2>
          
          {todayStatus.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-brand-brightSun to-brand-chesta">
                  <tr>
                    <th className="px-4 py-2 text-left text-white font-semibold">Employee</th>
                    <th className="px-4 py-2 text-left text-white font-semibold">Check In</th>
                    <th className="px-4 py-2 text-left text-white font-semibold">Check Out</th>
                    <th className="px-4 py-2 text-left text-white font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayStatus.slice(0, 10).map((record: any, idx: number) => (
                    <tr key={idx} className="border-b hover:bg-brand-brightSun hover:bg-opacity-10">
                      <td className="px-4 py-2">
                        <div>
                          <p className="font-medium text-brand-blueDarken">{(record as any).user?.name}</p>
                          <p className="text-brand-olivia text-xs">{(record as any).user?.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {record.checkInTime
                          ? new Date(record.checkInTime).toLocaleTimeString()
                          : '-'}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {record.checkOutTime
                          ? new Date(record.checkOutTime).toLocaleTimeString()
                          : '-'}
                      </td>
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
            <p className="text-brand-olivia py-8 text-center">No attendance records today</p>
          )}
        </div>
      </div>
    </main>
  );
}
