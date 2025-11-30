import React, { useEffect, useMemo, useState } from 'react';

type AttendanceRecord = {
  _id: string;
  user: {
    _id: string;
    name: string;
    employeeId?: string;
    department?: string;
  };
  date: string;
  status: 'present' | 'absent' | 'late' | string;
  checkinTime?: string;
  checkoutTime?: string;
  totalHours?: number;
};

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function formatISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function ManagerCalendar() {
  const [current, setCurrent] = useState(() => startOfMonth(new Date()));
  const [events, setEvents] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const token = localStorage.getItem('authToken');
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  const startDate = useMemo(() => formatISODate(startOfMonth(current)), [current]);
  const endDate = useMemo(() => formatISODate(endOfMonth(current)), [current]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError('');
    (async () => {
      try {
        const url = `${baseUrl}/manager/attendance/all?startDate=${startDate}&endDate=${endDate}`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || res.statusText);
        }
        const data = await res.json();
        setEvents(data.data || []);
      } catch (err: any) {
        console.error('Calendar fetch error:', err);
        setError(err?.message || 'Failed to load calendar data');
      } finally {
        setLoading(false);
      }
    })();
  }, [token, baseUrl, startDate, endDate]);

  const weeks = useMemo(() => {
    const first = startOfMonth(current);
    const last = endOfMonth(current);
    const startWeekDay = first.getDay();
    const daysInMonth = last.getDate();

    const cells: Array<{ date: Date; iso: string }> = [];
    for (let i = 0; i < startWeekDay; i++) {
      const d = new Date(first);
      d.setDate(first.getDate() - (startWeekDay - i));
      cells.push({ date: d, iso: formatISODate(d) });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dd = new Date(current.getFullYear(), current.getMonth(), d);
      cells.push({ date: dd, iso: formatISODate(dd) });
    }
    while (cells.length % 7 !== 0) {
      const lastCell = cells[cells.length - 1].date;
      const nd = new Date(lastCell);
      nd.setDate(lastCell.getDate() + 1);
      cells.push({ date: nd, iso: formatISODate(nd) });
    }

    const rows: Array<Array<{ date: Date; iso: string }>> = [];
    for (let r = 0; r < cells.length; r += 7) {
      rows.push(cells.slice(r, r + 7));
    }
    return rows;
  }, [current]);

  const dayStats = useMemo(() => {
    const map = new Map<string, { present: number; absent: number; late: number; items: AttendanceRecord[] }>();
    for (const ev of events) {
      const iso = (ev.date || ev['date'])?.slice?.(0, 10) || '';
      if (!map.has(iso)) map.set(iso, { present: 0, absent: 0, late: 0, items: [] });
      const s = map.get(iso)!;
      if (ev.status === 'present') s.present++;
      else if (ev.status === 'late') s.late++;
      else s.absent++;
      s.items.push(ev);
    }
    return map;
  }, [events]);

  const prevMonth = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const openDay = (iso: string) => setSelectedDay(iso);
  const closeDay = () => setSelectedDay(null);

  return (
    <main className="p-6 min-h-screen bg-brand-gradient">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-brand-blueDarken">Team Calendar</h2>
            <p className="text-sm text-brand-olivia">Month view — color-coded attendance</p>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={prevMonth} className="px-3 py-2 bg-brand-brightSun text-brand-blueDarken rounded font-medium hover:shadow-md transition-all">Prev</button>
            <div className="font-medium text-brand-blueDarken">{current.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
            <button onClick={nextMonth} className="px-3 py-2 bg-brand-brightSun text-brand-blueDarken rounded font-medium hover:shadow-md transition-all">Next</button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12 text-brand-blueDarken">Loading calendar...</div>
        )}

        {error && (
          <div className="bg-brand-chesta bg-opacity-10 border border-brand-chesta p-4 rounded mb-4 text-brand-chesta">{error}</div>
        )}

        <div className="grid grid-cols-7 gap-1 text-sm">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center font-semibold py-2 bg-gradient-to-r from-brand-brightSun to-brand-chesta text-white border rounded">{d}</div>
          ))}

          {weeks.map((week, wi) => (
            <React.Fragment key={wi}>
              {week.map(cell => {
                const iso = cell.iso;
                const inMonth = cell.date.getMonth() === current.getMonth();
                const stats = dayStats.get(iso);
                return (
                  <div
                    key={iso}
                    onClick={() => openDay(iso)}
                    className={`min-h-[90px] p-2 border rounded transition-colors cursor-pointer ${inMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'} hover:shadow`}
                  >
                    <div className="flex justify-between items-start">
                      <div className={`text-xs font-medium ${inMonth ? 'text-gray-800' : 'text-gray-400'}`}>{cell.date.getDate()}</div>
                      <div className="text-xs text-gray-500">&nbsp;</div>
                    </div>

                    <div className="mt-2">
                      {stats ? (
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center justify-start space-x-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                            <span className="text-xs">{stats.present} present</span>
                          </div>
                          <div className="flex items-center justify-start space-x-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                            <span className="text-xs">{stats.late} late</span>
                          </div>
                          <div className="flex items-center justify-start space-x-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                            <span className="text-xs">{stats.absent} absent</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400">No records</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        {/* Day modal */}
        {selectedDay && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 border-l-4 border-brand-chesta">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-brand-blueDarken">Attendance for {selectedDay}</h3>
                  <p className="text-sm text-brand-olivia">Click an entry to view more details</p>
                </div>
                <button onClick={closeDay} className="text-brand-olivia hover:text-brand-blueDarken font-bold">✕</button>
              </div>

              <div className="space-y-3 max-h-80 overflow-auto">
                {(dayStats.get(selectedDay)?.items || []).length === 0 && (
                  <div className="text-center text-brand-olivia">No attendance records for this day.</div>
                )}

                {(dayStats.get(selectedDay)?.items || []).map(item => (
                  <div key={item._id} className="p-3 border-l-4 border-brand-chesta bg-white rounded flex justify-between items-center hover:shadow-md transition-all">
                    <div>
                      <div className="font-medium text-brand-blueDarken">{item.user?.name || 'Unknown'}</div>
                      <div className="text-xs text-brand-olivia">{item.user?.employeeId || item.user?._id} • {item.user?.department || '—'}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-semibold capitalize px-2 py-1 rounded ${
                        item.status === 'present' ? 'bg-brand-olivia text-white' :
                        item.status === 'late' ? 'bg-brand-brightSun text-brand-blueDarken' :
                        'bg-brand-chesta text-white'
                      }`}>{item.status}</div>
                      <div className="text-xs text-brand-olivia mt-1">{item.checkinTime ? new Date(item.checkinTime).toLocaleTimeString() : '—'} - {item.checkoutTime ? new Date(item.checkoutTime).toLocaleTimeString() : '—'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
