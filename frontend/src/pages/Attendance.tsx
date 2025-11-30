
import React, { useState } from 'react';
import { useCheckinMutation, useCheckoutMutation, useMyHistoryQuery } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Attendance(){
  const [checkinMsg, setCheckinMsg] = useState('');
  const [checkoutMsg, setCheckoutMsg] = useState('');
  const [checkin, { isLoading: checkinLoading }] = useCheckinMutation();
  const [checkout, { isLoading: checkoutLoading }] = useCheckoutMutation();
  const { data, isLoading } = useMyHistoryQuery(undefined);
  const nav = useNavigate();

  const handleCheckin = async () => {
    try {
      await checkin().unwrap();
      setCheckinMsg('✓ Checked in successfully');
      setTimeout(() => setCheckinMsg(''), 3000);
    } catch (err: any) {
      setCheckinMsg('✗ Check-in failed: ' + (err?.data?.error || 'Unknown error'));
    }
  };

  const handleCheckout = async () => {
    try {
      await checkout().unwrap();
      setCheckoutMsg('✓ Checked out successfully');
      setTimeout(() => setCheckoutMsg(''), 3000);
    } catch (err: any) {
      setCheckoutMsg('✗ Check-out failed: ' + (err?.data?.error || 'Unknown error'));
    }
  };

  return (
    <main className="min-h-screen bg-brand-gradient">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-chesta to-brand-palma shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Attendance</h1>
          <button 
            onClick={() => nav('/')} 
            className="px-4 py-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Check-in/out Section */}
        <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Today's Attendance</h2>
          
          <div className="flex gap-4 mb-6">
            <button 
              onClick={handleCheckin} 
              disabled={checkinLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-olivia to-brand-palma text-white font-medium rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkinLoading ? 'Checking in...' : '✓ Check In'}
            </button>
            <button 
              onClick={handleCheckout} 
              disabled={checkoutLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-chesta to-brand-brightSun text-white font-medium rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkoutLoading ? 'Checking out...' : '✗ Check Out'}
            </button>
          </div>

          {checkinMsg && (
            <div className={`p-3 rounded-lg mb-4 ${checkinMsg.includes('✓') ? 'bg-brand-olivia bg-opacity-10 text-brand-olivia border border-brand-olivia' : 'bg-brand-chesta bg-opacity-10 text-brand-chesta border border-brand-chesta'}`}>
              {checkinMsg}
            </div>
          )}

          {checkoutMsg && (
            <div className={`p-3 rounded-lg ${checkoutMsg.includes('✓') ? 'bg-brand-olivia bg-opacity-10 text-brand-olivia border border-brand-olivia' : 'bg-brand-chesta bg-opacity-10 text-brand-chesta border border-brand-chesta'}`}>
              {checkoutMsg}
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="bg-white bg-opacity-10 backdrop-blur border border-white border-opacity-20 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-white mb-4">Attendance History</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-chesta"></div>
            </div>
          ) : data?.data && data.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-brand-brightSun to-brand-chesta">
                  <tr>
                    <th className="px-4 py-2 text-left text-white font-semibold">Date</th>
                    <th className="px-4 py-2 text-left text-white font-semibold">Check In</th>
                    <th className="px-4 py-2 text-left text-white font-semibold">Check Out</th>
                    <th className="px-4 py-2 text-left text-white font-semibold">Hours</th>
                    <th className="px-4 py-2 text-left text-white font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.slice(0, 20).map((record: any, idx: number) => (
                    <tr key={idx} className="border-b hover:bg-brand-brightSun hover:bg-opacity-10">
                      <td className="px-4 py-2">{record.date}</td>
                      <td className="px-4 py-2 text-sm">{record.checkInTime ? new Date(record.checkInTime).toLocaleTimeString() : '-'}</td>
                      <td className="px-4 py-2 text-sm">{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString() : '-'}</td>
                      <td className="px-4 py-2">{record.totalHours ? record.totalHours.toFixed(2) : '-'}</td>
                      <td className="px-4 py-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          record.status === 'present' ? 'bg-brand-olivia text-white' :
                          record.status === 'late' ? 'bg-brand-brightSun text-white' :
                          'bg-brand-chesta text-white'
                        }`}>
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
