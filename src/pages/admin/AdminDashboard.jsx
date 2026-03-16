import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../config/api.js';
import Spinner from '../../components/ui/Spinner.jsx';
import Badge from '../../components/ui/Badge.jsx';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '../../utils/formatDate.js';
import {
  BedDouble, CalendarDays, Clock, CheckCircle, XCircle, DollarSign, Users,
  ArrowRight, MessageSquare, Mail, Image, ImagePlay, UserCheck, ChevronLeft, ChevronRight,
} from 'lucide-react';

const ROOMS_PER_PAGE    = 8;
const BOOKINGS_PER_PAGE = 5;

const HOME_KEYS = ['homeHero', 'homeRooms', 'homeCategories', 'homeCta'];
const PAGE_KEYS = ['rooms', 'gallery', 'about', 'contact'];

const ALL_LABELS = {
  homeHero:       'Hero Section',
  homeRooms:      'Rooms Section',
  homeCategories: 'Categories Section',
  homeCta:        'CTA Section',
  rooms:          'Rooms Page',
  gallery:        'Gallery Page',
  about:          'About Page',
  contact:        'Contact Page',
};

/* Picker card — uses imageUrl field from BgImage model */
const ImagePickerCard = ({ pageKey, label, imgUrl, bgImages, onChange }) => (
  <div className="border border-gray-200 rounded-xl overflow-hidden">
    <div className="h-28 bg-gray-100 relative">
      {imgUrl ? (
        <img src={imgUrl} alt={label} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-300">
          <Image size={28} />
        </div>
      )}
      <div className="absolute inset-0 bg-black/35 flex items-end p-2">
        <span className="text-white text-xs font-semibold">{label}</span>
      </div>
    </div>
    <div className="p-3 space-y-2">
      <select
        value={imgUrl}
        onChange={(e) => onChange(pageKey, e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-800 bg-white"
      >
        <option value="">— Select Image —</option>
        {bgImages.map((img) => (
          <option key={img._id} value={img.imageUrl}>{img.name}</option>
        ))}
      </select>
      {imgUrl && (
        <button
          onClick={() => onChange(pageKey, '')}
          className="w-full text-xs text-red-500 hover:text-red-700 transition-colors"
        >
          Remove
        </button>
      )}
    </div>
  </div>
);

const PageHeroSettings = () => {
  const [bgImages,  setBgImages]  = useState([]);
  const [selected,  setSelected]  = useState({});
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);

  /* Load library + current settings from API */
  useEffect(() => {
    const fetch = async () => {
      try {
        const [libRes, setRes] = await Promise.all([
          api.get('/api/bgimage/get'),
          api.get('/api/bgimage/settings'),
        ]);
        setBgImages(libRes.data.data || []);
        setSelected(setRes.data.data || {});
      } catch {
        toast.error('Failed to load background image settings');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleChange = (key, value) =>
    setSelected((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/api/bgimage/settings', { sections: selected });
      toast.success('Background images saved!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <ImagePlay size={18} className="text-blue-800" />
          <h2 className="text-lg font-bold text-gray-900">Background Images</h2>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/bg-images"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
          >
            <ImagePlay size={14} /> Manage Library
          </Link>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 ${
              saving ? 'bg-green-600 text-white' : 'bg-blue-800 hover:bg-blue-900 text-white'
            }`}
          >
            {saving ? <Spinner size="sm" /> : null}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : bgImages.length === 0 ? (
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          No background images found.{' '}
          <Link to="/admin/bg-images" className="text-blue-800 font-semibold hover:underline">
            Add images in the BG Images library
          </Link>{' '}
          first.
        </p>
      ) : (
        <>
          {/* Home Page Sections */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Home Page Sections</p>
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {HOME_KEYS.map((key) => (
                <ImagePickerCard
                  key={key}
                  pageKey={key}
                  label={ALL_LABELS[key]}
                  imgUrl={selected[key] || ''}
                  bgImages={bgImages}
                  onChange={handleChange}
                />
              ))}
            </div>
          </div>

          {/* Other Pages */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Other Pages</p>
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {PAGE_KEYS.map((key) => (
                <ImagePickerCard
                  key={key}
                  pageKey={key}
                  label={ALL_LABELS[key]}
                  imgUrl={selected[key] || ''}
                  bgImages={bgImages}
                  onChange={handleChange}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

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

const Pagination = ({ page, totalPages, onPage }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
      <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPage(p => Math.max(1, p - 1))} disabled={page === 1}
          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft size={14} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button key={n} onClick={() => onPage(n)}
            className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
              n === page ? 'bg-blue-800 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
            }`}>
            {n}
          </button>
        ))}
        <button onClick={() => onPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats,        setStats]        = useState(null);
  const [rooms,        setRooms]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [roomPage,     setRoomPage]     = useState(1);
  const [bookingPage,  setBookingPage]  = useState(1);

  useEffect(() => {
    Promise.all([
      api.get('/api/admin/stats'),
      api.get('/api/room/get'),
    ]).then(([statsRes, roomsRes]) => {
      setStats(statsRes.data.data);
      setRooms(roomsRes.data.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;
  if (!stats) return <div className="text-center py-24 text-red-500">Failed to load stats</div>;

  const maxRevenue = Math.max(...(stats.monthlyRevenue?.map((m) => m.revenue) || [1]));

  // Room pagination
  const roomTotalPages   = Math.ceil(rooms.length / ROOMS_PER_PAGE);
  const paginatedRooms   = rooms.slice((roomPage - 1) * ROOMS_PER_PAGE, roomPage * ROOMS_PER_PAGE);

  // Booking pagination
  const allBookings      = stats.recentBookings || [];
  const bookingTotalPages = Math.ceil(allBookings.length / BOOKINGS_PER_PAGE);
  const paginatedBookings = allBookings.slice((bookingPage - 1) * BOOKINGS_PER_PAGE, bookingPage * BOOKINGS_PER_PAGE);

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

      {/* Page Hero Images */}
      <PageHeroSettings />

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

      {/* Room Management Cards */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <BedDouble size={18} className="text-blue-800" />
            <h2 className="text-lg font-bold text-gray-900">Room Management</h2>
            <span className="text-xs text-gray-400 font-normal">({rooms.length} rooms)</span>
          </div>
          <Link to="/admin/rooms" className="text-sm text-blue-800 hover:underline font-medium flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">No rooms found.</div>
        ) : (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
            {paginatedRooms.map((room) => {
              const photo    = room.photos?.[0];
              const catName  = room.category?.name  || 'Uncategorized';
              const catPrice = room.category?.price;
              return (
                <div key={room._id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  {/* Image */}
                  <div className="relative h-40 bg-gray-100">
                    {photo ? (
                      <img
                        src={photo}
                        alt={room.roomID}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <BedDouble size={36} />
                      </div>
                    )}
                    {/* Availability badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        room.availability
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {room.availability ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    {/* Room ID overlay */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                      <p className="text-white text-xs font-mono font-bold">{room.roomID}</p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 space-y-1.5">
                    <p className="font-semibold text-gray-900 text-sm truncate">{catName}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{room.description}</p>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <UserCheck size={12} />
                        <span>Max {room.maxGuests} guests</span>
                      </div>
                      {catPrice && (
                        <span className="text-xs font-bold text-blue-800">
                          ${catPrice.toLocaleString()}<span className="text-gray-400 font-normal">/night</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Pagination page={roomPage} totalPages={roomTotalPages} onPage={setRoomPage} />
          </>
        )}
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
              {paginatedBookings.map((b) => {
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
        <Pagination page={bookingPage} totalPages={bookingTotalPages} onPage={setBookingPage} />
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
