import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  BedDouble,
  Tag,
  Users,
  Image,
  Star,
  LogOut,
  Mail,
  Globe,
  ImagePlay,
} from 'lucide-react';
import Alogo1 from '../../assets/Alogo1.png';
import { useAuthStore } from '../../store/authStore.jsx';
import api from '../../config/api.js';
import toast from 'react-hot-toast';

const navLinks = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={18} /> },
  { name: 'Bookings', path: '/admin/bookings', icon: <CalendarDays size={18} /> },
  { name: 'Rooms', path: '/admin/rooms', icon: <BedDouble size={18} /> },
  { name: 'Categories', path: '/admin/categories', icon: <Tag size={18} /> },
  { name: 'Users', path: '/admin/users', icon: <Users size={18} /> },
  { name: 'Gallery', path: '/admin/gallery', icon: <Image size={18} /> },
  { name: 'Reviews', path: '/admin/reviews', icon: <Star size={18} /> },
  { name: 'Destinations', path: '/admin/destinations', icon: <Globe size={18} /> },
  { name: 'BG Images', path: '/admin/bg-images', icon: <ImagePlay size={18} /> },
  { name: 'Messages', path: '/admin/contacts', icon: <Mail size={18} />, badge: true },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { dispatch } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    api.get('/api/contact/?unread=true')
      .then((res) => setUnreadCount(res.data.unreadCount || 0))
      .catch(() => {});
  }, [location.pathname]); // refresh count on every page change

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-gray-700">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <img src={Alogo1} alt="CINNAMON LAKE Hotel" className="h-10 w-auto object-contain" />
        </Link>
        {/* <p className="text-gray-400 text-xs mt-1">Admin Panel</p> */}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-800 text-white shadow-md'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {link.icon}
              <span className="flex-1">{link.name}</span>
              {link.badge && unreadCount > 0 && (
                <span className="bg-rose-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
