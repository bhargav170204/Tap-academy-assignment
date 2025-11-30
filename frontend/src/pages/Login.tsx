
import React, { useState } from 'react';
import { useLoginMutation } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login(){
  const [email, setEmail] = useState('employee1@company.com');
  const [password, setPassword] = useState('Employee@123');
  const [error, setError] = useState('');
  const [role, setRole] = useState<'employee' | 'manager'>('employee');
  const [login, { isLoading }] = useLoginMutation();
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await login({ email, password }).unwrap();
      console.log('Login response:', res);
      const token = res?.data?.tokens?.access || res?.tokens?.access || res?.access;
        const userRole = res?.data?.user?.role || res?.role || role;
      
      if (!token) {
        setError('No token received from server');
        return;
      }
      
      localStorage.setItem('authToken', token);
      if (userRole === 'manager') {
        nav('/manager');
      } else {
        nav('/');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err?.data?.error || err?.message || 'Login failed');
    }
  };

  return (
    <main className="min-h-screen bg-brand-gradient flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-sm mx-4">
        <h1 className="text-4xl font-bold text-brand-blueDarken mb-2 text-center">Attendance App</h1>
        <p className="text-brand-chesta text-center mb-8 font-medium">Employee Attendance Management System</p>
        {/* Role selector - helps users pick employee or manager before login/register */}
        <div className="mb-4 bg-brand-brightSun p-3 rounded-lg border-2 border-brand-chesta">
          <label className="block text-sm font-semibold text-brand-blueDarken mb-3">I am a</label>
          <div className="flex gap-3">
            <label className={`px-4 py-2 rounded-lg cursor-pointer border-2 font-medium transition-all ${role === 'employee' ? 'border-brand-blueDarken bg-brand-chesta text-white' : 'border-brand-olivia text-brand-blueDarken bg-white'}`}>
              <input type="radio" name="role" value="employee" checked={role === 'employee'} onChange={() => setRole('employee')} className="mr-2" />
              Employee
            </label>
            <label className={`px-4 py-2 rounded-lg cursor-pointer border-2 font-medium transition-all ${role === 'manager' ? 'border-brand-blueDarken bg-brand-palma text-white' : 'border-brand-olivia text-brand-blueDarken bg-white'}`}>
              <input type="radio" name="role" value="manager" checked={role === 'manager'} onChange={() => setRole('manager')} className="mr-2" />
              Manager
            </label>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-brand-blueDarken mb-2">Email</label>
            <input 
              required 
              type="email"
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              placeholder="employee@company.com" 
              className="w-full px-4 py-2 border-2 border-brand-chesta rounded-lg focus:ring-2 focus:ring-brand-palma focus:border-brand-palma outline-none text-brand-blueDarken placeholder-brand-olivia"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-brand-blueDarken mb-2">Password</label>
            <input 
              required 
              type="password"
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
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
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t-2 border-brand-chesta">
          <p className="text-sm font-semibold text-brand-blueDarken mb-3">Demo Credentials:</p>
          <div className="bg-brand-brightSun p-4 rounded-lg text-sm text-brand-blueDarken space-y-2 border border-brand-chesta">
            <p><span className="font-bold">Employee:</span> employee1@company.com / Employee@123</p>
            <p><span className="font-bold">Manager:</span> manager@company.com / Manager@123</p>
          </div>
          <p className="text-sm text-brand-olivia text-center mt-4">Don't have an account? <Link to="/register" state={{ role }} className="text-brand-chesta hover:text-brand-blueDarken font-bold underline">Register Here</Link></p>
        </div>
      </div>
    </main>
  );
}
