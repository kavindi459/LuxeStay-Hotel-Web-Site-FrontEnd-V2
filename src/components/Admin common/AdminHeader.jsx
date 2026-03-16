import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.jsx';

const pageTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/bookings': 'Manage Bookings',
  '/admin/rooms': 'Manage Rooms',
  '/admin/categories': 'Manage Categories',
  '/admin/users': 'Manage Users',
  '/admin/gallery': 'Manage Gallery',
  '/admin/reviews': 'Manage Reviews',
};

const AdminHeader = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const title = pageTitles[location.pathname] || 'Admin Panel';

  return (
    <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-white font-bold text-lg">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-white text-sm font-medium">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-gray-400 text-xs">{user?.role}</p>
        </div>
        <img
          src={
            user?.profilePic ||
            `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=1e40af&color=fff`
          }
          alt="avatar"
          className="w-9 h-9 rounded-full object-cover border-2 border-blue-500"
        />
      </div>
    </header>
  );
};

export default AdminHeader;
