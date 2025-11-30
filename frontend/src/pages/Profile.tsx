import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeQuery } from '../services/api';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const token = localStorage.getItem('authToken');
  const nav = useNavigate();
  const { data, isLoading, error } = useMeQuery(undefined, { skip: !token });

  useEffect(() => {
    if (!token) nav('/login');
  }, [token, nav]);

  useEffect(() => {
    if (data?.data) {
      setFormData(data.data);
    }
  }, [data]);

  const handleSave = async () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-chesta mx-auto mb-4"></div>
          <p className="text-brand-blueDarken">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error loading profile</p>
          <button 
            onClick={() => nav('/login')} 
            className="mt-4 px-4 py-2 bg-brand-chesta text-white rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const user = data?.data;

  return (
    <main className="min-h-screen bg-brand-gradient">
      <div className="bg-gradient-to-r from-brand-chesta to-brand-palma shadow">
        <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <button onClick={() => nav('/')} className="px-4 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
            ← Back
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-lg shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Personal Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-gradient-to-r from-brand-chesta to-brand-brightSun text-white rounded-lg hover:shadow-md transition-all"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-1">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-white border-opacity-30 bg-white bg-opacity-10 text-white rounded-lg focus:ring-2 focus:ring-brand-chesta focus:border-transparent outline-none placeholder-white placeholder-opacity-50"
                  />
                ) : (
                  <p className="text-lg text-white">{user?.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">Employee ID</label>
                <p className="text-lg text-white">{user?.employeeId}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-white border-opacity-30 bg-white bg-opacity-10 text-white rounded-lg focus:ring-2 focus:ring-brand-chesta focus:border-transparent outline-none placeholder-white placeholder-opacity-50"
                  />
                ) : (
                  <p className="text-lg text-white">{user?.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">Department</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2 border border-white border-opacity-30 bg-white bg-opacity-10 text-white rounded-lg focus:ring-2 focus:ring-brand-chesta focus:border-transparent outline-none placeholder-white placeholder-opacity-50"
                  />
                ) : (
                  <p className="text-lg text-white">{user?.department || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">Role</label>
                <p className="text-lg font-semibold">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    user?.role === 'manager'
                      ? 'bg-brand-palma text-white'
                      : 'bg-brand-olivia text-white'
                  }`}>
                    {user?.role}
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-blueDarken mb-1">Member Since</label>
                <p className="text-lg text-brand-blueDarken">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                </p>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-gradient-to-r from-brand-olivia to-brand-palma text-white rounded-lg hover:shadow-md transition-all"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(user);
                  }}
                  className="px-6 py-2 bg-brand-brightSun text-brand-blueDarken rounded-lg hover:shadow-md transition-all"
                >
                  Discard
                </button>
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="mt-12 pt-8 border-t-2 border-white border-opacity-20">
            <h3 className="text-lg font-bold text-brand-chesta mb-4">Danger Zone</h3>
            <button
              onClick={() => {
                localStorage.removeItem('authToken');
                nav('/login');
              }}
              className="px-6 py-2 bg-brand-chesta text-white rounded-lg hover:shadow-md transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
