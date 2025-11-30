
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Profile from './pages/Profile';
import ManagerDashboard from './pages/ManagerDashboard';
import ManagerAttendance from './pages/ManagerAttendance';
import ManagerReports from './pages/ManagerReports';
import ManagerCalendar from './pages/ManagerCalendar';

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  const token = localStorage.getItem('authToken');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${baseUrl}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.data);
        } else {
          // Token invalid or expired - clear and force login
          localStorage.removeItem('authToken');
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token, baseUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App(){
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        
        {/* Employee Routes */}
        <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute><Attendance/></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        
        {/* Manager Routes */}
        <Route path="/manager" element={<ProtectedRoute requiredRole="manager"><ManagerDashboard/></ProtectedRoute>} />
        <Route path="/manager/attendance" element={<ProtectedRoute requiredRole="manager"><ManagerAttendance/></ProtectedRoute>} />
        <Route path="/manager/reports" element={<ProtectedRoute requiredRole="manager"><ManagerReports/></ProtectedRoute>} />
        <Route path="/manager/calendar" element={<ProtectedRoute requiredRole="manager"><ManagerCalendar/></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
