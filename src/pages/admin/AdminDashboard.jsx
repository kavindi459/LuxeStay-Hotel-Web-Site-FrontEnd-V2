import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/api.js';
import Spinner from '../../components/ui/Spinner.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { formatCurrency, formatDate } from '../../utils/formatDate.js';
import {
  BedDouble, CalendarDays, Clock, CheckCircle, XCircle, DollarSign, Users, ArrowRight, MessageSquare, Mail,
} from 'lucide-react';

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/stats').then((res) => {
      setStats(res.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;
  if (!stats) return <div className="text-center py-24 text-red-500">Failed to load stats</div>;

  const maxRevenue = Math.max(...(stats.monthlyRevenue?.map((m) => m.revenue) || [1]));

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <StatCard icon={<BedDouble size={22} className="text-blue-700" />} label="Total Rooms" value={stats.totalRooms} color="bg-blue-50" />
        <StatCard icon={<BedDouble size={22} className="text-green-700" />} label="Available Rooms" value={stats.availableRooms} color="bg-green-50" />
        <StatCard icon={<CalendarDays size={22} className="text-purple-700" />} label="Total Bookings" value={stats.totalBookings} color="bg-purple-50" />
        <StatCard icon={<Clock size={22} className="text-yellow-700" />} label="Pending Bookings" value={stats.pendingBookings} color="bg-yellow-50" />
        <StatCard icon={<CheckCircle size={22} className="text-emerald-700" />} label="Confirmed Bookings" value={stats.confirmedBookings} color="bg-emerald-50" />
        <StatCard icon={<XCircle size={22} className="text-red-700" />} label="Cancelled Bookings" value={stats.cancelledBookings} color="bg-red-50" />
        <StatCard icon={<DollarSign size={22} className="text-amber-700" />} label="Total Revenue" value={formatCurrency(stats.totalRevenue)} color="bg-amber-50" />
        <StatCard icon={<Users size={22} className="text-indigo-700" />} label="Total Users" value={stats.totalUsers} color="bg-indigo-50" />
        <StatCard icon={<MessageSquare size={22} className="text-rose-700" />} label="Unread Messages" value={stats.unreadMessages ?? 0} color="bg-rose-50" />
      </div>

      {/* Monthly Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Monthly Revenue (Last 6 Months)</h2>
        <div className="flex items-end gap-4 h-40">
          {stats.monthlyRevenue?.map((month) => {
            const heightPct = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;
            return (
              <div key={`${month.month}-${month.year}`} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-gray-500">{formatCurrency(month.revenue)}</span>
                <div className="w-full rounded-t-md bg-blue-800 transition-all duration-500" style={{ height: `${Math.max(heightPct, 4)}%` }} />
                <span className="text-xs font-medium text-gray-600">{month.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Manage Bookings', path: '/admin/bookings', color: 'bg-purple-800' },
          { label: 'Manage Rooms', path: '/admin/rooms', color: 'bg-blue-800' },
          { label: 'Manage Users', path: '/admin/users', color: 'bg-indigo-800' },
          { label: 'Manage Gallery', path: '/admin/gallery', color: 'bg-amber-700' },
          { label: 'View Messages', path: '/admin/contacts', color: 'bg-rose-700' },
        ].map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`${link.color} text-white rounded-xl p-5 flex items-center justify-between hover:opacity-90 transition-opacity`}
          >
            <span className="font-semibold text-sm">{link.label}</span>
            <ArrowRight size={16} />
          </Link>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-sm text-blue-800 hover:underline font-medium flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Booking ID', 'Guest Email', 'Room', 'Check-In', 'Status', 'Amount'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(stats.recentBookings || []).slice(0, 5).map((b) => {
                const cat = b.roomId?.category || {};
                return (
                  <tr key={b._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs font-bold text-blue-800">{b.bookingId}</td>
                    <td className="px-4 py-3 text-gray-700">{b.email}</td>
                    <td className="px-4 py-3 text-gray-700">{cat.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(b.checkInDate)}</td>
                    <td className="px-4 py-3"><Badge status={b.status} /></td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrency(b.totalAmount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Contact Messages */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-rose-600" />
            <h2 className="text-lg font-bold text-gray-900">Recent Messages</h2>
            {stats.unreadMessages > 0 && (
              <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {stats.unreadMessages} new
              </span>
            )}
          </div>
        </div>

        {(stats.recentMessages || []).length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">No messages yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {(stats.recentMessages || []).map((msg) => (
              <div key={msg._id} className={`px-6 py-4 flex items-start gap-4 ${!msg.isRead ? 'bg-rose-50' : ''}`}>
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                  <MessageSquare size={15} className="text-rose-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">{msg.name}</span>
                    <span className="text-xs text-gray-400">{msg.email}</span>
                    {!msg.isRead && (
                      <span className="text-xs bg-rose-100 text-rose-600 font-semibold px-2 py-0.5 rounded-full">Unread</span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-blue-800 mt-0.5">{msg.subject}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{msg.message}</p>
                </div>

                <span className="text-xs text-gray-400 shrink-0 mt-0.5">{formatDate(msg.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
