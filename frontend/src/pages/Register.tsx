import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRegisterMutation } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const location = useLocation();
  const incomingRole = (location.state as any)?.role as 'employee' | 'manager' | undefined;
  const [role, setRole] = useState<'employee' | 'manager'>(incomingRole || 'employee');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'IT'
  });
  const [error, setError] = useState('');
  const [register, { isLoading }] = useRegisterMutation();
  const nav = useNavigate();

  const departments = ['IT', 'HR', 'Finance', 'Operations', 'Sales', 'Marketing', 'Engineering'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        role
      }).unwrap();

      const token = res?.data?.tokens?.access || res?.tokens?.access || res?.access;
      if (!token) {
        setError('No token received from server');
        return;
      }

      localStorage.setItem('authToken', token);
      const createdRole = res?.data?.user?.role || role;
      if (createdRole === 'manager') {
        nav('/manager');
      } else {
        nav('/');
      }
    } catch (err: any) {
      console.error('Register error:', err);
      setError(err?.data?.error || err?.message || 'Registration failed');
    }
  };

  return (
    <main className="min-h-screen bg-brand-gradient flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-sm mx-4">
        <h1 className="text-4xl font-bold text-brand-blueDarken mb-2 text-center">Create Account</h1>
        <p className="text-brand-chesta text-center mb-6 font-medium">Join the Attendance Management System</p>

        {/* Role Selection */}
        <div className="mb-6 bg-brand-brightSun p-4 rounded-lg border-2 border-brand-chesta">
          <label className="block text-sm font-semibold text-brand-blueDarken mb-3">Select Your Role</label>
          <div className="space-y-2">
            <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${role === 'employee' ? 'border-brand-chesta bg-brand-chesta text-white' : 'border-brand-olivia bg-white'}`}>
              <input
                type="radio"
                name="role"
                value="employee"
                checked={role === 'employee'}
                onChange={() => setRole('employee')}
                className="w-4 h-4"
              />
              <span className="ml-3">
                <span className={`font-bold ${role === 'employee' ? 'text-white' : 'text-brand-blueDarken'}`}>Employee</span>
                <p className={`text-xs ${role === 'employee' ? 'text-white' : 'text-brand-olivia'}`}>Mark attendance & view history</p>
              </span>
            </label>

            <label className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${role === 'manager' ? 'border-brand-palma bg-brand-palma text-white' : 'border-brand-olivia bg-white'}`}>
              <input
                type="radio"
                name="role"
                value="manager"
                checked={role === 'manager'}
                onChange={() => setRole('manager')}
                className="w-4 h-4"
              />
              <span className="ml-3">
                <span className={`font-bold ${role === 'manager' ? 'text-white' : 'text-brand-blueDarken'}`}>Manager</span>
                <p className={`text-xs ${role === 'manager' ? 'text-white' : 'text-brand-olivia'}`}>Manage team & generate reports</p>
              </span>
            </label>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-brand-blueDarken mb-2">Full Name</label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2 border-2 border-brand-chesta rounded-lg focus:ring-2 focus:ring-brand-palma focus:border-brand-palma outline-none text-brand-blueDarken placeholder-brand-olivia"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-blueDarken mb-2">Email</label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@company.com"
              className="w-full px-4 py-2 border-2 border-brand-chesta rounded-lg focus:ring-2 focus:ring-brand-palma focus:border-brand-palma outline-none text-brand-blueDarken placeholder-brand-olivia"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-blueDarken mb-2">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-brand-chesta rounded-lg focus:ring-2 focus:ring-brand-palma focus:border-brand-palma outline-none text-brand-blueDarken"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-blueDarken mb-2">Password</label>
            <input
              required
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border-2 border-brand-chesta rounded-lg focus:ring-2 focus:ring-brand-palma focus:border-brand-palma outline-none text-brand-blueDarken placeholder-brand-olivia"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-brand-blueDarken mb-2">Confirm Password</label>
            <input
              required
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 border-2 border-brand-chesta rounded-lg focus:ring-2 focus:ring-brand-palma focus:border-brand-palma outline-none text-brand-blueDarken placeholder-brand-olivia"
            />
          </div>

          {error && (
            <div className="bg-brand-chesta border-2 border-brand-palma rounded-lg p-3">
              <p className="text-sm text-white font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-3 bg-gradient-to-r from-brand-chesta to-brand-palma text-white font-bold rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t-2 border-brand-chesta text-center">
          <p className="text-sm text-brand-olivia">Already have an account? <Link to="/login" className="text-brand-chesta hover:text-brand-blueDarken font-bold underline">Sign In</Link></p>
        </div>
      </div>
    </main>
  );
}
