
import React, { useEffect } from 'react';
import { useMeQuery } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard(){
  const token = localStorage.getItem('authToken');
  const nav = useNavigate();
  const { data, isLoading, error } = useMeQuery(undefined, { skip: !token });

  useEffect(() => {
    if (!token) {
      nav('/login');
    }
  }, [token, nav]);

  if (!token) {
    return <div className="flex items-center justify-center min-h-screen">Redirecting to login...</div>;
  }

  const user = data?.data;
  const isManager = user?.role === 'manager';

  return (
    <main className="min-h-screen bg-brand-gradient">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-chesta to-brand-palma shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-white text-sm opacity-90">Welcome, {user?.name}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/profile" className="px-4 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
              Profile
            </Link>
            <button 
              onClick={() => { localStorage.removeItem('authToken'); nav('/login'); }} 
              className="px-4 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-700 font-medium">Failed to load user data</p>
            <button 
              onClick={() => { localStorage.removeItem('authToken'); nav('/login'); }} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* Welcome Card */}
            <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-lg shadow-lg p-6 text-white">
              <h2 className="text-3xl font-bold mb-2">Welcome, {user.name}! 👋</h2>
              <p className="text-white opacity-75">Employee ID: {user.employeeId}</p>
            </div>

            {/* Navigation Grid */}
            {isManager ? (
              <>
                {/* Manager Navigation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link 
                    to="/manager" 
                    className="bg-gradient-to-br from-brand-blueDarken to-brand-palma text-white rounded-lg shadow p-6 hover:shadow-lg transition-all"
                  >
                    <div className="text-4xl mb-3">📊</div>
                    <h3 className="font-bold text-lg">Dashboard</h3>
                    <p className="text-sm text-white opacity-75 mt-1">Attendance overview</p>
                  </Link>

                  <Link 
                    to="/manager/attendance" 
                    className="bg-gradient-to-br from-brand-chesta to-brand-brightSun text-white rounded-lg shadow p-6 hover:shadow-lg transition-all"
                  >
                    <div className="text-4xl mb-3">📋</div>
                    <h3 className="font-bold text-lg">All Attendance</h3>
                    <p className="text-sm text-white opacity-75 mt-1">View all records</p>
                  </Link>

                  <Link 
                    to="/manager/reports" 
                    className="bg-gradient-to-br from-brand-brightSun to-brand-chesta text-white rounded-lg shadow p-6 hover:shadow-lg transition-all"
                  >
                    <div className="text-4xl mb-3">📥</div>
                    <h3 className="font-bold text-lg">Reports & Export</h3>
                    <p className="text-sm text-white opacity-75 mt-1">Generate CSV reports</p>
                  </Link>
                </div>

                {/* Employee Features Still Available */}
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-brand-blueDarken mb-4">Employee Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link 
                      to="/attendance" 
                      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all"
                    >
                      <div className="text-4xl mb-3">✓</div>
                      <h3 className="font-bold text-lg text-gray-800">Mark Attendance</h3>
                      <p className="text-sm text-gray-500 mt-1">Check-in and check-out</p>
                    </Link>

                    <Link 
                      to="/profile" 
                      className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all"
                    >
                      <div className="text-4xl mb-3">👤</div>
                      <h3 className="font-bold text-lg text-gray-800">My Profile</h3>
                      <p className="text-sm text-gray-500 mt-1">View and edit details</p>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Employee Navigation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link 
                    to="/attendance" 
                    className="bg-gradient-to-br from-brand-chesta to-brand-brightSun text-white rounded-lg shadow p-6 hover:shadow-lg transition-all"
                  >
                    <div className="text-4xl mb-3">✓</div>
                    <h3 className="font-bold text-lg">Mark Attendance</h3>
                    <p className="text-sm text-white opacity-75 mt-1">Check-in / Check-out</p>
                  </Link>

                  <Link 
                    to="/profile" 
                    className="bg-gradient-to-br from-brand-palma to-brand-blueDarken text-white rounded-lg shadow p-6 hover:shadow-lg transition-all"
                  >
                    <div className="text-4xl mb-3">👤</div>
                    <h3 className="font-bold text-lg">My Profile</h3>
                    <p className="text-sm text-white opacity-75 mt-1">Personal information</p>
                  </Link>

                  <div className="bg-gradient-to-br from-brand-olivia to-brand-palma text-white rounded-lg shadow p-6">
                    <div className="text-4xl mb-3">📊</div>
                    <h3 className="font-bold text-lg">My Stats</h3>
                    <p className="text-sm text-white opacity-75 mt-1">Monthly summary</p>
                  </div>
                </div>
              </>
            )}

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-white mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-white opacity-75">Email</p>
                    <p className="text-white font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white opacity-75">Department</p>
                    <p className="text-white font-medium">{user.department || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white opacity-75">Role</p>
                    <p className="text-white font-medium capitalize">{user.role}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-brand-chesta to-brand-brightSun text-white rounded-lg hover:shadow-md transition-all font-medium">
                    📱 Download App
                  </button>
                  <button className="w-full px-4 py-2 bg-brand-olivia text-white rounded-lg hover:shadow-md transition-all font-medium">
                    💬 Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
